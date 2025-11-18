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
import {
    GetBillCollectorForGOResponse, UpsertBillCollectorResponse
} from '@/core/services/api/response';
import * as Papa from 'papaparse';
import { UpsertBillCollectorRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-bill-collector.component',
    imports: [Button, TableModule, IconField, InputIcon, Dialog, ReactiveFormsModule, Message, InputText],
    templateUrl: './bill-collector.component.html',
    styleUrl: './bill-collector.component.scss'
})
export class BillCollectorComponent {

    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    billCollectors: BillCollectorProfile[] = [];
    loading: boolean = true;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;
    selectBillCollectors: BillCollectorProfile[] = [];
    isBillCollectorDialogOpen: boolean = false;
    isBillCollectorSaving: boolean = false;

    billCollectorForm: FormGroup;
    selectedBillCollectorId: number = -1;

    constructor(private fb: FormBuilder) {
        this.billCollectorForm = this.fb.group(
            {
                username: [null, Validators.required],
                firstName: [null, Validators.required],
                lastName: [null, [Validators.required]],
                phoneNumber: [null, [Validators.required]],
                newPassword: [null],
                confirmPassword: [null],
            },
            {
                validators: [this.passwordsValidator()]
            }
        );
    }

    private passwordsValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const newPassword = group.get('newPassword')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;

            // Case 1: both empty => valid (user not changing password)
            if (!newPassword && !confirmPassword) {
                return null;
            }

            // Case 2: newPassword typed, confirmPassword empty
            if (newPassword && !confirmPassword) {
                return { confirmRequired: true };
            }

            // Case 3: confirmPassword typed, newPassword empty
            if (!newPassword && confirmPassword) {
                return { newRequired: true };
            }

            // Case 4: both present but different
            if (newPassword !== confirmPassword) {
                return { passwordMismatch: true };
            }

            // Case 5: both present and match
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
    openNew() {
        this.selectedBillCollectorId = -1;

        this.billCollectorForm.get('username')?.reset();
        this.billCollectorForm.get('firstName')?.reset();
        this.billCollectorForm.get('lastName')?.reset();
        this.billCollectorForm.get('phoneNumber')?.reset();
        this.billCollectorForm.get('newPassword')?.reset();
        this.billCollectorForm.get('confirmPassword')?.reset();

        this.isBillCollectorDialogOpen = true;
    }

    editBillCollector(billCollector: BillCollectorProfile) {
        this.selectedBillCollectorId = billCollector.id;

        this.billCollectorForm.get('username')?.setValue(billCollector.username);
        this.billCollectorForm.get('firstName')?.setValue(billCollector.firstName);
        this.billCollectorForm.get('lastName')?.setValue(billCollector.lastName);
        this.billCollectorForm.get('phoneNumber')?.setValue(billCollector.phoneNumber);
        this.billCollectorForm.get('newPassword')?.reset();
        this.billCollectorForm.get('confirmPassword')?.reset();

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

    async saveBillCollector() {
        this.isBillCollectorSaving = true;
        this.billCollectorForm.markAllAsTouched();

        if (!this.billCollectorForm.valid) {
            this.isBillCollectorSaving = false;
            return;
        }

        let upsertBillCollectorRequest: UpsertBillCollectorRequest = {
            id: this.selectedBillCollectorId,
            userId: this.selectedBillCollectorId,
            username: this.billCollectorForm.get('description')?.value,
            firstName: this.billCollectorForm.get('description')?.value,
            lastName: this.billCollectorForm.get('location')?.value,
            phoneNumber: this.billCollectorForm.get('location')?.value,
            newPassword: this.billCollectorForm.get('location')?.value,
            confirmPassword: this.billCollectorForm.get('location')?.value,
        };

        try {
            const response: UpsertBillCollectorResponse = await firstValueFrom(this.generatorOwnerService.upsertBillCollector(upsertBillCollectorRequest));

            let notificationMsg: string;
            if(this.selectedBillCollectorId === -1) {
                // Add
                this.billCollectors.push(response.collector);
                notificationMsg = 'Added';
            }
            else {
                // Edit
                this.billCollectors[this.findIndexById(response.collector.id)] = response.collector;
                notificationMsg = 'Updated';
            }

            this.billCollectors = [...this.billCollectors];

            this.notificationService.success(
                'Successful',
                `Bill Collector ${notificationMsg}`);

            this.isBillCollectorSaving = false;
            this.isBillCollectorDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isBillCollectorSaving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.billCollectorForm.get(controlName);
        return control?.invalid && (control.touched || this.isBillCollectorSaving);
    }
}
