import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { WalletService } from '@/core/services/wallet.service';
import { NotificationService } from '@/core/services/notification.service';

import { SmsTemplateRole } from '@/core/enums/enum';
import { SelectOptionNumValue, SmsCampaignCreateSubscriber } from '@/core/dtos/dto';

import { CreateSmsCampaignResponse, GetSmsTemplatesResponse, WalletForecastResponse, GetSubscribersResponse, GetGeneratorsResponse } from '@/core/services/api/response';

import { WalletForecastRequest } from '@/core/services/api/request';
import { Forecast, Generator, SmsTemplate, Subscriber } from '@/core/models/model';

import { Table, TableModule } from 'primeng/table';
import { Button, ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { DecimalPipe, NgClass } from '@angular/common';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { formatSubscriberAddress } from '@/core/utils/utils';

@Component({
    selector: 'app-sms-campaign-create-subscribers-component',
    standalone: true,
    imports: [FormsModule, TableModule, Button, ButtonDirective, Select, Dialog, IconField, InputIcon, InputText, Tag, NgClass, DecimalPipe, LbPhonePipe],
    templateUrl: './sms-campaign-create-subscribers.component.html',
    styleUrl: './sms-campaign-create-subscribers.component.scss'
})
export class SmsCampaignCreateSubscribersComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly walletService = inject(WalletService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    // Fixed role
    private readonly role = SmsTemplateRole.SUBSCRIBER;

    smsCampaignCreateSubscriber: SmsCampaignCreateSubscriber = {};

    // Templates
    smsTemplatesDropDown: SelectOptionNumValue[] = [];
    templates: SmsTemplate[] = [];
    isSmsTemplateLoading = false;

    // Subscribers (server-side paging)
    subscribers: Subscriber[] = [];
    isSubscribersLoading = true;

    selectedSubscriberIds = new Set<number>();
    selectedSubscribers: Subscriber[] = [];

    // UI pagination
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // API pagination (same strategy you used)
    private apiPageSize = 100;
    private currentApiPage = -1;
    private hasMoreFromServer = true;
    private loadingMore = false;
    totalRecords = 0;

    // Filters
    keyword = '';
    private search$ = new Subject<{ keyword: string; generatorId?: number }>();

    // Optional generator filter (recommended)
    generators: SelectOptionNumValue[] = [];
    selectedGeneratorId: number | null = null;
    isGeneratorsLoading = true;

    // Expand rows
    expandedRows: Record<string, boolean> = {};

    // Preview
    showTemplatePreviewDialog = false;
    previewTemplate: SmsTemplate | null = null;
    previewLang: 'en' | 'ar' = 'en';

    // Wallet forecast
    isCreatingSmsCampaign = false;
    displayWarning = false;
    displayConfirmation = false;
    forecastWallet: Forecast | null = null;

    submitted = false;

    ngOnInit(): void {
        this.loadTemplates();

        // If you want generator filter: load generators first, then kick off first search
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((g: Generator) => ({ value: g.id, label: g.code }));
                this.isGeneratorsLoading = false;

                // this.selectedGeneratorId = response.generators?.[0]?.id ?? null;

                // initial load
                this.search$.next({ keyword: '', generatorId: this.selectedGeneratorId ?? undefined });
            },
            error: () => {
                this.generators = [];
                this.isGeneratorsLoading = false;

                // still load subscribers without generator filter
                this.search$.next({ keyword: '' });
            }
        });

        // Search stream
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged((a, b) => a.keyword === b.keyword && a.generatorId === b.generatorId),
                tap(({ keyword }) => {
                    this.keyword = keyword;
                    this.resetDataState();
                    this.isSubscribersLoading = true;
                }),
                switchMap(({ generatorId }) => this.fetchApiPage(1, generatorId).pipe(finalize(() => (this.isSubscribersLoading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => this.ensureDataFor(this.first + this.rows, this.selectedGeneratorId ?? undefined),
                error: () => {
                    this.subscribers = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });
    }

    // -----------------------
    // Templates
    // -----------------------
    private loadTemplates(): void {
        this.isSmsTemplateLoading = true;

        this.generatorOwnerService.getSmsTemplate({ roleCode: this.role }).subscribe({
            next: (response: GetSmsTemplatesResponse) => {
                this.templates = response.templates;

                this.smsTemplatesDropDown = response.templates.map((t: SmsTemplate) => ({
                    value: t.id,
                    label: t.name
                }));

                this.smsCampaignCreateSubscriber.templateId = undefined;
                this.previewTemplate = null;

                this.isSmsTemplateLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.templates = [];
                this.smsTemplatesDropDown = [];
                this.isSmsTemplateLoading = false;
            }
        });
    }

    onTemplateChange(): void {
        const templateId = this.smsCampaignCreateSubscriber.templateId;
        this.previewTemplate = this.templates.find((t) => t.id === templateId) ?? null;
        this.previewLang = 'en';
    }

    openTemplatePreview(): void {
        const templateId = this.smsCampaignCreateSubscriber.templateId;
        if (!templateId) return;

        this.previewTemplate = this.templates.find((t) => t.id === templateId) ?? null;
        this.previewLang = 'en';
        this.showTemplatePreviewDialog = !!this.previewTemplate;
    }

    // -----------------------
    // Subscribers server paging
    // -----------------------
    private fetchApiPage(pageNumber: number, generatorId?: number) {
        this.loadingMore = true;

        return this.generatorOwnerService
            .getSubscribers({
                pageNumber,
                pageSize: this.apiPageSize,
                smsEnabled: true,
                keyword: this.keyword || undefined,
                generatorId: generatorId || undefined
            })
            .pipe(
                tap((res: GetSubscribersResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    this.subscribers = [...this.subscribers, ...items];

                    this.syncSelectedSubscribers();

                    this.currentApiPage = apiPageNumber;
                    if (pageSize && pageSize > 0) this.apiPageSize = pageSize;

                    this.totalRecords = totalCount;
                    this.hasMoreFromServer = hasNext;
                }),
                finalize(() => (this.loadingMore = false))
            );
    }

    private ensureDataFor(targetIndex: number, generatorId?: number): void {
        if (targetIndex < this.subscribers.length) return;
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber, generatorId).subscribe({
            next: () => {
                if (targetIndex >= this.subscribers.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex, generatorId);
                }
            },
            error: () => (this.hasMoreFromServer = false)
        });
    }

    private resetDataState(): void {
        this.subscribers = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
        this.expandedRows = {};
        this.selectedSubscribers = [];
        // this.selectedSubscriberIds.clear();
    }

    // -----------------------
    // UI events
    // -----------------------
    onGeneratorChange(): void {
        this.search$.next({ keyword: this.keyword, generatorId: this.selectedGeneratorId ?? undefined });
    }

    onKeywordChange(value: string): void {
        this.search$.next({ keyword: (value ?? '').trim(), generatorId: this.selectedGeneratorId ?? undefined });
    }

    clear(table: Table): void {
        table.clear();
        this.keyword = '';
        this.selectedSubscribers = [];
        this.selectedSubscriberIds.clear();
        this.first = 0;
        this.search$.next({ keyword: '', generatorId: this.selectedGeneratorId ?? undefined });
    }

    pageChange(event: any): void {
        const oldRows = this.rows;

        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        if (event.rows != null && event.rows !== oldRows) this.first = 0;

        this.ensureDataFor(this.first + this.rows, this.selectedGeneratorId ?? undefined);
    }

    next(): void {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
        this.ensureDataFor(this.first + this.rows, this.selectedGeneratorId ?? undefined);
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset(): void {
        this.first = 0;
    }

    isLastPage(): boolean {
        const atEndOfLoaded = this.first + this.rows >= this.subscribers.length;
        return atEndOfLoaded && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // -----------------------
    // Campaign creation + wallet forecast
    // -----------------------
    isSmsCampaignValid(): boolean {
        const { templateId, campaignName } = this.smsCampaignCreateSubscriber;

        const hasTemplate = typeof templateId === 'number' && templateId > 0;
        const hasName = typeof campaignName === 'string' && campaignName.trim().length > 0;
        const hasSubs = this.selectedSubscribers.length > 0;

        return hasTemplate && hasName && hasSubs;
    }

    onCreateClick(): void {
        this.submitted = true;

        const nameValid = !!this.smsCampaignCreateSubscriber.campaignName?.trim();
        const templateValid =
            typeof this.smsCampaignCreateSubscriber.templateId === 'number' &&
            this.smsCampaignCreateSubscriber.templateId > 0;

        // If inputs invalid -> show inline errors only
        if (!nameValid || !templateValid) return;

        // Subscribers selection -> ONLY toast (as you requested)
        if (!this.selectedSubscriberIds.size) {
            this.notificationService.warn('Warning', 'Please select at least one subscriber');
            return;
        }

        // all good
        this.forecastSmsCampaign();
    }

    forecastSmsCampaign(): void {
        if (!this.isSmsCampaignValid()) return;

        const { templateId } = this.smsCampaignCreateSubscriber;
        this.isCreatingSmsCampaign = true;

        const request: WalletForecastRequest = {
            templateId: templateId!,
            subscriberIds: Array.from(this.selectedSubscriberIds)
        };

        this.walletService.walletForecast(request).subscribe({
            next: (response: WalletForecastResponse) => {
                this.forecastWallet = response.forecast;

                if (response.forecast.isAffordable) {
                    this.displayConfirmation = true;
                } else {
                    this.displayWarning = true;
                    this.isCreatingSmsCampaign = false;
                }
            },
            error: (err) => {
                console.log(err);
                this.isCreatingSmsCampaign = false;
            }
        });
    }

    createSmsCampaign(): void {
        const { templateId, campaignName } = this.smsCampaignCreateSubscriber;

        this.generatorOwnerService
            .createSmsCampaign({
                templateId: templateId!,
                campaignName: campaignName!,
                subscriberIds: Array.from(this.selectedSubscriberIds)
            })
            .subscribe({
                next: (_response: CreateSmsCampaignResponse) => {
                    this.notificationService.success('Success', 'SMS Campaign successfully created');

                    this.submitted = false;

                    // reset UI
                    this.smsCampaignCreateSubscriber.campaignName = undefined;
                    this.selectedSubscribers = [];
                    this.selectedSubscriberIds.clear();
                    this.first = 0;
                    this.keyword = '';
                    this.selectedGeneratorId = null;

                    // close confirmation
                    this.displayConfirmation = false;
                    this.isCreatingSmsCampaign = false;

                    // reload first page
                    this.search$.next({ keyword: '' });
                },
                error: (err) => {
                    console.log(err);
                    this.isCreatingSmsCampaign = false;
                    this.displayConfirmation = false;
                }
            });
    }

    closeWarning(): void {
        this.isCreatingSmsCampaign = false;
        this.displayWarning = false;
    }

    closeConfirmation(): void {
        this.isCreatingSmsCampaign = false;
        this.displayConfirmation = false;
    }

    // -----------------------
    // Row expansion
    // -----------------------
    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[String(id)] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) delete this.expandedRows[String(id)];
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.subscribers.filter((s) => s?.id != null).map((s) => [String(s.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    onRowSelect(event: any) {
        const sub: Subscriber | undefined = event?.data;
        if (!sub) return;

        this.selectedSubscriberIds.add(sub.id);
        this.syncSelectedSubscribers();
    }

    onRowUnselect(event: any) {
        const sub: Subscriber | undefined = event?.data;
        if (!sub) return;

        this.selectedSubscriberIds.delete(sub.id);
        this.syncSelectedSubscribers();
    }

    onHeaderToggle(event: any) {
        // when checking/unchecking "select all" on the CURRENT page
        const checked: boolean = !!event.checked;

        if (checked) {
            for (const s of this.subscribers) this.selectedSubscriberIds.add(s.id);
        } else {
            for (const s of this.subscribers) this.selectedSubscriberIds.delete(s.id);
        }

        this.syncSelectedSubscribers();
    }

    private syncSelectedSubscribers(): void {
        // Only keep selections that exist in the currently loaded array (current pages loaded in memory)
        this.selectedSubscribers = this.subscribers.filter((s) => this.selectedSubscriberIds.has(s.id));
    }

    protected readonly formatSubscriberAddress = formatSubscriberAddress;
}
