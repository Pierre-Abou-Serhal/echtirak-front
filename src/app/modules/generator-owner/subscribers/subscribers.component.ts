import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ExtraFee, Forecast, Generator, Lookup, Subscriber, SubscriptionBillingModel } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Papa from 'papaparse';
import { GetExtraFeesResponse, GetGeneratorsResponse, GetLookupResponse, GetSubscribersResponse, GetSubscriptionBillingModelResponse, UpsertSubscriberResponse, WalletForecastResponse } from '@/core/services/api/response';
import { Tag } from 'primeng/tag';
import { BillingModel, LookupDomain, SubscriberAction, SubscriberStatus } from '@/core/enums/enum';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { NotificationService } from '@/core/services/notification.service';
import { SelectOptionNumValue, SelectOptionStrValue, SubscriberAddress } from '@/core/dtos/dto';
import { InputNumber } from 'primeng/inputnumber';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Skeleton } from 'primeng/skeleton';
import { WalletForecastRequest } from '@/core/services/api/request';
import { WalletService } from '@/core/services/wallet.service';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { addLebanonPrefix, formatSubscriberAddress, stripLebanonPrefix } from '@/core/utils/utils';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { DecimalPipe, NgClass } from '@angular/common';
import { Listbox } from 'primeng/listbox';
import { Card } from 'primeng/card';
import { MenuItem, OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AutoComplete } from 'primeng/autocomplete';
import { MultiSelect } from 'primeng/multiselect';
import { Tooltip } from 'primeng/tooltip';
import { ContextMenu } from 'primeng/contextmenu';
import { Router } from '@angular/router';

type AddressHintVm = SubscriberAddress & { label: string };

@Component({
    selector: 'app-subscribers',
    standalone: true,
    imports: [
        TableModule,
        InputIcon,
        IconField,
        FormsModule,
        ButtonDirective,
        InputText,
        Button,
        Tag,
        Dialog,
        Select,
        InputNumber,
        Skeleton,
        InputMaskModule,
        InputGroupModule,
        InputGroupAddonModule,
        NgxMaskDirective,
        LbPhonePipe,
        NgClass,
        DecimalPipe,
        Listbox,
        Card,
        ToggleSwitch,
        AutoComplete,
        MultiSelect,
        Tooltip,
        ContextMenu
    ],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss',
    providers: [provideNgxMask()]
})
export class SubscribersComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);
    private readonly walletService = inject(WalletService);
    private readonly router = inject(Router);

    subscribers: Subscriber[] = [];
    selectedSubscribers: Subscriber[] = [];

    loading = true;
    private loadingMore = false;

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0; // index of first row in current UI page
    rows = 10; // number of rows per UI page

    // API pagination
    private apiPageSize = 100; // requested page size
    private currentApiPage = -1; // last page index loaded from API (-1 = none yet)
    private hasMoreFromServer = true;

    // Total records in the DB (from API `page.totalCount`)
    totalRecords = 0;

    // Searching
    keyword = '';
    private search$ = new Subject<string>();

    // Subscriber dialog
    isSubscriberDialogOpen: boolean = false;
    selectedSubscriber: Subscriber = new Subscriber();
    submitted: boolean = false;

    subscriberStatuses: SelectOptionStrValue[] = [];
    generators: SelectOptionNumValue[] = [];
    filteredSubscriptionBillingModels: SelectOptionNumValue[] = [];

    subscriptionBillingModels: SubscriptionBillingModel[] = [];

    subscriptionBillingFee: string = '';

    isSubscriberSaving: boolean = false;

    // Single QR-Code Dialog:
    isSingleQrCodeDialogOpen: boolean = false;
    private sanitizer = inject(DomSanitizer);
    singleQrCodeUrl?: SafeUrl;
    singleQrCodeBlob?: Blob;
    loadingSingleQr = false;

    // Multiple Qr-Code ZIP
    isDownloadingSubscribersQrCodeZip: boolean = false;
    selectedGeneratorForQrZip?: number | undefined;
    generatorsLoading: boolean = true;

    // Subscriber Warning vars
    displayWarning: boolean = false;
    forecastWallet: Forecast | null = null;

    // Expandable Rows
    expandedRows: Record<string, boolean> = {};

    displayGeneratorsForQrCodesDownload: boolean = false;

    // SMS languages
    readonly languageOptions: SelectOptionStrValue[] = [
        { label: 'English', value: 'EN' },
        { label: 'Arabic', value: 'AR' }
    ];

    // Subscriber Address Variables
    private readonly COUNTRY = 'Lebanon';

    citySuggestions: string[] = [];
    streetSuggestions: string[] = [];
    buildingSuggestions: string[] = [];

    private citiesCache: string[] = [];
    private streetsCacheByCity = new Map<string, string[]>();
    private buildingsCacheByKey = new Map<string, string[]>(); // key = `${city}|${street}`

    addressHintSuggestions: AddressHintVm[] = [];
    selectedHint: AddressHintVm | string | null = null;
    private lastStreet = '';
    private lastCity = '';

    cityLoading = false;
    streetLoading = false;
    buildingLoading = false;
    private suppressHintFetch = false;

    items: MenuItem[] | undefined;
    private actionLoading: Record<string, boolean> = {};

    // Extra Fees
    extraFeesOptions: SelectOptionNumValue[] = [];
    selectedExtraFeeIds: number[] = [];

    ngOnInit(): void {
        // Fetch generators drop down items
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((generator: Generator) => ({
                    value: generator.id,
                    label: generator.code
                }));
                this.generatorsLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.generators = [];
                this.generatorsLoading = false;
            }
        });

        // Fetch Subscription Billing Models to use it for drop down items
        this.generatorOwnerService.getSubscriptionBillingModel({}).subscribe({
            next: (response: GetSubscriptionBillingModelResponse) => {
                this.subscriptionBillingModels = response.models;
            },
            error: (err) => {
                console.log(err);
                this.subscriptionBillingModels = [];
            }
        });

        // Fetch subscriber statuses drop down items
        this.generatorOwnerService.getLookup({ domain: LookupDomain.SUBSCRIBER_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.subscriberStatuses = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
            },
            error: (err) => {
                console.log(err);
                this.subscriberStatuses = [];
            }
        });

        // Stream of search terms → reset state → load first API page
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap((q) => {
                    this.keyword = q;
                    this.resetDataState(); // clear current list & pagination
                    this.loading = true;
                }),
                // first API page: if your backend is 1-based, use 1 instead of 0
                switchMap(() => this.fetchApiPage(1).pipe(finalize(() => (this.loading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    // Ensure that the first visible UI page has data
                    this.ensureDataFor(this.first + this.rows);
                },
                error: () => {
                    this.subscribers = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        this.generatorOwnerService.getExtraFees().subscribe({
            next: (response: GetExtraFeesResponse) => {
                this.extraFeesOptions = response.extraFees.map((extraFee: ExtraFee) => ({
                    value: extraFee.id!,
                    label: extraFee.name!
                }));
            },
            error: (err) => {
                console.log(err);
                this.subscriptionBillingModels = [];
            }
        });

        // Initial load (empty search)
        this.search$.next('');
    }

    // =========================
    // API wrapper using full page object
    // =========================
    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        return this.generatorOwnerService
            .getSubscribers({
                pageNumber,
                pageSize: this.apiPageSize,
                keyword: this.keyword || undefined
            })
            .pipe(
                tap((res: GetSubscribersResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    // Append items from this page to the list
                    this.subscribers = [...this.subscribers, ...items];

                    // Track API pagination state
                    this.currentApiPage = apiPageNumber;
                    if (pageSize && pageSize > 0) {
                        this.apiPageSize = pageSize;
                    }

                    // Use server totalCount if available
                    this.totalRecords = totalCount;

                    // Rely on API flag to know if more pages exist
                    this.hasMoreFromServer = hasNext;
                }),
                finalize(() => (this.loadingMore = false))
            );
    }

    /**
     * Ensure that we have loaded data up to `targetIndex`.
     * If not, fetch the next API page (and repeat if needed).
     */
    private ensureDataFor(targetIndex: number): void {
        // Already have enough data
        if (targetIndex < this.subscribers.length) return;

        // No more data on server or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // Rare case: even after loading, targetIndex is still beyond what we have
                if (targetIndex >= this.subscribers.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => {
                this.hasMoreFromServer = false;
            }
        });
    }

    /**
     * Reset state when search / filters change
     */
    private resetDataState(): void {
        this.subscribers = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    // =========================
    // UI events
    // =========================

    onGlobalFilter(table: Table, value: string) {
        const v = value.trim();
        this.search$.next(v);

        // If you want ONLY server-side filtering, comment this out:
        // table.filterGlobal(v, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.search$.next('');
    }

    // Custom "next" button (top left)
    next() {
        if (this.isLastPage()) return;

        this.first = this.first + this.rows;
        // Ask for data beyond the end of the new page
        this.ensureDataFor(this.first + this.rows);
    }

    // Custom "prev" button
    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    // PrimeNG paginator event (bottom paginator)
    pageChange(event: any) {
        const oldRows = this.rows;

        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        // When rows-per-page changes, reset to first page
        if (event.rows != null && event.rows !== oldRows) {
            this.first = 0;
        }

        // Ensure that the new page has data (and load more from API if needed)
        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.subscribers.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // =========================
    // Export & actions
    // =========================

    exportToCsv() {
        if (!this.subscribers?.length) return;

        let listToExport: Subscriber[] = this.subscribers;

        if (this.selectedSubscribers.length > 0) {
            listToExport = this.selectedSubscribers;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // UI styling
    getSubscriberSeverity(statusCode: string) {
        switch (statusCode) {
            case SubscriberStatus.INACTIVE:
                return 'danger';

            case SubscriberStatus.ACTIVE:
                return 'success';

            default:
                return null;
        }
    }

    // Dialog functions
    openNew() {
        this.selectedSubscriber = new Subscriber();
        this.selectedSubscriber.statusCode = SubscriberStatus.ACTIVE;

        this.selectedSubscriber.smsEnabled = false;
        this.selectedSubscriber.preferredLanguage = null;

        this.ensureAddressInitialized();

        this.submitted = false;
        this.isSubscriberDialogOpen = true;
        this.filteredSubscriptionBillingModels = [];
        this.subscriptionBillingFee = '';

        this.streetSuggestions = [];
        this.buildingSuggestions = [];
        this.lastStreet = this.selectedSubscriber.address!.street ?? '';
        this.lastCity = this.selectedSubscriber.address!.city ?? '';

        this.selectedExtraFeeIds = [];
    }

    editSubscriber(subscriber: Subscriber) {
        const clone = structuredClone(subscriber);
        this.selectedSubscriber = {
            ...clone,
            phoneNumber: stripLebanonPrefix(clone.phoneNumber),
            address: clone.address ? { ...clone.address } : null
        };

        this.selectedExtraFeeIds = (subscriber.extraFees ?? []).map((x) => x.extraFeeId!);

        this.ensureAddressInitialized();

        if (!this.selectedSubscriber.smsEnabled) {
            this.selectedSubscriber.preferredLanguage = null;
        }

        this.isSubscriberDialogOpen = true;
        this.filterSubscriptionBillingModels(this.selectedSubscriber.generatorId);
        this.subscriptionBillingFee = this.getSubscriptionBillingFee(this.selectedSubscriber.subscriptionBillingModelId);
        this.lastStreet = this.selectedSubscriber.address!.street ?? '';
        this.lastCity = this.selectedSubscriber.address!.city ?? '';
    }

    hideDialog() {
        this.isSubscriberDialogOpen = false;
        this.submitted = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveSubscriber() {
        this.submitted = true;
        this.isSubscriberSaving = true;

        if (this.isSubscriberValid()) {
            let request: WalletForecastRequest = {
                subscriberCount: 1
            };

            this.walletService.walletForecast(request).subscribe({
                next: (response: WalletForecastResponse) => {
                    this.forecastWallet = response.forecast;

                    if (response.forecast.isAffordable) {
                        this.updateSubscriber();
                    } else {
                        // Warn the user, but allow him to continue
                        this.displayWarning = true;
                    }
                },
                error: (err) => {
                    console.log(err);
                    this.isSubscriberSaving = false;
                }
            });
        } else {
            this.isSubscriberSaving = false;
        }
    }

    updateSubscriber() {
        let isCreatingSub = this.selectedSubscriber.id === -1;
        this.selectedSubscriber.phoneNumber = addLebanonPrefix(this.selectedSubscriber.phoneNumber);

        // If subscription model is FIXED, then default currentKva + previousKva to 0
        if (this.getSubscriptionBillingModel(this.selectedSubscriber.subscriptionBillingModelId) === BillingModel.FIXED) {
            this.selectedSubscriber.currentKva = 0;
            this.selectedSubscriber.previousKva = 0;
        }

        if (!this.selectedSubscriber.smsEnabled) {
            this.selectedSubscriber.preferredLanguage = null;
        }

        this.generatorOwnerService
            .upsertSubscriber({
                id: this.selectedSubscriber.id,
                generatorId: this.selectedSubscriber.generatorId,
                phoneNumber: this.selectedSubscriber.phoneNumber,
                firstName: this.selectedSubscriber.firstName,
                lastName: this.selectedSubscriber.lastName,
                addressCountry: this.selectedSubscriber.address!.country,
                addressCity: this.selectedSubscriber.address!.city,
                addressStreet: this.selectedSubscriber.address!.street,
                addressBuilding: this.selectedSubscriber.address!.building,
                addressFloor: this.selectedSubscriber.address?.floor,
                previousKva: this.selectedSubscriber.previousKva,
                currentKva: this.selectedSubscriber.currentKva,
                electricMeterNumber: this.selectedSubscriber.electricMeterNumber,
                subscriptionBillingModelId: this.selectedSubscriber.subscriptionBillingModelId,
                overrideAmount: this.selectedSubscriber.overrideAmount,
                statusCode: this.selectedSubscriber.statusCode,
                smsEnabled: this.selectedSubscriber.smsEnabled,
                preferredLanguage: this.selectedSubscriber.preferredLanguage,
                extraFeeIds: this.selectedExtraFeeIds?.length ? this.selectedExtraFeeIds : undefined
            })
            .subscribe({
                next: (response: UpsertSubscriberResponse) => {
                    this.selectedSubscriber = response;

                    if (!isCreatingSub) {
                        // Edit
                        this.subscribers[this.findIndexById(this.selectedSubscriber.id)] = this.selectedSubscriber;
                        this.notificationService.success('Successful', 'Subscriber Updated');
                    } else {
                        // Add
                        this.subscribers.unshift(this.selectedSubscriber);
                        this.subscribers = [...this.subscribers];
                        this.first = 0; // optional but recommended
                        this.notificationService.success('Successful', 'Subscriber Created');
                    }

                    this.refreshAddressCaches();

                    this.selectedExtraFeeIds = [];

                    this.subscribers = [...this.subscribers];
                    this.isSubscriberDialogOpen = false;
                    this.selectedSubscriber = new Subscriber();
                    this.isSubscriberSaving = false;
                },
                error: (err) => {
                    console.log(err);
                    this.isSubscriberSaving = false;
                }
            });
    }

    isSubscriberValid() {
        const a = this.selectedSubscriber.address;
        const addressOk = !!a && !!a.city?.trim() && !!a.street?.trim() && !!a.building?.trim();

        return (
            this.selectedSubscriber.phoneNumber.length > 0 &&
            this.selectedSubscriber.generatorId > 0 &&
            this.selectedSubscriber.subscriptionBillingModelId > 0 &&
            this.selectedSubscriber.firstName.length > 0 &&
            this.selectedSubscriber.lastName.length > 0 &&
            addressOk &&
            this.selectedSubscriber.electricMeterNumber.length > 0 &&
            this.selectedSubscriber.statusCode.length > 0 &&
            (!this.selectedSubscriber.smsEnabled || !!this.selectedSubscriber.preferredLanguage) &&
            // If Billing Model is Metered, validate currentKva + previousKva
            (this.getSubscriptionBillingModel(this.selectedSubscriber.subscriptionBillingModelId) === BillingModel.FIXED ||
                (this.getSubscriptionBillingModel(this.selectedSubscriber.subscriptionBillingModelId) === BillingModel.METERED &&
                    this.selectedSubscriber.previousKva >= 0 &&
                    this.selectedSubscriber.previousKva !== null &&
                    this.selectedSubscriber.currentKva >= 0 &&
                    this.selectedSubscriber.currentKva !== null &&
                    this.selectedSubscriber.currentKva >= this.selectedSubscriber.previousKva))
        );
    }

    filterSubscriptionBillingModels(generatorId: number) {
        this.filteredSubscriptionBillingModels = this.subscriptionBillingModels
            .filter((model: SubscriptionBillingModel) => model.generatorId === generatorId)
            .map(
                (model): SelectOptionNumValue => ({
                    label: `${model.model} ${model.subscriptionAmps} AMPs`,
                    value: model.id
                })
            );
    }

    getSubscriptionBillingFee(subscriptionBillingModelId: number): string {
        let model = this.subscriptionBillingModels.find((model) => model.id === subscriptionBillingModelId);
        if (!model) return '';

        return model.model === BillingModel.FIXED ? model.amountFixed.toString() : model.amountPerKva.toString();
    }

    getSubscriptionBillingModel(subscriptionBillingModelId: number): string {
        let model = this.subscriptionBillingModels.find((model) => model.id === subscriptionBillingModelId);
        if (!model) return '';

        return model.model;
    }

    onChangeGenerator(generatorId: number) {
        this.selectedSubscriber.subscriptionBillingModelId = 0;
        this.subscriptionBillingFee = '';
        this.filterSubscriptionBillingModels(generatorId);
    }

    onChangeSubscriptionBillingModel(subscriptionBillingModelId: number) {
        this.subscriptionBillingFee = this.getSubscriptionBillingFee(subscriptionBillingModelId);
        if (this.getSubscriptionBillingModel(subscriptionBillingModelId) === BillingModel.METERED) {
            this.selectedSubscriber.overrideAmount = undefined;
        }
    }

    previewSingleQrCode(subscriber: Subscriber) {
        this.selectedSubscriber = { ...subscriber };
        this.loadSingleQrCode(subscriber.id);
    }

    loadSingleQrCode(subscriberId: number) {
        this.isSingleQrCodeDialogOpen = true;
        this.loadingSingleQr = true;

        this.generatorOwnerService.getSubscriberQrCode(subscriberId).subscribe({
            next: (blob) => {
                this.singleQrCodeBlob = blob;
                const url = URL.createObjectURL(blob);
                this.singleQrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
                this.loadingSingleQr = false;
            },
            error: (err) => {
                console.error('QR code load failed', err);
                this.isSingleQrCodeDialogOpen = true;
                this.loadingSingleQr = false;
            }
        });
    }

    hideQrCodeDialog() {
        this.isSingleQrCodeDialogOpen = false;
        this.loadingSingleQr = false;
    }

    downloadSingleQrCode() {
        if (!this.singleQrCodeBlob) {
            return;
        }

        const url = URL.createObjectURL(this.singleQrCodeBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `subscriber-${this.selectedSubscriber.id}-qrcode.png`; // filename
        a.click();

        URL.revokeObjectURL(url);
    }

    downloadSubscribersQrCodeZip() {
        this.isDownloadingSubscribersQrCodeZip = true;

        if (!this.selectedGeneratorForQrZip) {
            this.isDownloadingSubscribersQrCodeZip = false;
            return;
        }

        this.generatorOwnerService.getSubscribersQrCodeZip({ generatorId: this.selectedGeneratorForQrZip }).subscribe({
            next: (response) => {
                const blob = response.body!;
                const contentDisposition = response.headers.get('content-disposition') ?? '';
                let fileName = this.getFilenameFromContentDisposition(contentDisposition, 'subscribers-qr-codes.7z');

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);

                this.isDownloadingSubscribersQrCodeZip = false;
                this.displayGeneratorsForQrCodesDownload = false;
            },
            error: (err) => {
                console.error('ZIP download failed', err);
                this.isDownloadingSubscribersQrCodeZip = false;
            }
        });
    }

    private getFilenameFromContentDisposition(cd: string | null, fallback: string) {
        if (!cd) return fallback;

        // Split: attachment; filename=...; filename*=...
        const parts: string[] = cd.split(';').map((p) => p.trim());

        const getParam = (name: string): string | null => {
            const part: string | undefined = parts.find((p) => p.toLowerCase().startsWith(name.toLowerCase() + '='));
            if (!part) return null;
            let v: string = part.slice(part.indexOf('=') + 1).trim();
            if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
            return v;
        };

        // Prefer filename* (RFC 5987)
        const fnStar = getParam('filename*');
        if (fnStar) {
            // UTF-8''<percent-encoded>
            const m = /^([^']*)'[^']*'(.*)$/.exec(fnStar);
            const encoded = m ? m[2] : fnStar;
            try {
                return decodeURIComponent(encoded);
            } catch {
                return encoded;
            }
        }

        // Fallback to filename
        const fn = getParam('filename');
        return fn || fallback;
    }

    // Warning Popup functions
    closeWarning() {
        this.displayWarning = false;
        this.isSubscriberSaving = false;
    }

    // Expandable row functions
    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[id] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) delete this.expandedRows[id];
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.subscribers.filter((s) => s?.id != null).map((s) => [String(s.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    openGeneratorsModal() {
        this.displayGeneratorsForQrCodesDownload = true;
    }

    onSmsEnabledChange(enabled: boolean) {
        if (!enabled) {
            this.selectedSubscriber.preferredLanguage = null; // or just null if your model allows it
        }
    }

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

    // Subscriber Address Helpers
    private ensureAddressInitialized(): void {
        if (!this.selectedSubscriber.address) {
            this.selectedSubscriber.address = {
                id: 0, // or -1; backend decides create/link
                country: this.COUNTRY,
                city: '',
                street: '',
                building: '',
                floor: ''
            };
        } else {
            // enforce Lebanon
            this.selectedSubscriber.address.country = this.COUNTRY;
        }
    }

    private filterValues(values: string[], query: string): string[] {
        const q = (query || '').trim().toLowerCase();
        if (!q) return values.slice(0, 50); // limit for UI
        return values.filter((v) => v.toLowerCase().includes(q)).slice(0, 50);
    }

    // AutoComplete handlers
    onCityComplete(event: any) {
        const q = (event.query || '').trim();

        // If cached, filter immediately
        if (this.citiesCache.length) {
            this.citySuggestions = this.filterValues(this.citiesCache, q);
            return;
        }

        // Not cached yet -> show loading (and avoid "No results found")
        this.cityLoading = true;
        this.citySuggestions = [];

        this.generatorOwnerService
            .getCities({ country: this.COUNTRY })
            .pipe(finalize(() => (this.cityLoading = false)))
            .subscribe({
                next: (res) => {
                    this.citiesCache = res.values ?? [];
                    this.citySuggestions = this.filterValues(this.citiesCache, q);
                },
                error: () => {
                    this.citiesCache = [];
                    this.citySuggestions = [];
                }
            });
    }

    onStreetComplete(event: any) {
        const q = (event.query || '').trim();
        const city = (this.selectedSubscriber.address?.city || '').trim();
        if (!city) {
            this.streetSuggestions = [];
            return;
        }

        const cached = this.streetsCacheByCity.get(city);
        if (cached?.length) {
            this.streetSuggestions = this.filterValues(cached, q);
            return;
        }

        this.streetLoading = true;
        this.streetSuggestions = [];

        this.generatorOwnerService
            .getStreets({ country: this.COUNTRY, city })
            .pipe(finalize(() => (this.streetLoading = false)))
            .subscribe({
                next: (res) => {
                    const values = res.values ?? [];
                    this.streetsCacheByCity.set(city, values);
                    this.streetSuggestions = this.filterValues(values, q);
                },
                error: () => {
                    this.streetsCacheByCity.set(city, []);
                    this.streetSuggestions = [];
                }
            });
    }

    onBuildingComplete(event: any) {
        const q = (event.query || '').trim();
        const city = (this.selectedSubscriber.address?.city || '').trim();
        const street = (this.selectedSubscriber.address?.street || '').trim();
        if (!city || !street) {
            this.buildingSuggestions = [];
            return;
        }

        const key = `${city}|${street}`;
        const cached = this.buildingsCacheByKey.get(key);
        if (cached?.length) {
            this.buildingSuggestions = this.filterValues(cached, q);
            return;
        }

        this.buildingLoading = true;
        this.buildingSuggestions = [];

        this.generatorOwnerService
            .getBuildings({ country: this.COUNTRY, city, street })
            .pipe(finalize(() => (this.buildingLoading = false)))
            .subscribe({
                next: (res) => {
                    const values = res.values ?? [];
                    this.buildingsCacheByKey.set(key, values);
                    this.buildingSuggestions = this.filterValues(values, q);
                },
                error: () => {
                    this.buildingsCacheByKey.set(key, []);
                    this.buildingSuggestions = [];
                }
            });
    }

    // Cascading resets
    private norm(s: string) {
        return (s || '').trim();
    }

    onAddressHintComplete(event: any) {
        if (this.suppressHintFetch) return;

        const q = (event.query || '').trim();
        if (!q) {
            // user cleared input -> don't fetch "all hints" here
            this.addressHintSuggestions = [];
            return;
        }

        this.loadAddressHints(q);
    }

    applyHint(h: SubscriberAddress, ac: AutoComplete) {
        this.suppressHintFetch = true;

        this.selectedSubscriber.address = { ...h, country: this.COUNTRY };

        this.lastCity = (this.selectedSubscriber.address.city || '').trim();
        this.lastStreet = (this.selectedSubscriber.address.street || '').trim();

        // Clear suggestions + close panel
        this.addressHintSuggestions = [];
        ac.hide();

        // Clear input only on select
        this.selectedHint = '';

        // allow future fetches (next tick)
        setTimeout(() => (this.suppressHintFetch = false), 0);
    }

    onStreetPicked() {
        const current = this.norm(this.selectedSubscriber.address!.street);
        const prev = this.norm(this.lastStreet);

        if (current === prev) return; // ✅ don't clear if same street

        this.selectedSubscriber.address!.building = '';
        this.buildingSuggestions = [];
        this.lastStreet = current;
    }

    onStreetBlur() {
        const a = this.selectedSubscriber.address!;
        const current = (a.street || '').trim();
        const prev = (this.lastStreet || '').trim();

        if (current !== prev) {
            a.building = '';
            this.buildingSuggestions = [];
            this.lastStreet = current;
        }
    }

    onCityPicked() {
        const current = this.norm(this.selectedSubscriber.address!.city);
        const prev = this.norm(this.lastCity);

        if (current === prev) return; // ✅ don't clear if same city

        this.clearAfterCityChange();
        this.lastCity = current;
    }

    onCityBlur() {
        const current = (this.selectedSubscriber.address!.city || '').trim();
        const prev = (this.lastCity || '').trim();

        if (current !== prev) {
            this.clearAfterCityChange();
            this.lastCity = current;
        }
    }

    private clearAfterCityChange() {
        const a = this.selectedSubscriber.address!;
        a.street = '';
        a.building = '';
        this.streetSuggestions = [];
        this.buildingSuggestions = [];
    }

    private loadAddressHints(query: string) {
        this.generatorOwnerService.getAddressHints({ query: query || undefined }).subscribe({
            next: (res) => {
                this.addressHintSuggestions = (res.hints ?? []).map((h) => ({
                    ...h,
                    label: formatSubscriberAddress(h)
                }));
            },
            error: () => (this.addressHintSuggestions = [])
        });
    }

    onHintFocus(ac: AutoComplete) {
        const q = (ac?.inputEL?.nativeElement?.value ?? '').trim();
        this.loadAddressHints(q); // if q === '' -> loads all hints (your desired behavior)
        ac.show();
    }

    private refreshAddressCaches() {
        this.citiesCache = [];
        this.streetsCacheByCity.clear();
        this.buildingsCacheByKey.clear();

        // also clear current suggestion lists
        this.citySuggestions = [];
        this.streetSuggestions = [];
        this.buildingSuggestions = [];
    }

    openSubscriberPendingBills(subscriberCode?: string) {
        this.router.navigate(['gbc', subscriberCode]);
    }

    // Context Menu for multi actions
    onMenuItemClick(item: MenuItem, ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        item.command?.({ originalEvent: ev, item });
    }

    openRowMenu(event: MouseEvent, subscriber: Subscriber, cm: ContextMenu) {
        event.preventDefault();
        event.stopPropagation();

        this.selectedSubscriber = new Subscriber();
        this.items = this.buildMenuItems(subscriber);
        cm.show(event);
    }

    private buildMenuItems(subscriber: Subscriber): MenuItem[] {
        const id = subscriber.id;

        return [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                data: { severity: 'info', loading: this.isActionLoading(id, SubscriberAction.EDIT) },
                command: () => this.editSubscriber(subscriber)
            },
            {
                label: 'Preview QR Code',
                icon: 'pi pi-qrcode',
                disabled: this.getSubscriptionBillingModel(subscriber.subscriptionBillingModelId) === BillingModel.FIXED,
                data: { severity: 'secondary', loading: this.isActionLoading(id, SubscriberAction.PRINT_QR_CODE) },
                command: () => this.previewSingleQrCode(subscriber)
            },
            {
                label: 'Pending Bills',
                icon: 'pi pi-money-bill',
                data: { severity: 'contrast', loading: this.isActionLoading(id, SubscriberAction.VIEW_PENDING_BILLS) },
                disabled: !subscriber.subscriberBillCode,
                command: () => this.openSubscriberPendingBills(subscriber.subscriberBillCode)
            }
        ];
    }

    setActionLoading(id: number, action: SubscriberAction, value: boolean) {
        this.actionLoading[this.key(id, action)] = value;

        // refresh menu UI while it's open (new reference)
        if (this.selectedSubscriber?.id === id) {
            this.items = this.buildMenuItems(this.selectedSubscriber);
        }
    }

    isActionLoading(id: number, action: SubscriberAction) {
        return this.actionLoading[this.key(id, action)];
    }

    private key(id: number, action: SubscriberAction) {
        return `${id}:${action}`;
    }

    protected readonly BillingModel = BillingModel;
    protected readonly formatSubscriberAddress = formatSubscriberAddress;
    protected readonly Subscriber = Subscriber;
}
