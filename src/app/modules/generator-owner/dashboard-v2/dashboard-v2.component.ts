import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { LookupDomain } from '@/core/enums/enum';
import { NotificationService } from '@/core/services/notification.service';
import { DashboardV2FilterRequest } from '@/core/services/api/request';
import {
    DashboardV2AccountingResponse,
    DashboardV2AddressResponse,
    DashboardV2AlertsResponse,
    DashboardV2BillCollectorResponse,
    DashboardV2BillsResponse,
    DashboardV2CollectionResponse,
    DashboardV2ConsumptionResponse,
    DashboardV2GeneratorResponse,
    DashboardV2OverviewResponse,
    DashboardV2RecentActivityResponse,
    DashboardV2Response,
    DashboardV2SubscribersResponse,
    DashboardV2TopDebtorsResponse
} from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';

import { DashboardV2AccountingPanelComponent } from './components/dashboard-v2-accounting-panel/dashboard-v2-accounting-panel.component';
import { DashboardV2AddressBreakdownPanelComponent } from './components/dashboard-v2-address-breakdown-panel/dashboard-v2-address-breakdown-panel.component';
import { DashboardV2AlertsBannerComponent } from './components/dashboard-v2-alerts-banner/dashboard-v2-alerts-banner.component';
import { DashboardV2AlertsPanelComponent } from './components/dashboard-v2-alerts-panel/dashboard-v2-alerts-panel.component';
import { DashboardV2BillCollectorsPanelComponent } from './components/dashboard-v2-bill-collectors-panel/dashboard-v2-bill-collectors-panel.component';
import { DashboardV2BillsPanelComponent } from './components/dashboard-v2-bills-panel/dashboard-v2-bills-panel.component';
import { DashboardV2CollectionsPanelComponent } from './components/dashboard-v2-collections-panel/dashboard-v2-collections-panel.component';
import { DashboardV2ConsumptionPanelComponent } from './components/dashboard-v2-consumption-panel/dashboard-v2-consumption-panel.component';
import { DashboardV2FiltersComponent } from './components/dashboard-v2-filters/dashboard-v2-filters.component';
import { DashboardV2GeneratorsPanelComponent } from './components/dashboard-v2-generators-panel/dashboard-v2-generators-panel.component';
import { DashboardV2OverviewPanelComponent } from './components/dashboard-v2-overview-panel/dashboard-v2-overview-panel.component';
import { DashboardV2RecentActivityPanelComponent } from './components/dashboard-v2-recent-activity-panel/dashboard-v2-recent-activity-panel.component';
import { DashboardV2SubscribersPanelComponent } from './components/dashboard-v2-subscribers-panel/dashboard-v2-subscribers-panel.component';
import { DashboardV2TopDebtorsPanelComponent } from './components/dashboard-v2-top-debtors-panel/dashboard-v2-top-debtors-panel.component';
import { DASHBOARD_V2_DATE_MODES, DASHBOARD_V2_RISKS } from './utils/dashboard-v2-labels';

export type DashboardV2Tab = 'home' | 'overview' | 'accounting' | 'bills' | 'collections' | 'subscribers' | 'billCollectors' | 'topDebtors' | 'generators' | 'addressBreakdown' | 'consumption' | 'recentActivity' | 'alerts';

type LookupOptionResponse = { items?: { code: string; description: string }[] };

@Component({
    selector: 'app-dashboard-v2',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Card,
        Message,
        ProgressBar,
        Tab,
        TabList,
        TabPanel,
        TabPanels,
        Tabs,
        DashboardV2AccountingPanelComponent,
        DashboardV2AddressBreakdownPanelComponent,
        DashboardV2AlertsBannerComponent,
        DashboardV2AlertsPanelComponent,
        DashboardV2BillCollectorsPanelComponent,
        DashboardV2BillsPanelComponent,
        DashboardV2CollectionsPanelComponent,
        DashboardV2ConsumptionPanelComponent,
        DashboardV2FiltersComponent,
        DashboardV2GeneratorsPanelComponent,
        DashboardV2OverviewPanelComponent,
        DashboardV2RecentActivityPanelComponent,
        DashboardV2SubscribersPanelComponent,
        DashboardV2TopDebtorsPanelComponent
    ],
    templateUrl: './dashboard-v2.component.html',
    styleUrl: './dashboard-v2.component.scss'
})
export class DashboardV2Component implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    filter: DashboardV2FilterRequest = this.defaultFilter();
    selectedTab: DashboardV2Tab = 'home';

    dashboard?: DashboardV2Response;
    overview?: DashboardV2OverviewResponse;
    subscribers?: DashboardV2SubscribersResponse;
    bills?: DashboardV2BillsResponse;
    accounting?: DashboardV2AccountingResponse;
    collections?: DashboardV2CollectionResponse;
    billCollectors: DashboardV2BillCollectorResponse[] = [];
    consumption?: DashboardV2ConsumptionResponse;
    addressBreakdown: DashboardV2AddressResponse[] = [];
    generators: DashboardV2GeneratorResponse[] = [];
    recentActivity?: DashboardV2RecentActivityResponse;
    topDebtors?: DashboardV2TopDebtorsResponse;
    alerts: DashboardV2AlertsResponse[] = [];

    generatorOptions: SelectOptionNumValue[] = [];
    collectorOptions: SelectOptionNumValue[] = [];
    cities: string[] = [];
    streets: string[] = [];
    billingModelOptions: SelectOptionStrValue[] = [];
    billStatusOptions: SelectOptionStrValue[] = [];
    collectionStatusOptions: SelectOptionStrValue[] = [];

    loading = false;
    loadingOptions = false;
    errorMessage?: string;
    lastRefresh?: Date;

    readonly tabs: { label: string; value: DashboardV2Tab }[] = [
        { label: 'Home', value: 'home' },
        { label: 'Overview', value: 'overview' },
        { label: 'Accounting', value: 'accounting' },
        { label: 'Bills', value: 'bills' },
        { label: 'Collections', value: 'collections' },
        { label: 'Subscribers', value: 'subscribers' },
        { label: 'Bill Collectors', value: 'billCollectors' },
        { label: 'Top Debtors', value: 'topDebtors' },
        { label: 'Generators', value: 'generators' },
        { label: 'Areas', value: 'addressBreakdown' },
        { label: 'Consumption', value: 'consumption' },
        { label: 'Recent Activity', value: 'recentActivity' },
        { label: 'Alerts', value: 'alerts' }
    ];

    ngOnInit(): void {
        this.loadFilterOptions();
        this.loadHome();
    }

    onTabChange(value: string | number): void {
        this.selectedTab = value as DashboardV2Tab;
        this.loadActiveTab();
    }

    onApplyFilters(filter: DashboardV2FilterRequest): void {
        this.filter = {
            ...this.defaultFilter(),
            ...filter,
            pageNumber: 1,
            pageSize: filter.pageSize ?? this.filter.pageSize ?? 25,
            feedSize: filter.feedSize ?? this.filter.feedSize ?? 20,
            currencyCode: filter.currencyCode || 'USD',
            dateMode: filter.dateMode
        };

        this.loadActiveTab();
    }

    onResetFilters(): void {
        this.filter = this.defaultFilter();
        this.loadActiveTab();
    }

    refresh(): void {
        this.loadActiveTab();
    }

    openAlertsTab(): void {
        this.selectedTab = 'alerts';
        this.loadActiveTab();
    }

    onTopDebtorsPageChange(event: { pageNumber: number; pageSize: number }): void {
        this.filter = {
            ...this.filter,
            pageNumber: event.pageNumber,
            pageSize: event.pageSize
        };

        this.loadTopDebtors();
    }

    get currencyCode(): string {
        return this.filter.currencyCode || 'USD';
    }

    get activeFilterSummary(): string[] {
        const filter = this.filter;
        const tab = this.selectedTab;
        const summary = [`Section: ${this.tabLabel(tab)}`];

        if (this.appliesDateRangeTo(tab)) {
            if (this.appliesDateModeTo(tab) && filter.dateMode) {
                summary.push(`Date mode: ${this.optionLabel(DASHBOARD_V2_DATE_MODES, filter.dateMode)}`);
            }

            summary.push(this.dateRangeSummary(filter));
        } else {
            summary.push('Date filters are not used for this section');
        }

        if (this.appliesCurrencyTo(tab) && filter.currencyCode) {
            summary.push(`Currency: ${filter.currencyCode}`);
        }

        if (this.appliesGeneratorTo(tab) && filter.generatorId) {
            summary.push(`Generator: ${this.optionLabel(this.generatorOptions, filter.generatorId)}`);
        }

        if (this.appliesCollectorTo(tab) && filter.collectorUserId) {
            summary.push(`Collector: ${this.optionLabel(this.collectorOptions, filter.collectorUserId)}`);
        }

        if (this.appliesBillingModelTo(tab) && filter.billingModel) {
            summary.push(`Billing model: ${this.optionLabel(this.billingModelOptions, filter.billingModel)}`);
        }

        if (this.appliesBillStatusTo(tab) && filter.billStatus) {
            summary.push(`Bill status: ${this.optionLabel(this.billStatusOptions, filter.billStatus)}`);
        }

        if (this.appliesCollectionStatusTo(tab) && filter.collectionStatus) {
            summary.push(`Collection status: ${this.optionLabel(this.collectionStatusOptions, filter.collectionStatus)}`);
        }

        if (this.appliesAddressTo(tab)) {
            if (filter.city && filter.street) {
                summary.push(`Address: ${filter.city}, ${filter.street}`);
            } else if (filter.city) {
                summary.push(`City: ${filter.city}`);
            } else if (filter.street) {
                summary.push(`Street: ${filter.street}`);
            }
        }

        if (this.appliesRiskTo(tab) && filter.risk) {
            summary.push(`Risk: ${this.optionLabel(DASHBOARD_V2_RISKS, filter.risk)}`);
        }

        if (this.appliesMinimumOutstandingTo(tab) && filter.minOutstanding !== undefined) {
            summary.push(`Minimum outstanding: ${this.formatAmountFilter(filter.minOutstanding)}`);
        }

        if (this.appliesFeedSizeTo(tab) && filter.feedSize) {
            summary.push(`Recent activity limit: ${filter.feedSize} items`);
        }

        if (this.appliesPageSizeTo(tab) && filter.pageSize) {
            summary.push(`Top debtors page size: ${filter.pageSize} rows`);
        }

        return summary;
    }

    private loadActiveTab(): void {
        switch (this.selectedTab) {
            case 'home':
                this.loadHome();
                break;
            case 'overview':
                this.loadOverview();
                break;
            case 'accounting':
                this.loadAccounting();
                break;
            case 'bills':
                this.loadBills();
                break;
            case 'collections':
                this.loadCollections();
                break;
            case 'subscribers':
                this.loadSubscribers();
                break;
            case 'billCollectors':
                this.loadBillCollectors();
                break;
            case 'topDebtors':
                this.loadTopDebtors();
                break;
            case 'generators':
                this.loadGenerators();
                break;
            case 'addressBreakdown':
                this.loadAddressBreakdown();
                break;
            case 'consumption':
                this.loadConsumption();
                break;
            case 'recentActivity':
                this.loadRecentActivity();
                break;
            case 'alerts':
                this.loadAlerts();
                break;
        }
    }

    private loadHome(): void {
        this.setLoading(true);

        this.generatorOwnerService
            .dashboardV2(this.homeRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.dashboard = response;
                    this.overview = response.overview;
                    this.subscribers = response.subscribers;
                    this.bills = response.bills;
                    this.accounting = response.accounting;
                    this.collections = response.collections;
                    this.consumption = response.consumption;
                    this.recentActivity = response.recentActivity;
                    this.billCollectors = response.billCollectorBreakdown ?? [];
                    this.alerts = response.alerts ?? [];
                    this.topDebtors = this.toTopDebtorsResponse(response.topDebtors ?? []);
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadOverview(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Overview(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.overview = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadSubscribers(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Subscribers(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.subscribers = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadBills(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Bills(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.bills = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadAccounting(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Accounting(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.accounting = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadCollections(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Collections(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.collections = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadBillCollectors(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2BillCollectors(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.billCollectors = response ?? [];
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadConsumption(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Consumption(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.consumption = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadAddressBreakdown(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2AddressBreakdown(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.addressBreakdown = response ?? [];
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadGenerators(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Generators(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.generators = response ?? [];
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadRecentActivity(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2RecentActivity(this.recentActivityRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.recentActivity = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadTopDebtors(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2TopDebtors(this.topDebtorsRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.topDebtors = response;
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadAlerts(): void {
        this.setLoading(true);
        this.generatorOwnerService
            .dashboardV2Alerts(this.baseRequest())
            .pipe(finalize(() => this.setLoading(false)))
            .subscribe({
                next: (response) => {
                    this.alerts = response ?? [];
                    this.markSuccessfulRefresh();
                },
                error: (error) => this.handleLoadError(error)
            });
    }

    private loadFilterOptions(): void {
        this.loadingOptions = true;

        forkJoin({
            generators: this.generatorOwnerService.getGenerators().pipe(catchError(() => of({ generators: [] }))),
            collectors: this.generatorOwnerService.getBillCollectorForGO().pipe(catchError(() => of({ collectors: [] }))),
            addressHints: this.generatorOwnerService.getAddressHints({}).pipe(catchError(() => of({ hints: [] }))),
            billingModels: this.lookupOptions(LookupDomain.BILLING_MODE),
            billStatuses: this.lookupOptions(LookupDomain.BILL_STATUS),
            collectionStatuses: this.lookupOptions(LookupDomain.BILL_COLLECTION_STATUS)
        })
            .pipe(finalize(() => (this.loadingOptions = false)))
            .subscribe(({ generators, collectors, addressHints, billingModels, billStatuses, collectionStatuses }) => {
                this.generatorOptions = (generators.generators ?? []).map((generator) => ({
                    label: `${generator.code} - ${generator.description}`,
                    value: generator.id
                }));

                this.collectorOptions = (collectors.collectors ?? []).map((collector) => ({
                    label: `${collector.firstName} ${collector.lastName}`.trim() || collector.username,
                    value: collector.userId ?? collector.id
                }));

                this.cities = this.uniqueValues((addressHints.hints ?? []).map((hint) => hint.city));
                this.streets = this.uniqueValues((addressHints.hints ?? []).map((hint) => hint.street));
                this.billingModelOptions = billingModels;
                this.billStatusOptions = billStatuses;
                this.collectionStatusOptions = collectionStatuses;
            });
    }

    private lookupOptions(domain: LookupDomain) {
        return this.generatorOwnerService.getLookup({ domain }).pipe(
            catchError(() => of({ items: [] } as LookupOptionResponse)),
            map((response) =>
                (response.items ?? []).map((item) => ({
                    label: item.description,
                    value: item.code
                }))
            )
        );
    }

    private requestForTab(tab: DashboardV2Tab): DashboardV2FilterRequest {
        const filter = this.filter;
        const request: DashboardV2FilterRequest = {};

        if (this.appliesDateRangeTo(tab)) {
            request.dateFrom = filter.dateFrom;
            request.dateTo = filter.dateTo;
        }

        if (this.appliesDateModeTo(tab)) request.dateMode = filter.dateMode;
        if (this.appliesGeneratorTo(tab)) request.generatorId = filter.generatorId;
        if (this.appliesCollectorTo(tab)) request.collectorUserId = filter.collectorUserId;
        if (this.appliesBillingModelTo(tab)) request.billingModel = filter.billingModel;
        if (this.appliesBillStatusTo(tab)) request.billStatus = filter.billStatus;
        if (this.appliesCollectionStatusTo(tab)) request.collectionStatus = filter.collectionStatus;
        if (this.appliesAddressTo(tab)) {
            request.city = filter.city;
            request.street = filter.street;
        }

        if (this.appliesCurrencyTo(tab)) request.currencyCode = filter.currencyCode;
        if (this.appliesFeedSizeTo(tab)) request.feedSize = filter.feedSize;
        if (this.appliesPageSizeTo(tab)) {
            request.pageNumber = filter.pageNumber;
            request.pageSize = filter.pageSize;
        }

        if (this.appliesMinimumOutstandingTo(tab)) request.minOutstanding = filter.minOutstanding;
        if (this.appliesRiskTo(tab)) request.risk = filter.risk;

        return this.cleanRequest(request);
    }

    private appliesDateRangeTo(tab: DashboardV2Tab): boolean {
        return !this.isTab(tab, 'subscribers', 'topDebtors', 'alerts');
    }

    private appliesDateModeTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'bills', 'accounting', 'collections', 'consumption', 'addressBreakdown', 'generators');
    }

    private appliesGeneratorTo(tab: DashboardV2Tab): boolean {
        return !this.isTab(tab, 'billCollectors', 'alerts');
    }

    private appliesCollectorTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'bills', 'accounting', 'collections', 'billCollectors', 'consumption', 'addressBreakdown', 'generators');
    }

    private appliesBillingModelTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'subscribers', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    private appliesBillStatusTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    private appliesCollectionStatusTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'bills', 'accounting', 'consumption', 'addressBreakdown', 'generators');
    }

    private appliesAddressTo(tab: DashboardV2Tab): boolean {
        return !this.isTab(tab, 'billCollectors', 'alerts');
    }

    private appliesCurrencyTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'overview', 'bills', 'accounting', 'collections', 'consumption', 'addressBreakdown', 'generators', 'topDebtors');
    }

    private appliesRiskTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'topDebtors');
    }

    private appliesMinimumOutstandingTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'topDebtors');
    }

    private appliesFeedSizeTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'recentActivity');
    }

    private appliesPageSizeTo(tab: DashboardV2Tab): boolean {
        return this.isTab(tab, 'home', 'topDebtors');
    }

    private isTab(tab: DashboardV2Tab, ...tabs: DashboardV2Tab[]): boolean {
        return tabs.includes(tab);
    }

    private tabLabel(tab: DashboardV2Tab): string {
        return this.tabs.find((item) => item.value === tab)?.label ?? this.humanizeCode(tab);
    }

    private dateRangeSummary(filter: DashboardV2FilterRequest): string {
        const label = this.dateFilterLabel(filter.dateMode);

        if (!filter.dateFrom && !filter.dateTo) return `${label}: all time`;
        if (filter.dateFrom && filter.dateTo) return `${label}: ${filter.dateFrom} to ${filter.dateTo}`;
        if (filter.dateFrom) return `${label}: from ${filter.dateFrom}`;

        return `${label}: until ${filter.dateTo}`;
    }

    private dateFilterLabel(dateMode?: string): string {
        if (dateMode === 'BILL_PERIOD') return 'Bill period';
        if (dateMode === 'PAID_AT') return 'Paid date';

        return 'Issue date';
    }

    private optionLabel(options: Array<{ label: string; value: string | number }>, value: string | number): string {
        return options.find((option) => `${option.value}` === `${value}`)?.label ?? this.humanizeCode(value);
    }

    private humanizeCode(value: string | number): string {
        if (typeof value === 'number') return `${value}`;

        return value
            .toLowerCase()
            .split('_')
            .filter(Boolean)
            .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
            .join(' ');
    }

    private formatAmountFilter(value: number): string {
        return `${this.currencyCode} ${new Intl.NumberFormat().format(value)}`;
    }

    private defaultFilter(): DashboardV2FilterRequest {
        return {
            currencyCode: 'USD',
            dateMode: '',
            feedSize: 20,
            pageNumber: 1,
            pageSize: 25
        };
    }

    private homeRequest(): DashboardV2FilterRequest {
        return this.cleanRequest({
            ...this.requestForTab('home'),
            feedSize: this.filter.feedSize ?? 20,
            pageNumber: this.filter.pageNumber ?? 1,
            pageSize: this.filter.pageSize ?? 25
        });
    }

    private baseRequest(): DashboardV2FilterRequest {
        return this.requestForTab(this.selectedTab);
    }

    private recentActivityRequest(): DashboardV2FilterRequest {
        return this.cleanRequest({
            ...this.requestForTab('recentActivity'),
            feedSize: this.filter.feedSize ?? 20
        });
    }

    private topDebtorsRequest(): DashboardV2FilterRequest {
        return this.cleanRequest({
            ...this.requestForTab('topDebtors'),
            pageNumber: this.filter.pageNumber ?? 1,
            pageSize: this.filter.pageSize ?? 25,
            minOutstanding: this.filter.minOutstanding,
            risk: this.filter.risk
        });
    }

    private cleanRequest(request: DashboardV2FilterRequest): DashboardV2FilterRequest {
        return Object.fromEntries(Object.entries(request).filter(([, value]) => value !== '' && value !== null && value !== undefined)) as DashboardV2FilterRequest;
    }

    private toTopDebtorsResponse(items: DashboardV2Response['topDebtors']): DashboardV2TopDebtorsResponse {
        const pageSize = this.filter.pageSize ?? 25;
        const totalCount = items[0]?.totalCount ?? items.length;

        return {
            items,
            pageNumber: this.filter.pageNumber ?? 1,
            pageSize,
            totalCount,
            totalPages: pageSize ? Math.ceil(totalCount / pageSize) : 1,
            hasNext: totalCount > pageSize,
            hasPrevious: false
        };
    }

    private uniqueValues(values: Array<string | null | undefined>): string[] {
        return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => !!value))).sort((a, b) => a.localeCompare(b));
    }

    private setLoading(value: boolean): void {
        this.loading = value;
    }

    private markSuccessfulRefresh(): void {
        this.errorMessage = undefined;
        this.lastRefresh = new Date();
    }

    private handleLoadError(error: unknown): void {
        console.error(error);
        this.errorMessage = 'Unable to load dashboard data. Please try again.';
        this.notificationService.error('Dashboard', this.errorMessage);
    }
}
