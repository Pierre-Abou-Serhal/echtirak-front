import { Component, DestroyRef, Inject, inject, LOCALE_ID, NgZone, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { Forecast, SmsCampaign, SmsTemplate } from '@/core/models/model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupDomain, SmsCampaignStatus } from '@/core/enums/enum';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';
import { CreateSmsCampaignRequest, WalletForecastRequest } from '@/core/services/api/request';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import * as Papa from 'papaparse';
import { debounceTime, finalize, Subject, switchMap, tap } from 'rxjs';
import { CreateSmsCampaignResponse, GetLookupResponse, GetSmsCampaignsResponse, GetSmsTemplatesResponse, WalletForecastResponse } from '@/core/services/api/response';
import { NotificationService } from '@/core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePicker } from 'primeng/datepicker';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { WalletService } from '@/core/services/wallet.service';
import { UserContextService } from '@/core/services/user-context.service';

export interface SmsCampaignSearchFilter {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
}

@Component({
    selector: 'app-sms-campaigns-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule, InputTextModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, TooltipModule, Select, DatePicker, IconField, InputIcon],
    templateUrl: './sms-campaigns-list.component.html',
    styleUrl: './sms-campaigns-list.component.scss'
})
export class SmsCampaignsListComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly walletService = inject(WalletService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly userContextService = inject(UserContextService);

    public campaigns: SmsCampaign[] = [];
    public selectedCampaigns: SmsCampaign[] = [];
    loading = true;
    private loadingMore = false;
    isSmsCampaignStatusesLoading: boolean = true;
    isCampaignSaving: boolean = false;

    //UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0; // index of first row in current UI page
    rows = 10; // number of rows per UI page

    // API pagination
    private apiPageSize = 100; // requested page size from server
    private currentApiPage = -1; // last page index loaded from API (-1 = none yet)
    private hasMoreFromServer = true;

    // Total records in the DB (from API `page.totalCount`)
    totalRecords = 0;

    public showCreateDialog = false;
    public createForm: FormGroup;
    public templates: SmsTemplate[] = [];

    public criteriaOptions: SelectOptionStrValue[] = [];
    public languageOptions: SelectOptionStrValue[] = [
        { label: 'English', value: 'EN' },
        { label: 'Arabic', value: 'AR' }
    ];

    public smsCampaignStatuses: SelectOptionStrValue[] = [];

    private search$ = new Subject<SmsCampaignSearchFilter>();
    smsCampaignSearchFilter: SmsCampaignSearchFilter;
    keyword: string = '';

    // Sms Campaign Warning vars
    displayWarning: boolean = false;

    // Sms campaign confirmation vars
    displayConfirmation: boolean = false;

    forecastWallet: Forecast | null = null;

    // Subscribers multi select in the modal
    private readonly zone: NgZone = inject(NgZone);
    public subscribers: SelectOptionNumValue[] = [];
    @ViewChild('multiSelect', { static: false }) multiSelect?: MultiSelect;

    subscriberPageNumber = 1;
    subscriberPageSize = 100;
    isLoadingSubscribers = false;
    subscriberLastKeyword = '';
    private subscriberSearch$ = new Subject<string>();
    private overlayScrollAttached = false;

    // Preview modal state
    public showTemplatePreviewDialog = false;
    public previewTemplate: SmsTemplate | null = null;
    public previewLang: 'en' | 'ar' = 'en';

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.createForm = this.fb.group({
            campaignName: ['', Validators.required],
            templateId: [null, Validators.required],
            selectionCriteriaType: [null, Validators.required],
            customSubscriberIds: [null],
            language: ['', Validators.required]
        });

        const templateCtrl = this.createForm.get('templateId');

        templateCtrl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((templateId: number | null) => {
            this.previewTemplate = this.templates.find((t) => t.id === templateId) ?? null;

            // Optional: reset preview language when template changes
            this.previewLang = 'en';

            // Option A (recommended): do NOT auto-open. User clicks Preview button.
            // Option B (auto-open): uncomment next line if you want it to open immediately
            // if (this.previewTemplate) this.showTemplatePreviewDialog = true;
        });

        // Stream of search terms → reset state → load first API page
        this.search$
            .pipe(
                debounceTime(300),
                tap(() => {
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
                    this.campaigns = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        this.subscriberSearch$.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe((keyword) => {
            this._fetchSubscribers(keyword);
        });

        this.smsCampaignSearchFilter = {};

        // Initial load (empty search)
        this.search$.next(this.smsCampaignSearchFilter);
        this.loadTemplates();
        this.loadCriteriaOptions();
        this.loadSmsCampaignStatuses();
    }

    // API wrapper for campaigns using full page object
    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const { fromDate, toDate } = this.smsCampaignSearchFilter;

        return this.generatorOwnerService
            .getSmsCampaigns({
                pageNumber,
                pageSize: this.apiPageSize,
                fromDate: fromDate ? formatDate(fromDate, 'yyyy-MM-dd', this.locale) : undefined,
                ToDate: toDate ? formatDate(toDate, 'yyyy-MM-dd', this.locale) : undefined,
                status: this.smsCampaignSearchFilter.status
            })
            .pipe(
                tap((res: GetSmsCampaignsResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    // Append items from this page to the list
                    this.campaigns = [...this.campaigns, ...items];

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
        if (targetIndex < this.campaigns.length) return;

        // No more data on server or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // Rare case: even after loading, targetIndex is still beyond what we have
                if (targetIndex >= this.campaigns.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => {
                this.hasMoreFromServer = false;
            }
        });
    }

    loadTemplates() {
        this.generatorOwnerService.getSmsTemplates().subscribe({
            next: (res: GetSmsTemplatesResponse) => {
                // Ensure that the first visible UI page has data
                this.templates = res.templates;
            },
            error: (err) => {
                console.log(err);
                this.templates = [];
            }
        });
    }

    loadCriteriaOptions() {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.SMS_CAMP_SEL_CRITERIA }).subscribe({
            next: (res: GetLookupResponse) => {
                // Ensure that the first visible UI page has data
                this.criteriaOptions = res.items.map((item) => ({ label: item.description, value: item.code }));
            },
            error: (err) => {
                console.log(err);
                this.criteriaOptions = [];
            }
        });
    }

    loadSmsCampaignStatuses() {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.SMS_CAMPAIGN_STATUS }).subscribe({
            next: (res: GetLookupResponse) => {
                this.smsCampaignStatuses = res.items.map((item) => ({ label: item.description, value: item.code }));
                this.isSmsCampaignStatusesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.smsCampaignStatuses = [];
                this.isSmsCampaignStatusesLoading = false;
            }
        });
    }

    openCreateDialog() {
        this.showCreateDialog = true;
        this.createForm.reset();
    }

    onCriteriaChange() {
        const criteria = this.createForm.get('selectionCriteriaType')?.value;
        if (criteria === 'CUSTOM') {
            this.loadSubscribers();
        } else {
            this.createForm.get('customSubscriberIds')?.setValue(null);
        }
    }

    saveCampaign() {
        if (this.createForm.invalid) return;

        const formValue = this.createForm.value;

        this.isCampaignSaving = true;

        let request: WalletForecastRequest = {
            smsCount: formValue.selectionCriteriaType === 'CUSTOM' ? formValue.customSubscriberIds.length : null,
            selectionCriteriaType: formValue.selectionCriteriaType,
            customSubscriberIds: formValue.customSubscriberIds
        };

        this.walletService.walletForecast(request).subscribe({
            next: (response: WalletForecastResponse) => {
                this.forecastWallet = response.forecast;

                if (response.forecast.isAffordable) {
                    // Creating the campaign --> enough balance
                    this.displayConfirmation = true;
                } else {
                    // Block the creation --> Show warning message
                    this.displayWarning = true;
                    this.isCampaignSaving = false;
                }
            },
            error: (err) => {
                console.log(err);
                this.isCampaignSaving = false;
            }
        });
    }

    createSmsCampaign() {
        const formValue = this.createForm.value;

        const request: CreateSmsCampaignRequest = {
            campaignName: formValue.campaignName,
            templateId: formValue.templateId,
            selectionCriteriaType: formValue.selectionCriteriaType,
            customSubscriberIds: formValue.selectionCriteriaType === 'CUSTOM' ? formValue.customSubscriberIds : null,
            language: formValue.language
        };

        this.generatorOwnerService.createSmsCampaign(request).subscribe({
            next: (response: CreateSmsCampaignResponse) => {
                console.log(response);
                // Add
                this.campaigns.push(response);
                this.notificationService.success('Successful', 'SMS Campaign Created');

                this.campaigns = [...this.campaigns];

                // Update wallet balance
                this.userContextService.loadWalletBalance();

                this.showCreateDialog = false;
                this.isCampaignSaving = false;
                this.displayConfirmation = false;
            },
            error: (err) => {
                console.log(err);
                this.isCampaignSaving = false;
                this.displayConfirmation = false;
            }
        });
    }

    closeWarning() {
        this.displayWarning = false;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

    viewDetails(smsCampaign: SmsCampaign) {
        this.router.navigate(['/app/generator-owner/sms-campaigns', smsCampaign.id]);
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case SmsCampaignStatus.COMPLETED:
                return 'success';
            case SmsCampaignStatus.PENDING:
                return 'warn';
            case SmsCampaignStatus.PROCESSING:
                return 'info';
            case SmsCampaignStatus.FAILED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    onGlobalFilter(table: Table, event: string) {
        table.filterGlobal(event, 'contains');
        this.reset();
    }

    /**
     * Reset state when search / filters change
     */
    private resetDataState(): void {
        this.campaigns = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    clear(table: Table) {
        this.keyword = '';
        this.reset();
        table.clear();
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
        const atEndOfLoadedArray = this.first + this.rows >= this.campaigns.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.campaigns?.length) return;

        let listToExport: SmsCampaign[] = this.campaigns;

        if (this.selectedCampaigns.length > 0) {
            listToExport = this.selectedCampaigns;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'smsCampaigns.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    applyFilters() {
        this.search$.next(this.smsCampaignSearchFilter);
    }

    resetFilters() {
        this.smsCampaignSearchFilter = {};

        this.applyFilters();
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

    private readonly overlayScrollHandler = (event: Event) => {
        const target = event.target as HTMLElement;
        const bottom = target.scrollTop + target.clientHeight;

        // When user reaches (or almost reaches) the bottom → load more
        if (bottom + 20 >= target.scrollHeight) {
            this.zone.run(() => this.loadMoreSubscribers());
        }
    };

    onSubscribersPanelShow() {
        // Wait a tick so the overlay DOM is fully in place
        setTimeout(() => this.attachScrollListener(), 0);
    }

    onSubscribersPanelHide() {
        this.detachScrollListener();
    }

    private attachScrollListener() {
        const overlayEl = this.multiSelect?.overlayViewChild?.overlayEl;

        if (!overlayEl) {
            console.warn('MultiSelect overlay element not found');
            return;
        }

        // This is the actual scrollable element in your HTML
        const listContainer = overlayEl.querySelector('.p-multiselect-list-container') as HTMLElement | null;

        if (!listContainer) {
            console.warn('MultiSelect list container not found');
            return;
        }

        listContainer.addEventListener('scroll', () => {
            const bottom = listContainer.scrollTop + listContainer.clientHeight;
            const nearBottom = bottom + 10 >= listContainer.scrollHeight; // small threshold

            if (nearBottom) {
                // Re-enter Angular so change detection sees loaded subscribers
                this.zone.run(() => {
                    this.loadMoreSubscribers();
                });
            }
        });
    }

    private detachScrollListener() {
        if (!this.multiSelect || !this.overlayScrollAttached) {
            return;
        }

        const overlayComp = this.multiSelect.overlayViewChild;
        const overlayEl = overlayComp?.overlayEl as HTMLElement | undefined;
        if (!overlayEl) {
            this.overlayScrollAttached = false;
            return;
        }

        const scrollContainer = overlayEl.querySelector('.p-multiselect-items-wrapper') as HTMLElement | null;

        const target = scrollContainer ?? overlayEl;

        target.removeEventListener('scroll', this.overlayScrollHandler);
        this.overlayScrollAttached = false;
    }

    // Called when user writes in the search box
    onFilter(event: any) {
        const keyword = event.filter?.trim() ?? '';

        this.subscriberPageNumber = 1;
        this.subscriberLastKeyword = keyword;
        this.subscribers = [];

        this.fetchSubscribers(keyword);
    }

    // First fetch (called when selecting CUSTOM)
    loadSubscribers() {
        this.subscriberPageNumber = 1;
        this.subscriberLastKeyword = '';
        this.subscribers = [];

        this.fetchSubscribers('');
    }

    // Scroll-triggered fetch
    loadMoreSubscribers() {
        if (this.isLoadingSubscribers) return;
        this.subscriberPageNumber++;

        this._fetchSubscribers(this.subscriberLastKeyword);
    }

    fetchSubscribers(keyword: string) {
        this.subscriberSearch$.next(keyword);
    }

    private _fetchSubscribers(keyword: string) {
        this.isLoadingSubscribers = true;

        this.generatorOwnerService
            .getSubscribers({
                pageNumber: this.subscriberPageNumber,
                pageSize: this.subscriberPageSize,
                keyword: keyword || undefined
            })
            .subscribe({
                next: (res) => {
                    const items = res.page.items.map((s) => ({
                        label: `${s.firstName} ${s.lastName} (${s.phoneNumber})`,
                        value: s.id
                    }));
                    this.subscribers = [...this.subscribers, ...items];
                },
                error: () => {
                    console.error('Failed to fetch subscribers');
                },
                complete: () => {
                    this.isLoadingSubscribers = false;
                }
            });
    }
}
