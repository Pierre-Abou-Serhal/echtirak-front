import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { Select } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { Currency, CurrencyRate } from '@/core/models/model';
import { GetCurrencyRatesQueryParams, UpsertCurrencyRatesRequest } from '@/core/services/api/request';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { GetCurrenciesResponse, GetCurrencyRatesResponse, UpsertCurrencyRatesResponse } from '@/core/services/api/response';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { DatePicker } from 'primeng/datepicker';
import { Table, TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import * as Papa from 'papaparse';
import { firstValueFrom } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { InputNumber } from 'primeng/inputnumber';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';

@Component({
    selector: 'app-currency-rates-component',
    imports: [Select, FormsModule, Button, DatePicker, TableModule, DatePipe, IconField, DecimalPipe, Dialog, Message, ReactiveFormsModule, InputNumber],
    templateUrl: './currency-rates-component.html',
    styleUrl: './currency-rates-component.scss'
})
export class CurrencyRatesComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    currencies: SelectOptionStrValue[] = [];
    isCurrenciesLoading: boolean = false;
    filters: GetCurrencyRatesQueryParams;

    currencyRates: CurrencyRate[] = [];
    selectedCurrencyRates: CurrencyRate[] = [];
    isCurrencyRatesLoading: boolean = false;

    // Data table vars
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // Modal variables
    isCurrencyRateDialogOpen: boolean = false;
    isCurrencyRateSaving: boolean = false;

    currencyRateForm: FormGroup;
    selectedCurrencyRateId: number = -1;

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private fb: FormBuilder
    ) {
        const currentDate = new Date();

        this.filters = {
            dateFrom: formatDate(currentDate, 'yyyy-MM-dd', this.locale),
            dateTo: formatDate(currentDate, 'yyyy-MM-dd', this.locale)
        };

        this.currencyRateForm = this.fb.group({
            fromCurrencyCode: [null, Validators.required],
            toCurrencyCode: [null, Validators.required],
            date: [null, [Validators.required]],
            rate: [null, [Validators.required]]
        });
    }

    ngOnInit() {
        this.loadCurrencies();
        this.loadCurrencyRates();
    }

    loadCurrencies() {
        this.isCurrenciesLoading = true;

        this.generatorOwnerService.getCurrencies().subscribe({
            next: (response: GetCurrenciesResponse) => {
                this.currencies = response.currencies.map((cur: Currency) => ({
                    value: cur.code,
                    label: cur.code
                }));
                this.isCurrenciesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.currencies = [];
                this.isCurrenciesLoading = false;
            }
        });
    }

    loadCurrencyRates() {
        this.isCurrencyRatesLoading = true;

        this.generatorOwnerService.getCurrencyRates({
            fromCurrencyCode: this.filters.fromCurrencyCode,
            toCurrencyCode: this.filters.toCurrencyCode,
            dateFrom: this.filters.dateFrom ? formatDate(this.filters.dateFrom, 'yyyy-MM-dd', this.locale) : undefined,
            dateTo: this.filters.dateTo ? formatDate(this.filters.dateTo, 'yyyy-MM-dd', this.locale) : undefined,
        }).subscribe({
            next: (response: GetCurrencyRatesResponse) => {
                this.currencyRates = response.rates;
                this.isCurrencyRatesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.currencyRates = [];
                this.isCurrencyRatesLoading = false;
            }
        });
    }

    resetFilters() {
        this.filters = {};
    }

    // Data table functions
    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
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
        return this.first + this.rows >= this.currencyRates.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.currencyRates?.length) return;

        let listToExport: CurrencyRate[] = this.currencyRates;

        if (this.selectedCurrencyRates.length > 0) {
            listToExport = this.selectedCurrencyRates;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'currency-rates.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Dialog functions
    openNew() {
        this.selectedCurrencyRateId = -1;

        const currentDate = new Date();

        this.currencyRateForm.get('fromCurrencyCode')?.reset();
        this.currencyRateForm.get('toCurrencyCode')?.reset();
        this.currencyRateForm.get('date')?.setValue(formatDate(currentDate, 'yyyy-MM-dd', this.locale));
        this.currencyRateForm.get('rate')?.reset();

        this.isCurrencyRateDialogOpen = true;
    }

    editCurrencyRate(rate: CurrencyRate) {
        this.selectedCurrencyRateId = rate.id;

        this.currencyRateForm.get('fromCurrencyCode')?.setValue(rate.fromCurrencyCode);
        this.currencyRateForm.get('toCurrencyCode')?.setValue(rate.toCurrencyCode);
        this.currencyRateForm.get('date')?.setValue(formatDate(rate.date, 'yyyy-MM-dd', this.locale));
        this.currencyRateForm.get('rate')?.setValue(rate.rate);

        this.isCurrencyRateDialogOpen = true;
    }

    hideDialog() {
        this.isCurrencyRateDialogOpen = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.currencyRates.length; i++) {
            if (this.currencyRates[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    async saveCurrencyRate() {
        this.isCurrencyRateSaving = true;
        this.currencyRateForm.markAllAsTouched();

        if (!this.currencyRateForm.valid) {
            this.isCurrencyRateSaving = false;
            return;
        }

        let upsertCurrencyRateRequest: UpsertCurrencyRatesRequest = {
            rates: [
                {
                    id: this.selectedCurrencyRateId,
                    fromCurrencyCode: this.currencyRateForm.get('fromCurrencyCode')?.value,
                    toCurrencyCode: this.currencyRateForm.get('toCurrencyCode')?.value,
                    date: formatDate(this.currencyRateForm.get('date')?.value, 'yyyy-MM-dd', this.locale),
                    rate: this.currencyRateForm.get('rate')?.value
                }
            ]
        };

        try {
            const response: UpsertCurrencyRatesResponse = await firstValueFrom(this.generatorOwnerService.upsertCurrencyRates(upsertCurrencyRateRequest));

            let notificationMsg: string;
            if (this.selectedCurrencyRateId === -1) {
                // Add
                this.currencyRates = this.currencyRates.concat(response.rates);
                notificationMsg = 'Added';
            } else {
                // Edit
                response.rates.forEach((rate) => {
                    this.currencyRates[this.findIndexById(rate.id)] = rate;
                });
                notificationMsg = 'Updated';
            }

            this.currencyRates = [...this.currencyRates];

            this.notificationService.success('Successful', `Currency Rates ${notificationMsg}`);

            this.isCurrencyRateSaving = false;
            this.isCurrencyRateDialogOpen = false;
        } catch (error) {
            console.log(error);
            this.isCurrencyRateSaving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.currencyRateForm.get(controlName);
        return control?.invalid && (control.touched || this.isCurrencyRateSaving);
    }

    // To prevent ngPrim Modal Bug
    getOverlayOptions(): OverlayOptions {
        return {
            listener: (event: Event, options?: OverlayListenerOptions) => {
                if (options?.type === 'scroll') {
                    return false;
                }
                return options?.valid;
            }
        };
    }
}
