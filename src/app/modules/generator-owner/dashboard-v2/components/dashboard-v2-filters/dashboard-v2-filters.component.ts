import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { DashboardV2FilterRequest } from '@/core/services/api/request';
import { DASHBOARD_V2_CURRENCIES, DASHBOARD_V2_DATE_MODES, DASHBOARD_V2_RISKS } from '../../utils/dashboard-v2-labels';

@Component({
    selector: 'app-dashboard-v2-filters',
    standalone: true,
    imports: [CommonModule, FormsModule, AutoComplete, Button, Card, DatePicker, InputNumber, Select],
    templateUrl: './dashboard-v2-filters.component.html',
    styleUrl: './dashboard-v2-filters.component.scss'
})
export class DashboardV2FiltersComponent implements OnChanges {
    @Input() filter!: DashboardV2FilterRequest;
    @Input() activeTab = 'home';
    @Input() generators: SelectOptionNumValue[] = [];
    @Input() collectors: SelectOptionNumValue[] = [];
    @Input() cities: string[] = [];
    @Input() streets: string[] = [];
    @Input() billingModels: SelectOptionStrValue[] = [];
    @Input() billStatuses: SelectOptionStrValue[] = [];
    @Input() collectionStatuses: SelectOptionStrValue[] = [];
    @Input() loadingOptions = false;

    @Output() apply = new EventEmitter<DashboardV2FilterRequest>();
    @Output() reset = new EventEmitter<void>();

    localFilter: DashboardV2FilterRequest = {};
    dateFromValue: Date | null = null;
    dateToValue: Date | null = null;
    advancedOpen = false;

    citySuggestions: string[] = [];
    streetSuggestions: string[] = [];

    readonly dateModeOptions = DASHBOARD_V2_DATE_MODES;
    readonly currencyOptions = DASHBOARD_V2_CURRENCIES;
    readonly riskOptions = DASHBOARD_V2_RISKS;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter']) {
            this.localFilter = { ...(this.filter ?? {}) };
            this.dateFromValue = this.parseDate(this.localFilter.dateFrom);
            this.dateToValue = this.parseDate(this.localFilter.dateTo);
        }
    }

    applyFilters(): void {
        const request = this.removeEmptyValues({
            ...this.localFilter,
            dateFrom: this.showDateRange() ? this.toApiDate(this.dateFromValue, this.usesBillPeriodPicker()) : this.localFilter.dateFrom,
            dateTo: this.showDateRange() ? this.toApiDate(this.dateToValue, this.usesBillPeriodPicker()) : this.localFilter.dateTo
        });

        this.apply.emit(request);
    }

    resetFilters(): void {
        this.reset.emit();
    }

    setQuickPeriod(period: 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_90_DAYS' | 'YEAR_TO_DATE' | 'ALL_TIME'): void {
        const today = new Date();
        const start = new Date(today);
        const end = new Date(today);

        switch (period) {
            case 'THIS_MONTH':
                start.setDate(1);
                break;
            case 'LAST_MONTH':
                start.setMonth(today.getMonth() - 1, 1);
                end.setDate(0);
                break;
            case 'LAST_90_DAYS':
                start.setDate(today.getDate() - 90);
                break;
            case 'YEAR_TO_DATE':
                start.setMonth(0, 1);
                break;
            case 'ALL_TIME':
                this.dateFromValue = null;
                this.dateToValue = null;
                return;
        }

        if (this.usesBillPeriodPicker()) {
            start.setDate(1);
            end.setDate(1);
        }

        this.dateFromValue = start;
        this.dateToValue = end;
    }

    onDateModeChanged(): void {
        if (!this.usesBillPeriodPicker()) return;

        this.dateFromValue = this.toMonthStart(this.dateFromValue);
        this.dateToValue = this.toMonthStart(this.dateToValue);
    }

    onCityComplete(event: any): void {
        this.citySuggestions = this.filterSuggestions(this.cities, event.query);
    }

    onStreetComplete(event: any): void {
        this.streetSuggestions = this.filterSuggestions(this.streets, event.query);
    }

    onCityChanged(): void {
        this.localFilter.street = undefined;
        this.streetSuggestions = [];
    }

    showDateRange(): boolean {
        return !this.isCurrentTab('subscribers', 'topDebtors', 'alerts');
    }

    showDateMode(): boolean {
        return this.isCurrentTab('home', 'overview', 'bills', 'accounting', 'collections', 'consumption', 'addressBreakdown', 'generators');
    }

    showGenerator(): boolean {
        return !this.isCurrentTab('billCollectors', 'alerts');
    }

    showCollector(): boolean {
        return this.isCurrentTab('home', 'overview', 'bills', 'accounting', 'collections', 'billCollectors', 'consumption', 'addressBreakdown', 'generators');
    }

    showBillingModel(): boolean {
        return this.isCurrentTab('home', 'overview', 'subscribers', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    showBillStatus(): boolean {
        return this.isCurrentTab('home', 'overview', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    showCollectionStatus(): boolean {
        return this.isCurrentTab('home', 'overview', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    showCityStreet(): boolean {
        return !this.isCurrentTab('billCollectors', 'alerts');
    }

    showCurrency(): boolean {
        return this.isCurrentTab('home', 'overview', 'bills', 'accounting', 'collections', 'consumption', 'addressBreakdown', 'generators', 'topDebtors');
    }

    showRisk(): boolean {
        return this.isCurrentTab('home', 'topDebtors');
    }

    showMinimumOutstanding(): boolean {
        return this.isCurrentTab('home', 'topDebtors');
    }

    showFeedSize(): boolean {
        return this.isCurrentTab('home', 'recentActivity');
    }

    showPageSize(): boolean {
        return this.isCurrentTab('home', 'topDebtors');
    }

    hasPrimaryFilters(): boolean {
        return this.showDateRange() || this.showDateMode() || this.showCurrency() || this.showGenerator();
    }

    hasAdvancedFilters(): boolean {
        return this.showCollector() || this.showBillingModel() || this.showBillStatus() || this.showCollectionStatus() || this.showCityStreet() || this.showRisk() || this.showMinimumOutstanding() || this.showFeedSize() || this.showPageSize();
    }

    usesBillPeriodPicker(): boolean {
        return this.showDateMode() && this.localFilter.dateMode === 'BILL_PERIOD';
    }

    get datePickerView(): 'date' | 'month' {
        return this.usesBillPeriodPicker() ? 'month' : 'date';
    }

    get datePickerFormat(): string {
        return this.usesBillPeriodPicker() ? 'yy/mm' : 'yy-mm-dd';
    }

    get dateFromLabel(): string {
        return this.usesBillPeriodPicker() ? 'Bill Period From' : 'Date From';
    }

    get dateToLabel(): string {
        return this.usesBillPeriodPicker() ? 'Bill Period To' : 'Date To';
    }

    private isCurrentTab(...tabs: string[]): boolean {
        return tabs.includes(this.activeTab);
    }

    private filterSuggestions(values: string[], query: string): string[] {
        const q = (query ?? '').trim().toLowerCase();

        if (!q) return values.slice(0, 50);

        return values.filter((value) => value.toLowerCase().includes(q)).slice(0, 50);
    }

    private parseDate(value?: string): Date | null {
        if (!value) return null;

        const date = new Date(value);

        return Number.isNaN(date.getTime()) ? null : date;
    }

    private toApiDate(value: Date | null, monthOnly = false): string | undefined {
        if (!value) return undefined;

        const normalized = monthOnly ? new Date(value.getFullYear(), value.getMonth(), 1) : value;
        const year = normalized.getFullYear();
        const month = `${normalized.getMonth() + 1}`.padStart(2, '0');

        if (monthOnly) return `${year}-${month}`;

        const day = `${normalized.getDate()}`.padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private toMonthStart(value: Date | null): Date | null {
        if (!value) return null;

        return new Date(value.getFullYear(), value.getMonth(), 1);
    }

    private removeEmptyValues(filter: DashboardV2FilterRequest): DashboardV2FilterRequest {
        return Object.fromEntries(Object.entries(filter).filter(([, value]) => value !== '' && value !== null && value !== undefined)) as DashboardV2FilterRequest;
    }
}
