import { Component, DestroyRef, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';

import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';

import { BillCollection } from '@/core/models/model';
import { GetBillCollectionsQueryParam } from '@/core/services/api/request';

import { BCGetBillCollectionsItem, BCGetBillCollectionsResponse, BCGetBillCollectionsSummary } from '@/core/services/api/response';

import { QrScannerComponent } from '@/modules/bill-collector/qr-scanner/qr-scanner.component';

import { BillCollectionRecordStatus, BillCollectionStatus } from '@/core/enums/enum';

type QrTarget = { type: 'kwh-reading'; subscriberId: number } | { type: 'bill-collection'; billId: number };

@Component({
    selector: 'app-bill-collections.component',
    standalone: true,
    imports: [Button, DataView, Tag, Skeleton, DatePipe, DecimalPipe, CurrencyPipe, FormsModule, DatePicker, Dialog, QrScannerComponent, Message],
    templateUrl: './bill-collections.component.html',
    styleUrl: './bill-collections.component.scss'
})
export class BillCollectionsComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);

    billCollections: BillCollection[] = [];
    billCollectorGroups: BCGetBillCollectionsItem[] = [];

    summary: BCGetBillCollectionsSummary = this.emptySummary();

    loadingInitial = false;
    loadingMore = false;

    private pageNumber = 1;
    private readonly pageSize = 10;

    totalCount = 0;
    hasMore = true;

    skeletonItems = [1, 2, 3];

    createdFromDate: Date | null = null;
    createdToDate: Date | null = null;

    isQrDialogOpen = false;

    collectingBillFromQr = false;
    private lastAutoCollectBillId: number | null = null;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    ngOnInit(): void {
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const collectBillId = this.getNumberFromQueryParams(params, ['collectBillId', 'billId', 'billReference']);

            if (collectBillId && collectBillId !== this.lastAutoCollectBillId) {
                this.lastAutoCollectBillId = collectBillId;
                this.collectBillFromQr(collectBillId);
            }
        });

        this.fetchFirstPage();
    }

    loadMore(): void {
        if (!this.hasMore || this.loadingMore || this.loadingInitial) return;

        this.fetchNextPage();
    }

    reload(): void {
        this.reset();
        this.fetchFirstPage();
    }

    private fetchFirstPage(): void {
        this.pageNumber = 1;
        this.loadingInitial = true;

        this.billCollectorService
            .getBillCollections(this.buildQueryParams(this.pageNumber))
            .pipe(
                finalize(() => (this.loadingInitial = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res: BCGetBillCollectionsResponse) => {
                    const groups: BCGetBillCollectionsItem[] = res.items ?? [];
                    const items: BillCollection[] = this.flattenCollections(groups);

                    this.billCollectorGroups = groups;
                    this.billCollections = items;

                    this.summary = res.summary ?? this.emptySummary();
                    this.totalCount = res.summary?.collectionsCount ?? res.page?.totalCount ?? items.length;

                    this.updateHasMore(items.length);

                    this.pageNumber = 1;
                },
                error: (err) => {
                    console.error(err);

                    this.billCollectorGroups = [];
                    this.billCollections = [];
                    this.summary = this.emptySummary();
                    this.totalCount = 0;
                    this.hasMore = false;

                    this.notificationService.warn('Failure', 'Failed to load bill collections.');
                }
            });
    }

    private fetchNextPage(): void {
        const nextPage = this.pageNumber + 1;

        this.loadingMore = true;

        this.billCollectorService
            .getBillCollections(this.buildQueryParams(nextPage))
            .pipe(
                finalize(() => (this.loadingMore = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res: BCGetBillCollectionsResponse) => {
                    const groups = res.items ?? [];
                    const items = this.flattenCollections(groups);

                    this.billCollectorGroups = [...this.billCollectorGroups, ...groups];
                    this.billCollections = [...this.billCollections, ...items];

                    this.summary = res.summary ?? this.summary;
                    this.totalCount = res.page?.totalCount ?? this.totalCount;

                    this.updateHasMore(items.length);

                    this.pageNumber = nextPage;
                },
                error: (err) => {
                    console.error(err);

                    this.hasMore = false;

                    this.notificationService.warn('Failure', 'Failed to load more bill collections.');
                }
            });
    }

    private buildQueryParams(pageNumber: number): GetBillCollectionsQueryParam {
        return {
            pageNumber,
            pageSize: this.pageSize,
            createdFrom: this.createdFromDate ? formatDate(this.createdFromDate, 'yyyy-MM-dd', this.locale) : undefined,
            createdTo: this.createdToDate ? formatDate(this.createdToDate, 'yyyy-MM-dd', this.locale) : undefined,

            collectionStatus: BillCollectionRecordStatus.COLLECTED_PENDING_GO_APPROVAL,
            collectionScope: BillCollectionStatus.COLLECTED_BY_BC
        };
    }

    private flattenCollections(groups: BCGetBillCollectionsItem[]): BillCollection[] {
        return groups.flatMap((group) =>
            (group.bcCollections ?? []).map((collection) => ({
                ...collection,
                billCollectorUserId: collection.billCollectorUserId ?? group.billCollectorId,
                billCollectorName: collection.billCollectorName || group.billCollectorName
            }))
        );
    }

    private emptySummary(): BCGetBillCollectionsSummary {
        return {
            collectionsCount: 0,
            collectionsAmount: 0,
            pendingApprovalCount: 0,
            pendingApprovalAmount: 0,
            approvedCount: 0,
            approvedAmount: 0,
            rejectedCount: 0,
            rejectedAmount: 0
        };
    }

    private reset(): void {
        this.billCollections = [];
        this.billCollectorGroups = [];
        this.summary = this.emptySummary();

        this.pageNumber = 1;
        this.totalCount = 0;
        this.hasMore = true;
    }

    get loadedCount(): number {
        return this.billCollections.length;
    }

    getSeverity(statusCode: string) {
        switch (statusCode) {
            case BillCollectionRecordStatus.COLLECTED_PENDING_GO_APPROVAL:
                return 'info';

            case BillCollectionRecordStatus.APPROVED:
                return 'success';

            case BillCollectionRecordStatus.REJECTED:
                return 'danger';

            default:
                return null;
        }
    }

    formatStatus(value: string | null | undefined): string {
        if (!value) return '—';

        return value
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    dateRangeInvalid(): boolean {
        if (!this.createdFromDate || !this.createdToDate) return false;

        return this.createdFromDate > this.createdToDate;
    }

    applyFilters(): void {
        if (this.dateRangeInvalid()) return;

        this.reload();
    }

    clearFilters(): void {
        this.createdFromDate = null;
        this.createdToDate = null;

        this.reload();
    }

    get hasActiveFilters(): boolean {
        return !!this.createdFromDate || !!this.createdToDate;
    }

    get pendingApprovalPct(): number {
        if (!this.summary.collectionsCount) return 0;

        return (this.summary.pendingApprovalCount / this.summary.collectionsCount) * 100;
    }

    get approvedPct(): number {
        if (!this.summary.collectionsCount) return 0;

        return (this.summary.approvedCount / this.summary.collectionsCount) * 100;
    }

    get rejectedPct(): number {
        if (!this.summary.collectionsCount) return 0;

        return (this.summary.rejectedCount / this.summary.collectionsCount) * 100;
    }

    openQr(): void {
        this.isQrDialogOpen = true;
    }

    closeQr(): void {
        this.isQrDialogOpen = false;
    }

    async onQrScanned(value: string): Promise<void> {
        this.isQrDialogOpen = false;

        const target = this.parseQrTarget(value);

        if (!target) {
            this.notificationService.warn('Invalid QR', 'This QR code is not recognized. Please try again or search manually.');
            return;
        }

        if (target.type === 'kwh-reading') {
            this.router.navigate(['/app', 'bill-collector', 'subscribers', 'add-kva-reading', target.subscriberId]);

            return;
        }

        if (target.type === 'bill-collection') {
            this.lastAutoCollectBillId = target.billId;

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                    collectBillId: target.billId
                },
                queryParamsHandling: 'merge'
            });

            this.collectBillFromQr(target.billId);
        }
    }

    private collectBillFromQr(billId: number): void {
        if (this.collectingBillFromQr) return;

        if (!Number.isInteger(billId) || billId <= 0) {
            this.notificationService.warn('Failure', 'Invalid bill QR code. Please try again or search manually.');
            return;
        }

        this.collectingBillFromQr = true;

        this.billCollectorService
            .ScanBillBarcode({ billId })
            .pipe(finalize(() => (this.collectingBillFromQr = false)))
            .subscribe({
                next: (res) => {
                    const collection = res?.item;

                    this.reload();
                    this.clearCollectBillQueryParam();

                    this.notificationService.success('Bill Collected', collection ? `Bill #${collection.billReference} was collected successfully. Amount: ${collection.amount} ${collection.currencyCode}.` : 'Bill was collected successfully.');
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    private clearCollectBillQueryParam(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                collectBillId: null,
                billId: null,
                billReference: null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    private parseQrTarget(value: string): QrTarget | null {
        const url = this.toUrl(value);

        if (!url) return null;

        const path = url.pathname.toLowerCase();

        const subscriberId = this.getNumberQueryParam(url, ['subscriberId', 'subscriber', 'subId']) ?? (this.isKwhReadingPath(path) ? this.getLastNumberFromPath(url.pathname) : null);

        if (subscriberId && this.isKwhReadingPath(path)) {
            return {
                type: 'kwh-reading',
                subscriberId
            };
        }

        const billId = this.getNumberQueryParam(url, ['collectBillId', 'billId', 'billReference']) ?? (this.isBillCollectionPath(path) ? this.getLastNumberFromPath(url.pathname) : null);

        if (billId && this.isBillCollectionPath(path)) {
            return {
                type: 'bill-collection',
                billId
            };
        }

        return null;
    }

    private toUrl(value: string): URL | null {
        const raw = (value ?? '').trim();

        if (!raw) return null;

        try {
            return new URL(raw);
        } catch {
            try {
                return new URL(raw, window.location.origin);
            } catch {
                return null;
            }
        }
    }

    private isKwhReadingPath(path: string): boolean {
        return path.includes('add-kva-reading') || path.includes('kva-reading');
    }

    private isBillCollectionPath(path: string): boolean {
        return path.includes('bill-collections') || path.includes('bill-collection');
    }

    private getNumberQueryParam(url: URL, names: string[]): number | null {
        for (const name of names) {
            const value = url.searchParams.get(name);

            if (!value) continue;

            const id = Number(value);

            if (Number.isInteger(id) && id > 0) return id;
        }

        return null;
    }

    private getNumberFromQueryParams(params: ParamMap, names: string[]): number | null {
        for (const name of names) {
            const value = params.get(name);

            if (!value) continue;

            const id = Number(value);

            if (Number.isInteger(id) && id > 0) return id;
        }

        return null;
    }

    private getLastNumberFromPath(pathname: string): number | null {
        const segments = pathname.split('/').filter(Boolean);

        for (let i = segments.length - 1; i >= 0; i--) {
            const id = Number(segments[i]);

            if (Number.isInteger(id) && id > 0) return id;
        }

        return null;
    }

    private updateHasMore(newItemsCount: number): void {
        if (newItemsCount === 0) {
            this.hasMore = false;
            return;
        }

        this.hasMore = newItemsCount >= this.pageSize;
    }
}
