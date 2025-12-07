import { Component, inject, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { Generator, Lookup, SubscriptionBillingModel } from '@/core/models/model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    GetGeneratorsResponse, GetLookupResponse,
    GetSubscriptionBillingModelResponse,
    UpsertSubscriptionBillingModelResponse
} from '@/core/services/api/response';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { UpsertSubscriptionBillingModelRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { LookupDomain } from '@/core/enums/enum';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-subscription-billing-model.component',
    imports: [Button, TableModule, Dialog, ReactiveFormsModule, InputText, Message, ButtonDirective, IconField, InputIcon, Select, InputNumber],
    templateUrl: './subscription-billing-model.component.html',
    styleUrl: './subscription-billing-model.component.scss',
    standalone: true
})
export class SubscriptionBillingModelComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    subscriptionBillingModels: SubscriptionBillingModel[] = [];
    loading: boolean = true;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;
    selectedSubscriptionBillingModels: SubscriptionBillingModel[] = [];
    isSubscriptionBillingModelDialogOpen: boolean = false;
    isSubscriptionBillingModelSaving: boolean = false;

    subscriptionBillingModelForm: FormGroup;
    selectedSubscriptionBillingModelId: number = -1;

    generators: SelectOptionNumValue[] = [];
    isGeneratorsLoading: boolean = true;

    billingModels: SelectOptionStrValue[] = [];
    isBillingModelsLoading: boolean = true;

    constructor(private fb: FormBuilder) {
        this.subscriptionBillingModelForm = this.fb.group({
            generatorId: [null, Validators.required],
            model: [null, Validators.required],
            subscriptionAmps: [null, [Validators.required]],
            amountFixed: [null, [Validators.required]],
            amountPerKva: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        // Fetch generators drop down items
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((generator: Generator) => ({
                    value: generator.id,
                    label: generator.code
                }));
                this.isGeneratorsLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.generators = [];
                this.isGeneratorsLoading = false;
            }
        });

        // Fetch billing models for drop down items
        this.generatorOwnerService.getLookup({ domain: LookupDomain.BILLING_MODE }).subscribe({
            next: (response: GetLookupResponse) => {
                this.billingModels = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
            },
            error: (err) => {
                console.log(err);
                this.billingModels = [];
            }
        });

        // Fetch Subscription Billing Models
        this.generatorOwnerService.getSubscriptionBillingModel({}).subscribe({
            next: (response: GetSubscriptionBillingModelResponse) => {
                this.subscriptionBillingModels = response.models;

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
        return this.first + this.rows >= this.subscriptionBillingModels.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.subscriptionBillingModels?.length) return;

        let listToExport: SubscriptionBillingModel[] = this.subscriptionBillingModels;

        if (this.selectedSubscriptionBillingModels.length > 0) {
            listToExport = this.selectedSubscriptionBillingModels;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscriptionBillingModels.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Dialog functions
    openNew() {
        this.selectedSubscriptionBillingModelId = -1;

        this.subscriptionBillingModelForm.get('generatorId')?.reset();
        this.subscriptionBillingModelForm.get('model')?.reset();
        this.subscriptionBillingModelForm.get('subscriptionAmps')?.reset();
        this.subscriptionBillingModelForm.get('amountFixed')?.reset();
        this.subscriptionBillingModelForm.get('amountPerKva')?.reset();

        this.isSubscriptionBillingModelDialogOpen = true;
    }

    editSubscriptionBillingModel(subscriptionBillingModel: SubscriptionBillingModel) {
        this.selectedSubscriptionBillingModelId = subscriptionBillingModel.id;

        this.subscriptionBillingModelForm.get('generatorId')?.setValue(subscriptionBillingModel.generatorId);
        this.subscriptionBillingModelForm.get('model')?.setValue(subscriptionBillingModel.model);
        this.subscriptionBillingModelForm.get('subscriptionAmps')?.setValue(subscriptionBillingModel.subscriptionAmps);
        this.subscriptionBillingModelForm.get('amountFixed')?.setValue(subscriptionBillingModel.amountFixed);
        this.subscriptionBillingModelForm.get('amountPerKva')?.setValue(subscriptionBillingModel.amountPerKva);

        this.isSubscriptionBillingModelDialogOpen = true;
    }

    hideDialog() {
        this.isSubscriptionBillingModelDialogOpen = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.subscriptionBillingModels.length; i++) {
            if (this.subscriptionBillingModels[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    async saveSubscriptionBillingModel() {
        this.isSubscriptionBillingModelSaving = true;
        this.subscriptionBillingModelForm.markAllAsTouched();

        if (!this.subscriptionBillingModelForm.valid) {
            this.isSubscriptionBillingModelSaving = false;
            return;
        }

        let upsertSubscriptionBillingModelRequest: UpsertSubscriptionBillingModelRequest = {
            id: this.selectedSubscriptionBillingModelId,
            model: this.subscriptionBillingModelForm.get('model')?.value,
            generatorId: this.subscriptionBillingModelForm.get('generatorId')?.value,
            subscriptionAmps: this.subscriptionBillingModelForm.get('subscriptionAmps')?.value,
            amountPerKva: this.subscriptionBillingModelForm.get('amountPerKva')?.value,
            amountFixed: this.subscriptionBillingModelForm.get('amountFixed')?.value
        };

        try {
            const response: UpsertSubscriptionBillingModelResponse = await firstValueFrom(this.generatorOwnerService.upsertSubscriptionBillingModel(upsertSubscriptionBillingModelRequest));

            let notificationMsg: string;
            if (this.selectedSubscriptionBillingModelId === -1) {
                // Add
                this.subscriptionBillingModels.push(response.model);
                notificationMsg = 'Added';
            } else {
                // Edit
                this.subscriptionBillingModels[this.findIndexById(response.model.id)] = response.model;
                notificationMsg = 'Updated';
            }

            this.subscriptionBillingModels = [...this.subscriptionBillingModels];

            this.notificationService.success('Successful', `Subscription Billing Mode ${notificationMsg}`);

            this.isSubscriptionBillingModelSaving = false;
            this.isSubscriptionBillingModelDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isSubscriptionBillingModelSaving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.subscriptionBillingModelForm.get(controlName);
        return control?.invalid && (control.touched || this.isSubscriptionBillingModelSaving);
    }
}
