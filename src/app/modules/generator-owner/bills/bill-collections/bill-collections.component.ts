import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import * as Papa from 'papaparse';

import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { Bill, BillCollection, BillCollectorProfile, Lookup } from '@/core/models/model';

import { ApproveOrRejectBillCollectionRequest, GetBillCollectionsQueryParam, GetBillsQueryParams } from '@/core/services/api/request';

import { ApproveOrRejectBillCollectionResponse, GetBillCollectorForGOResponse, GetLookupResponse, GetBillsResponse, GoGetBillCollectionsResponse, GOGetBillCollectionsItem, GOGetBillCollectionsSummary } from '@/core/services/api/response';

import { BillCollectionRecordStatus, BillCollectionStatus, LookupDomain } from '@/core/enums/enum';

import { SelectOptionNumValue } from '@/core/dtos/dto';
import { BillEditModalComponent } from '@/modules/generator-owner/bills/bill-edit-modal/bill-edit-modal.component';

type SelectOptionStrValue = {
    label: string;
    value: string;
};

@Component({
    selector: 'app-bill-collections',
    standalone: true,
    imports: [FormsModule, Button, TableModule, Tag, DatePicker, Select, InputNumber, DatePipe, DecimalPipe, CurrencyPipe, ConfirmDialogModule, BillEditModalComponent],
    templateUrl: './bill-collections.component.html',
    providers: [ConfirmationService]
})
export class BillCollectionsComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly confirmationService = inject(ConfirmationService);

    billCollectorGroups: GOGetBillCollectionsItem[] = [];
    billCollections: BillCollection[] = [];

    selectedCollections: BillCollection[] = [];
    private selectedCollectionsById = new Map<number, BillCollection>();

    summary: GOGetBillCollectionsSummary = this.emptySummary();

    loading = false;
    approving = false;
    rejecting = false;

    /**
     * Client-side table pagination.
     * This controls how many loaded records are displayed per page.
     */
    first = 0;
    rows = 10;
    rowsPerPageOptions = [10, 50, 100, 200];

    /**
     * Server-side batch pagination.
     * The API loads 2000 records per request.
     * The table does NOT call the API on every page change.
     */
    private readonly serverPageSize = 2000;
    private currentServerPage = 0;

    /**
     * Total records available on the server.
     */
    totalRecords = 0;

    billReference: number | null = null;
    selectedCollectionStatus: string | null = null;
    selectedRecordStatus: string | null = null;
    selectedBillCollectorId: number | null = null;

    createdFrom: Date | null = null;
    createdTo: Date | null = null;

    collectionStatuses: SelectOptionStrValue[] = [];
    recordStatuses: SelectOptionStrValue[] = [];

    isCollectionStatusesLoading = true;
    isRecordStatusesLoading = true;

    billCollectors: SelectOptionNumValue[] = [];
    isBillCollectorsLoading = true;

    hasAppliedRequiredFilters = false;

    billPreviewVisible = false;
    billPreviewLoading = false;
    billPreviewBill: any | null = null;

    ngOnInit(): void {
        this.loadLookups();
        this.loadBillCollectors();
    }

    private loadLookups(): void {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.BILL_COLLECTION_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.collectionStatuses = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));

                this.isCollectionStatusesLoading = false;
            },
            error: (err) => {
                console.error(err);

                this.collectionStatuses = [];
                this.isCollectionStatusesLoading = false;
            }
        });

        this.generatorOwnerService.getLookup({ domain: LookupDomain.BILL_COLLECTION_RECORD_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.recordStatuses = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));

                this.isRecordStatusesLoading = false;
            },
            error: (err) => {
                console.error(err);

                this.recordStatuses = [];
                this.isRecordStatusesLoading = false;
            }
        });
    }

    private loadBillCollectors(): void {
        this.generatorOwnerService.getBillCollectorForGO().subscribe({
            next: (response: GetBillCollectorForGOResponse) => {
                this.billCollectors = response.collectors.map((collector: BillCollectorProfile) => {
                    const collectorId = (collector as any).userId ?? collector.id ?? 0;

                    return {
                        value: collectorId,
                        label: `${collector.firstName} ${collector.lastName} - ${collector.username}`
                    };
                });

                this.isBillCollectorsLoading = false;
            },
            error: (err) => {
                console.error(err);

                this.billCollectors = [];
                this.isBillCollectorsLoading = false;
            }
        });
    }

    private loadBillCollectionsPage(pageNumber: number, append: boolean): void {
        if (!this.hasAppliedRequiredFilters) return;

        if (this.filtersInvalid) {
            this.notificationService.warn('Validation', 'Please fill all required filters before searching.');
            return;
        }

        const queryParams: GetBillCollectionsQueryParam = {
            pageNumber,
            pageSize: this.serverPageSize,
            billReference: this.billReference ?? undefined,
            billCollectorId: this.selectedBillCollectorId!,
            collectionScope: this.selectedCollectionStatus!,
            collectionStatus: this.selectedRecordStatus!,
            createdFrom: this.toApiDate(this.createdFrom)!,
            createdTo: this.toApiDate(this.createdTo)!
        };

        this.loading = true;

        this.generatorOwnerService
            .getBillCollections(queryParams)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response: GoGetBillCollectionsResponse) => {
                    const newCollections = this.mapCollectionsFromResponse(response);

                    this.currentServerPage = pageNumber;
                    this.totalRecords = response.page?.totalCount ?? newCollections.length;
                    this.summary = response.summary ?? this.emptySummary();

                    /**
                     * Used for Bill Collector Stats.
                     * Since Bill Collector is required, this is usually one group.
                     */
                    this.billCollectorGroups = response.items ?? [];

                    if (append) {
                        const existingIds = new Set(this.billCollections.map((collection) => collection.id));

                        const uniqueNewCollections = newCollections.filter((collection) => !existingIds.has(collection.id));

                        this.billCollections = [...this.billCollections, ...uniqueNewCollections];
                    } else {
                        this.billCollections = newCollections;
                        this.first = 0;
                    }

                    this.refreshSelectedObjectsFromLoadedCollections();
                },
                error: (err) => {
                    console.error(err);

                    if (!append) {
                        this.billCollectorGroups = [];
                        this.billCollections = [];
                        this.summary = this.emptySummary();
                        this.totalRecords = 0;
                        this.currentServerPage = 0;
                    }

                    this.notificationService.warn('Failure', 'Failed to load bill collections.');
                }
            });
    }

    private mapCollectionsFromResponse(response: GoGetBillCollectionsResponse): BillCollection[] {
        return (response.items ?? []).flatMap((group) =>
            (group.bcCollections ?? []).map((collection) => ({
                ...collection,
                billCollectorUserId: collection.billCollectorUserId ?? group.billCollectorId,
                billCollectorName: collection.billCollectorName || group.billCollectorName
            }))
        );
    }

    private loadFirstBillCollectionsBatch(): void {
        this.currentServerPage = 0;
        this.loadBillCollectionsPage(1, false);
    }

    private loadNextBillCollectionsBatch(): void {
        if (!this.canLoadMoreCollections) return;

        this.loadBillCollectionsPage(this.currentServerPage + 1, true);
    }

    onTablePage(event: { first?: number; rows?: number }): void {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? this.rows;

        const reachedEndOfLoadedData = this.first + this.rows >= this.loadedRecordsCount;

        if (reachedEndOfLoadedData && this.canLoadMoreCollections) {
            this.loadNextBillCollectionsBatch();
        }
    }

    private emptySummary(): GOGetBillCollectionsSummary {
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

    onSelectionChange(selection: BillCollection[]): void {
        this.selectedCollections = selection ?? [];

        this.selectedCollectionsById.clear();

        for (const collection of this.selectedCollections) {
            this.selectedCollectionsById.set(collection.id, collection);
        }
    }

    private refreshSelectedObjectsFromLoadedCollections(): void {
        if (this.selectedCollectionsById.size === 0) return;

        const loadedById = new Map<number, BillCollection>();

        for (const collection of this.billCollections) {
            loadedById.set(collection.id, collection);
        }

        for (const selectedId of Array.from(this.selectedCollectionsById.keys())) {
            const latestCollection = loadedById.get(selectedId);

            if (latestCollection) {
                this.selectedCollectionsById.set(selectedId, latestCollection);
            } else {
                this.selectedCollectionsById.delete(selectedId);
            }
        }

        this.syncSelectedCollectionsFromMap();
    }

    private syncSelectedCollectionsFromMap(): void {
        this.selectedCollections = Array.from(this.selectedCollectionsById.values());
    }

    exportToCsv(): void {
        const listToExport = this.selectedCollections.length > 0 ? this.selectedCollections : this.billCollections;

        if (!listToExport.length) {
            this.notificationService.warn('Warning', 'No bill collections to export.');
            return;
        }

        const rowsToExport = listToExport.map((collection) => ({
            collectionId: collection.id,
            billReference: collection.billReference,
            billCollectorUserId: collection.billCollectorUserId,
            billCollectorName: collection.billCollectorName,
            amount: collection.amount,
            currencyCode: collection.currencyCode,
            recordStatus: collection.statusCode,
            collectionStatus: collection.collectionStatus,
            createdAt: collection.createdAt
        }));

        const csv = Papa.unparse(rowsToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'bill-collections.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

    applyFilters(): void {
        if (this.requiredFiltersMissing) {
            this.notificationService.warn('Validation', 'Bill Collector, Collection Status, Record Status, Created From, and Created To are required.');
            return;
        }

        if (this.dateRangeInvalid()) return;

        this.hasAppliedRequiredFilters = true;
        this.first = 0;
        this.currentServerPage = 0;
        this.totalRecords = 0;

        this.billCollectorGroups = [];
        this.billCollections = [];
        this.summary = this.emptySummary();

        this.clearSelection();

        this.loadFirstBillCollectionsBatch();
    }

    resetFilters(): void {
        this.billReference = null;
        this.selectedCollectionStatus = null;
        this.selectedBillCollectorId = null;
        this.selectedRecordStatus = null;
        this.createdFrom = null;
        this.createdTo = null;

        this.first = 0;
        this.currentServerPage = 0;
        this.totalRecords = 0;

        this.hasAppliedRequiredFilters = false;

        this.billCollectorGroups = [];
        this.billCollections = [];
        this.summary = this.emptySummary();

        this.clearSelection();
    }

    clearSelection(): void {
        this.selectedCollections = [];
        this.selectedCollectionsById.clear();
    }

    approveSelected(): void {
        this.confirmApproveReject(true);
    }

    rejectSelected(): void {
        this.confirmApproveReject(false);
    }

    private confirmApproveReject(approve: boolean): void {
        const eligibleCollections = this.approvableSelectedCollections;

        if (eligibleCollections.length === 0) {
            this.notificationService.warn('Warning', 'Please select at least one collection pending GO approval.');
            return;
        }

        const action = approve ? 'approve' : 'reject';
        const title = approve ? 'Approve Collections' : 'Reject Collections';

        this.confirmationService.confirm({
            header: title,
            message: `Are you sure you want to ${action} ${eligibleCollections.length} selected pending collection(s)?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: approve ? 'p-button-success' : 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                this.approveOrRejectSelected(approve);
            }
        });
    }

    private approveOrRejectSelected(approve: boolean): void {
        const eligibleCollections = this.approvableSelectedCollections;

        const request: ApproveOrRejectBillCollectionRequest = {
            collectionIds: eligibleCollections.map((collection) => collection.id),
            approve
        };

        if (approve) {
            this.approving = true;
        } else {
            this.rejecting = true;
        }

        this.generatorOwnerService
            .approveOrRejectBillCollection(request)
            .pipe(
                finalize(() => {
                    this.approving = false;
                    this.rejecting = false;
                })
            )
            .subscribe({
                next: (response: ApproveOrRejectBillCollectionResponse) => {
                    const actionLabel = approve ? 'approved' : 'rejected';

                    this.notificationService.success('Successful', `${response.updatedCount} collection(s) ${actionLabel} successfully.`);

                    this.clearSelection();
                    this.loadFirstBillCollectionsBatch();
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.warn('Failure', approve ? 'Failed to approve selected collections.' : 'Failed to reject selected collections.');
                }
            });
    }

    dateRangeInvalid(): boolean {
        if (!this.createdFrom || !this.createdTo) return false;

        return this.createdFrom > this.createdTo;
    }

    private toApiDate(date: Date | null): string | undefined {
        if (!date) return undefined;

        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

    get hasActiveFilters(): boolean {
        return this.billReference !== null || this.selectedBillCollectorId !== null || !!this.selectedCollectionStatus || !!this.selectedRecordStatus || !!this.createdFrom || !!this.createdTo;
    }

    get canApproveReject(): boolean {
        return this.approvableSelectedCollections.length > 0 && !this.approving && !this.rejecting;
    }

    get selectedAmountTotals(): { currencyCode: string; amount: number }[] {
        const totals = new Map<string, number>();

        for (const collection of this.approvableSelectedCollections) {
            const currencyCode = collection.currencyCode || 'UNKNOWN';
            const amount = Number(collection.amount ?? 0);

            totals.set(currencyCode, (totals.get(currencyCode) ?? 0) + amount);
        }

        return Array.from(totals.entries()).map(([currencyCode, amount]) => ({
            currencyCode,
            amount
        }));
    }

    get approvableSelectedCollections(): BillCollection[] {
        return this.selectedCollections.filter((collection) => collection.statusCode === BillCollectionRecordStatus.COLLECTED_PENDING_GO_APPROVAL);
    }

    get requiredFiltersMissing(): boolean {
        return this.selectedBillCollectorId == null || !this.selectedCollectionStatus || !this.selectedRecordStatus || !this.createdFrom || !this.createdTo;
    }

    get filtersInvalid(): boolean {
        return this.requiredFiltersMissing || this.dateRangeInvalid();
    }

    get loadedRecordsCount(): number {
        return this.billCollections.length;
    }

    get remainingRecordsCount(): number {
        return Math.max(this.totalRecords - this.loadedRecordsCount, 0);
    }

    get canLoadMoreCollections(): boolean {
        return this.hasAppliedRequiredFilters && !this.loading && this.loadedRecordsCount > 0 && this.loadedRecordsCount < this.totalRecords;
    }

    getCollectionSeverity(status: string) {
        switch (status) {
            case BillCollectionStatus.NOT_COLLECTED:
                return 'info';

            case BillCollectionStatus.COLLECTED_BY_BC:
                return 'success';

            case BillCollectionStatus.COLLECTED_BY_GO:
                return 'warn';

            default:
                return null;
        }
    }

    getRecordSeverity(statusCode: string) {
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

    openBillPreview(collection: BillCollection): void {
        const billReference = Number(collection.billReference);

        if (!Number.isFinite(billReference)) {
            this.notificationService.warn('Validation', 'Invalid bill reference.');
            return;
        }

        const queryParams: GetBillsQueryParams = {
            pageNumber: 1,
            pageSize: 1,
            billReference: billReference
        };

        this.billPreviewLoading = true;
        this.billPreviewBill = null;

        this.generatorOwnerService
            .getBills(queryParams)
            .pipe(finalize(() => (this.billPreviewLoading = false)))
            .subscribe({
                next: (response: GetBillsResponse) => {
                    const bill: Bill | null = response.page?.items?.length > 0 ? response.page.items[0] : null;

                    if (!bill) {
                        this.notificationService.warn('Not Found', 'No bill details found for this reference.');
                        return;
                    }

                    this.billPreviewBill = bill;
                    this.billPreviewVisible = true;
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.warn('Failure', 'Failed to load bill details.');
                }
            });
    }

    closeBillPreview(): void {
        this.billPreviewVisible = false;
        this.billPreviewBill = null;
    }
}
