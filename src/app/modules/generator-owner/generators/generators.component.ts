import { Component, inject, OnInit } from '@angular/core';
import { Generator } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { Button, ButtonDirective } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import { GetGeneratorsResponse, UpsertGeneratorResponse } from '@/core/services/api/response';
import { Message } from 'primeng/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpsertGeneratorRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-generators.component',
    imports: [Button, TableModule, IconField, InputText, InputIcon, ButtonDirective, Dialog, Message, ReactiveFormsModule],
    templateUrl: './generators.component.html',
    styleUrl: './generators.component.scss'
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

    constructor(private fb: FormBuilder) {
        this.generatorForm = this.fb.group({
            code: [null, Validators.required],
            description: [null, Validators.required],
            location: [null, [Validators.required]]
        });
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
    }

    // Data table functions
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

    // Dialog functions
    openNew() {
        this.selectedGeneratorId = -1;

        this.generatorForm.get('code')?.reset();
        this.generatorForm.get('description')?.reset();
        this.generatorForm.get('location')?.reset();

        this.isGeneratorDialogOpen = true;
    }

    editGenerator(generator: Generator) {
        this.selectedGeneratorId = generator.id;

        this.generatorForm.get('code')?.setValue(generator.code);
        this.generatorForm.get('description')?.setValue(generator.description);
        this.generatorForm.get('location')?.setValue(generator.location);

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

        if (!this.generatorForm.valid) {
            this.isGeneratorSaving = false;
            return;
        }

        let upsertGeneratorRequest: UpsertGeneratorRequest = {
            id: this.selectedGeneratorId,
            code: this.generatorForm.get('code')?.value,
            description: this.generatorForm.get('description')?.value,
            location: this.generatorForm.get('location')?.value,
        };

        try {
            const response: UpsertGeneratorResponse = await firstValueFrom(this.generatorOwnerService.upsertGenerator(upsertGeneratorRequest));

            let notificationMsg: string;
            if(this.selectedGeneratorId === -1) {
                // Add
                this.generators.push(response.generator);
                notificationMsg = 'Added';
            }
            else {
                // Edit
                this.generators[this.findIndexById(response.generator.id)] = response.generator;
                notificationMsg = 'Updated';
            }

            this.generators = [...this.generators];

            this.notificationService.success(
                'Successful',
                `Generator ${notificationMsg}`);

            this.isGeneratorSaving = false;
            this.isGeneratorDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isGeneratorSaving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.generatorForm.get(controlName);
        return control?.invalid && (control.touched || this.isGeneratorSaving);
    }
}
