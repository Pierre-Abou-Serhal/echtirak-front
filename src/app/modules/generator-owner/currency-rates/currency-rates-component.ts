import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import * as Papa from 'papaparse';
import { firstValueFrom } from 'rxjs';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { Currency, CurrencyRate } from '@/core/models/model';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { GetCurrencyRatesQueryParams, UpsertCurrencyRatesRequest } from '@/core/services/api/request';
import { GetCurrenciesResponse, GetCurrencyRatesResponse } from '@/core/services/api/response';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-currency-rates-component',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, Button, DatePicker, Dialog, InputNumber, Select, TableModule, DecimalPipe, InputText, DatePipe],
    templateUrl: './currency-rates-component.html',
    styleUrl: './currency-rates-component.scss'
})
export class CurrencyRatesComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    // Active rate pair managed from this screen
    readonly activeFromCurrencyCode = 'USD';
    readonly activeToCurrencyCode = 'LBP';

    currencies: SelectOptionStrValue[] = [];
    isCurrenciesLoading: boolean = false;

    // Filters remain fully open for the user
    filters: GetCurrencyRatesQueryParams = {};

    // Table = inactive rates only
    currencyRates: CurrencyRate[] = [];
    selectedCurrencyRates: CurrencyRate[] = [];
    isCurrencyRatesLoading: boolean = false;

    // Current active rate section
    activeCurrencyRate: CurrencyRate | null = null;
    isActiveCurrencyRateLoading: boolean = false;

    // Data table vars
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // Modal vars
    isCurrencyRateDialogOpen: boolean = false;
    isCurrencyRateSaving: boolean = false;
    currencyRateForm: FormGroup;

    // Important behavior:
    // When editing the active rate, we intentionally save as a NEW record (id = -1)
    // so the previous active one becomes inactive and appears in the history table.
    selectedCurrencyRateId: number = -1;

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private fb: FormBuilder
    ) {
        this.currencyRateForm = this.fb.group({
            fromCurrencyCode: [this.activeFromCurrencyCode, Validators.required],
            toCurrencyCode: [this.activeToCurrencyCode, Validators.required],
            date: [null, Validators.required], // keep Date in the form
            rate: [null, [Validators.required, Validators.min(0.0001)]]
        });

        // Keep pair visible but not editable in the modal
        this.currencyRateForm.get('fromCurrencyCode')?.disable({ emitEvent: false });
        this.currencyRateForm.get('toCurrencyCode')?.disable({ emitEvent: false });
    }

    ngOnInit(): void {
        this.loadCurrencies();
        this.refreshScreen();
    }

    private refreshScreen() {
        this.loadActiveCurrencyRate();
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

    // Loads ONLY the current active rate for the managed pair (USD / LBP)
    loadActiveCurrencyRate() {
        this.isActiveCurrencyRateLoading = true;

        this.generatorOwnerService
            .getCurrencyRates({
                fromCurrencyCode: this.activeFromCurrencyCode,
                toCurrencyCode: this.activeToCurrencyCode
            })
            .subscribe({
                next: (response: GetCurrencyRatesResponse) => {
                    this.activeCurrencyRate = response.rates.find((r) => r.isActive) ?? null;
                    this.isActiveCurrencyRateLoading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.activeCurrencyRate = null;
                    this.isActiveCurrencyRateLoading = false;
                }
            });
    }

    // Loads table data using user filters, then keeps only INACTIVE rows
    loadCurrencyRates() {
        this.isCurrencyRatesLoading = true;

        this.generatorOwnerService
            .getCurrencyRates({
                fromCurrencyCode: this.filters.fromCurrencyCode,
                toCurrencyCode: this.filters.toCurrencyCode,
                dateFrom: this.filters.dateFrom ? formatDate(this.filters.dateFrom, 'yyyy-MM-dd', this.locale) : undefined,
                dateTo: this.filters.dateTo ? formatDate(this.filters.dateTo, 'yyyy-MM-dd', this.locale) : undefined
            })
            .subscribe({
                next: (response: GetCurrencyRatesResponse) => {
                    this.currencyRates = response.rates.filter((r) => !r.isActive);
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
        this.first = 0;
        this.loadCurrencyRates();
    }

    // Data table functions
    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
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

    // Dialog actions

    // Creates a new active rate (used by New button)
    openNew() {
        this.selectedCurrencyRateId = -1;

        this.currencyRateForm.reset({
            fromCurrencyCode: this.activeFromCurrencyCode,
            toCurrencyCode: this.activeToCurrencyCode,
            date: new Date(),
            rate: null
        });

        this.isCurrencyRateDialogOpen = true;
    }

    hideDialog() {
        this.isCurrencyRateDialogOpen = false;
    }

    async saveCurrencyRate() {
        this.isCurrencyRateSaving = true;
        this.currencyRateForm.markAllAsTouched();

        if (!this.currencyRateForm.valid) {
            this.isCurrencyRateSaving = false;
            return;
        }

        const raw = this.currencyRateForm.getRawValue();

        const request: UpsertCurrencyRatesRequest = {
            rates: [
                {
                    id: this.selectedCurrencyRateId, // always -1 for active create/replace flow
                    fromCurrencyCode: raw.fromCurrencyCode,
                    toCurrencyCode: raw.toCurrencyCode,
                    date: formatDate(raw.date, 'yyyy-MM-dd', this.locale),
                    rate: raw.rate,
                    isActive: true
                }
            ]
        };

        try {
            await firstValueFrom(this.generatorOwnerService.upsertCurrencyRates(request));

            this.notificationService.success('Successful', 'Active Currency Rate Saved');

            this.isCurrencyRateSaving = false;
            this.isCurrencyRateDialogOpen = false;

            // Refresh both areas:
            // - Active section gets the new active rate
            // - Table gets the old active rate as inactive history
            this.refreshScreen();
        } catch (error) {
            console.log(error);
            this.isCurrencyRateSaving = false;
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.currencyRateForm.get(controlName);
        return !!(control?.invalid && (control.touched || this.isCurrencyRateSaving));
    }
}
