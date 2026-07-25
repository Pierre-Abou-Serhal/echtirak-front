import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { BillCollectorProfile, Generator } from '@/core/models/model';
import { GetBillCollectorForGOResponse, GetGeneratorsResponse } from '@/core/services/api/response';
import * as Papa from 'papaparse';
import { UpsertBillCollectorRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';
import { Password } from 'primeng/password';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { addLebanonPrefix, stripLebanonPrefix } from '@/core/utils/utils';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'app-bill-collector.component',
    imports: [Button, TableModule, IconField, InputIcon, Dialog, ReactiveFormsModule, Message, InputText, Password, LbPhonePipe, InputGroup, InputGroupAddon, NgxMaskDirective, Tag, ToggleSwitch, MultiSelect],
    templateUrl: './bill-collector.component.html',
    styleUrl: './bill-collector.component.scss',
    standalone: true,
    providers: [provideNgxMask()]
})
export class BillCollectorComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    billCollectors: BillCollectorProfile[] = [];
    loading: boolean = true;
    loadingGenerators: boolean = true;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;
    selectBillCollectors: BillCollectorProfile[] = [];
    isBillCollectorDialogOpen: boolean = false;
    isBillCollectorSaving: boolean = false;

    billCollectorForm: FormGroup;
    selectedBillCollectorId: number = -1;
    availableGenerators: Generator[] = [];

    constructor(private fb: FormBuilder) {
        this.billCollectorForm = this.fb.group(
            {
                username: [null, Validators.required],
                firstName: [null, Validators.required],
                lastName: [null, Validators.required],
                phoneNumber: [null, Validators.required],
                autoBillOnReading: [false],
                generatorIds: [<number[]>[], Validators.required],

                changePassword: [false],
                newPassword: [null],
                confirmPassword: [null]
            },
            {
                validators: [this.passwordsValidator()]
            }
        );
    }

    private passwordsValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const changePassword = group.get('changePassword')?.value === true;

            if (!changePassword) {
                return null;
            }

            const newPassword = group.get('newPassword')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;

            if (!newPassword) {
                return { newRequired: true };
            }

            if (!confirmPassword) {
                return { confirmRequired: true };
            }

            if (newPassword !== confirmPassword) {
                return { passwordMismatch: true };
            }

            return null;
        };
    }

    ngOnInit(): void {
        this.generatorOwnerService.getBillCollectorForGO().subscribe({
            next: (response: GetBillCollectorForGOResponse) => {
                this.billCollectors = response.collectors;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            }
        });

        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.availableGenerators = response.generators;
                this.loadingGenerators = false;
                console.log(this.availableGenerators);
            },
            error: (err) => {
                console.log(err);
                this.loadingGenerators = false;
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
        return this.first + this.rows >= this.billCollectors.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.billCollectors?.length) return;

        let listToExport: BillCollectorProfile[] = this.billCollectors;

        if (this.selectBillCollectors.length > 0) {
            listToExport = this.selectBillCollectors;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bill-collectors.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Dialog functions
    openNew(): void {
        this.selectedBillCollectorId = -1;

        this.billCollectorForm.reset({
            username: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
            autoBillOnReading: false,
            generatorIds: [],
            changePassword: true,
            newPassword: null,
            confirmPassword: null
        });

        this.isBillCollectorDialogOpen = true;
    }

    editBillCollector(billCollector: BillCollectorProfile): void {
        this.selectedBillCollectorId = billCollector.id;

        this.billCollectorForm.reset({
            username: billCollector.username,
            firstName: billCollector.firstName,
            lastName: billCollector.lastName,
            phoneNumber: stripLebanonPrefix(billCollector.phoneNumber),
            autoBillOnReading: billCollector.autoBillOnReading,
            generatorIds: billCollector.assignedGenerators?.map((generator) => generator.generatorId) ?? [],
            changePassword: false,
            newPassword: null,
            confirmPassword: null
        });

        this.isBillCollectorDialogOpen = true;
    }

    hideDialog() {
        this.isBillCollectorDialogOpen = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.billCollectors.length; i++) {
            if (this.billCollectors[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    async saveBillCollector(): Promise<void> {
        this.billCollectorForm.markAllAsTouched();

        if (this.billCollectorForm.invalid) {
            return;
        }

        this.isBillCollectorSaving = true;

        const formValue = this.billCollectorForm.getRawValue();
        const isNew = this.selectedBillCollectorId === -1;

        const request: UpsertBillCollectorRequest = {
            id: this.selectedBillCollectorId,
            username: formValue.username,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phoneNumber: addLebanonPrefix(formValue.phoneNumber),
            autoBillOnReading: formValue.autoBillOnReading,
            generatorIds: formValue.generatorIds,

            ...(formValue.changePassword ? { password: formValue.newPassword } : {})
        };

        try {
            const response = await firstValueFrom(this.generatorOwnerService.upsertBillCollector(request));

            const index = this.findIndexById(response.collector.id);

            if (index === -1) {
                this.billCollectors = [...this.billCollectors, response.collector];
            } else {
                this.billCollectors[index] = response.collector;
                this.billCollectors = [...this.billCollectors];
            }

            this.notificationService.success('Successful', `Bill Collector ${isNew ? 'Added' : 'Updated'}`);

            this.isBillCollectorDialogOpen = false;
        } catch (error) {
            console.error(error);
        } finally {
            this.isBillCollectorSaving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.billCollectorForm.get(controlName);
        return control?.invalid && (control.touched || this.isBillCollectorSaving);
    }

    get isNewBillCollector(): boolean {
        return this.selectedBillCollectorId === -1;
    }

    get isChangingPassword(): boolean {
        return this.billCollectorForm.get('changePassword')?.value === true;
    }

    onChangePasswordChanged(): void {
        if (!this.isChangingPassword) {
            const newPasswordControl = this.billCollectorForm.get('newPassword');

            const confirmPasswordControl = this.billCollectorForm.get('confirmPassword');

            newPasswordControl?.reset(null, { emitEvent: false });
            confirmPasswordControl?.reset(null, { emitEvent: false });

            newPasswordControl?.markAsUntouched();
            confirmPasswordControl?.markAsUntouched();
        }

        this.billCollectorForm.updateValueAndValidity();
    }
}
