import { Component, inject, OnInit } from '@angular/core';
import { Generator, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { Button, ButtonDirective } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import { GetGeneratorsResponse, GetLookupResponse, UpsertGeneratorResponse } from '@/core/services/api/response';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UpsertGeneratorRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { LookupDomain } from '@/core/enums/enum';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-generators.component',
    imports: [Button, TableModule, IconField, InputText, InputIcon, ButtonDirective, Dialog, ReactiveFormsModule, Select, InputNumber],
    templateUrl: './generators.component.html',
    styleUrl: './generators.component.scss',
    standalone: true
})
export class GeneratorsComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    generators: Generator[] = [];
    loading: boolean = true;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;
    selectGenerators: Generator[] = [];
    isGeneratorDialogOpen: boolean = false;
    isGeneratorSaving: boolean = false;

    generatorForm: FormGroup;
    selectedGeneratorId: number = -1;

    generatorStatusCodes: SelectOptionStrValue[] = [];
    isGeneratorStatusCodesLoading: boolean = false;

    constructor(private fb: FormBuilder) {
        this.generatorForm = this.fb.group(
            {
                code: [null, Validators.required],
                description: [null, Validators.required],
                location: [null, Validators.required],

                size: [null],
                capacity: [null, [Validators.min(0)]],
                capacityUnit: [null],

                model: [null],
                manufacturer: [null],
                serialNumber: [null],

                voltage: [null],
                phase: [null],
                frequency: [null],
                amperage: [null, [Validators.min(0)]],

                statusCode: [null, Validators.required]
            },
            {
                validators: [this.capacityUnitRequiredWhenCapacityProvided()]
            }
        );
    }

    ngOnInit(): void {
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            }
        });

        this.generatorOwnerService.getLookup({ domain: LookupDomain.GENERATOR_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.generatorStatusCodes = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
                this.isGeneratorStatusCodesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.generatorStatusCodes = [];
                this.isGeneratorStatusCodesLoading = false;
            }
        });
    }

    // ----------------------------
    // Data table functions
    // ----------------------------
    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
    }

    next() {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    isLastPage(): boolean {
        return this.first + this.rows >= this.generators.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.generators?.length) return;

        let listToExport: Generator[] = this.generators;
        if (this.selectGenerators.length > 0) {
            listToExport = this.selectGenerators;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generators.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // ----------------------------
    // Dialog functions
    // ----------------------------
    openNew() {
        this.selectedGeneratorId = -1;

        this.generatorForm.reset({
            code: null,
            description: null,
            location: null,
            size: null,
            capacity: null,
            capacityUnit: null,
            model: null,
            manufacturer: null,
            serialNumber: null,
            voltage: null,
            phase: null,
            frequency: null,
            amperage: null,
            statusCode: null,
            statusDescription: null
        });

        this.isGeneratorDialogOpen = true;
    }

    editGenerator(generator: Generator) {
        this.selectedGeneratorId = generator.id;

        this.generatorForm.patchValue({
            code: generator.code ?? null,
            description: generator.description ?? null,
            location: generator.location ?? null,
            size: generator.size ?? null,
            capacity: generator.capacity ?? null,
            capacityUnit: generator.capacityUnit ?? null,
            model: generator.model ?? null,
            manufacturer: generator.manufacturer ?? null,
            serialNumber: generator.serialNumber ?? null,
            voltage: generator.voltage ?? null,
            phase: generator.phase ?? null,
            frequency: generator.frequency ?? null,
            amperage: generator.amperage ?? null,
            statusCode: generator.statusCode ?? null,
            statusDescription: generator.statusDescription ?? null
        });

        this.isGeneratorDialogOpen = true;
    }

    hideDialog() {
        this.isGeneratorDialogOpen = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.generators.length; i++) {
            if (this.generators[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    async saveGenerator() {
        this.isGeneratorSaving = true;
        this.generatorForm.markAllAsTouched();
        this.generatorForm.updateValueAndValidity();

        if (!this.generatorForm.valid) {
            this.isGeneratorSaving = false;
            return;
        }

        const upsertGeneratorRequest: UpsertGeneratorRequest = {
            id: this.selectedGeneratorId,
            code: this.toRequiredString(this.generatorForm.get('code')?.value),
            description: this.toRequiredString(this.generatorForm.get('description')?.value),
            location: this.toRequiredString(this.generatorForm.get('location')?.value),

            size: this.toOptionalString(this.generatorForm.get('size')?.value),
            capacity: this.toOptionalNumber(this.generatorForm.get('capacity')?.value),
            capacityUnit: this.toOptionalString(this.generatorForm.get('capacityUnit')?.value),

            model: this.toOptionalString(this.generatorForm.get('model')?.value),
            manufacturer: this.toOptionalString(this.generatorForm.get('manufacturer')?.value),
            serialNumber: this.toOptionalString(this.generatorForm.get('serialNumber')?.value),

            voltage: this.toOptionalString(this.generatorForm.get('voltage')?.value),
            phase: this.toOptionalString(this.generatorForm.get('phase')?.value),
            frequency: this.toOptionalString(this.generatorForm.get('frequency')?.value),
            amperage: this.toOptionalNumber(this.generatorForm.get('amperage')?.value),

            statusCode: this.toOptionalString(this.generatorForm.get('statusCode')?.value)
        };

        try {
            const response: UpsertGeneratorResponse = await firstValueFrom(this.generatorOwnerService.upsertGenerator(upsertGeneratorRequest));

            let notificationMsg: string;
            if (this.selectedGeneratorId === -1) {
                // Add
                this.generators.push(response.generator);
                notificationMsg = 'Added';
            } else {
                // Edit
                const index = this.findIndexById(response.generator.id);
                if (index !== -1) {
                    this.generators[index] = response.generator;
                }
                notificationMsg = 'Updated';
            }

            this.generators = [...this.generators];

            this.notificationService.success('Successful', `Generator ${notificationMsg}`);

            this.isGeneratorSaving = false;
            this.isGeneratorDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isGeneratorSaving = false;
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.generatorForm.get(controlName);
        if (!control) return false;

        const shouldShow = control.touched || this.isGeneratorSaving;

        // Special case: capacityUnit has a group-level validation rule
        if (controlName === 'capacityUnit') {
            return shouldShow && (control.invalid || this.generatorForm.hasError('capacityUnitRequired'));
        }

        return control.invalid && shouldShow;
    }

    // ----------------------------
    // Helpers / validators
    // ----------------------------
    private capacityUnitRequiredWhenCapacityProvided(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const capacityValue = group.get('capacity')?.value;
            const capacityUnitValue = group.get('capacityUnit')?.value;

            const hasCapacity = capacityValue !== null && capacityValue !== undefined && `${capacityValue}`.trim() !== '';
            const hasCapacityUnit = capacityUnitValue !== null && capacityUnitValue !== undefined && `${capacityUnitValue}`.trim() !== '';

            if (hasCapacity && !hasCapacityUnit) {
                return { capacityUnitRequired: true };
            }

            return null;
        };
    }

    private toOptionalString(value: unknown): string | undefined {
        if (value === null || value === undefined) return undefined;
        const trimmed = String(value).trim();
        return trimmed === '' ? undefined : trimmed;
    }

    private toRequiredString(value: unknown): string {
        return String(value ?? '').trim();
    }

    private toOptionalNumber(value: unknown): number | undefined {
        if (value === null || value === undefined || String(value).trim() === '') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
}
