import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, formatDate, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import * as Papa from 'papaparse';

import { Button } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { BillCollection, BillCollectorProfile, Lookup } from '@/core/models/model';

import { ApproveOrRejectBillCollectionRequest, GetBillCollectionsQueryParam } from '@/core/services/api/request';

import { ApproveOrRejectBillCollectionResponse, GetBillCollectorForGOResponse, GetLookupResponse, GoGetBillCollectionsResponse, GOGetBillCollectionsItem, GOGetBillCollectionsSummary } from '@/core/services/api/response';

import { BillCollectionRecordStatus, BillCollectionStatus, LookupDomain } from '@/core/enums/enum';

import { SelectOptionNumValue } from '@/core/dtos/dto';

type SelectOptionStrValue = {
    label: string;
    value: string;
};

@Component({
    selector: 'app-bill-collections',
    standalone: true,
    imports: [FormsModule, Button, TableModule, Tag, DatePicker, Select, InputNumber, DatePipe, DecimalPipe, CurrencyPipe, ConfirmDialogModule],
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

    summary: GOGetBillCollectionsSummary = {
        collectionsCount: 0,
        collectionsAmount: 0,
        pendingApprovalCount: 0,
        pendingApprovalAmount: 0,
        approvedCount: 0,
        approvedAmount: 0,
        rejectedCount: 0,
        rejectedAmount: 0
    };

    loading = false;
    approving = false;
    rejecting = false;

    first = 0;
    rows = 10;
    totalRecords = 0;
    rowsPerPageOptions = [10, 20, 50, 100];

    billId: number | null = null;
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

    sortField: keyof BillCollection | null = null;
    sortOrder: 1 | -1 = 1;

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

    loadBillCollections(event?: TableLazyLoadEvent): void {
        if (this.dateRangeInvalid()) return;

        if (event) {
            this.first = event.first ?? 0;
            this.rows = event.rows ?? this.rows;

            if (event.sortField) {
                const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;

                this.sortField = field as keyof BillCollection;
            }

            if (event.sortOrder === 1 || event.sortOrder === -1) {
                this.sortOrder = event.sortOrder;
            }
        }

        const pageNumber = Math.floor(this.first / this.rows) + 1;

        const queryParams: GetBillCollectionsQueryParam = {
            pageNumber,
            pageSize: this.rows,
            billId: this.billId ?? undefined,
            billCollectorId: this.selectedBillCollectorId ?? undefined,
            collectionScope: this.selectedCollectionStatus ?? undefined,
            collectionStatus: this.selectedRecordStatus ?? undefined,
            createdFrom: this.toApiDate(this.createdFrom),
            createdTo: this.toApiDate(this.createdTo)
        };

        this.loading = true;

        this.generatorOwnerService
            .getBillCollections(queryParams)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response: GoGetBillCollectionsResponse) => {
                    this.billCollectorGroups = response.items ?? [];
                    this.summary = response.summary ?? this.emptySummary();

                    this.billCollections = this.billCollectorGroups.flatMap((group) =>
                        (group.bcCollections ?? []).map((collection) => ({
                            ...collection,
                            billCollectorUserId: collection.billCollectorUserId ?? group.billCollectorId,
                            billCollectorName: collection.billCollectorName || group.billCollectorName
                        }))
                    );

                    this.totalRecords = response.page?.totalCount ?? this.billCollections.length;

                    this.applyCurrentPageSort();
                    this.refreshSelectedObjectsFromCurrentPage();
                },
                error: (err) => {
                    console.error(err);

                    this.billCollectorGroups = [];
                    this.billCollections = [];
                    this.summary = this.emptySummary();
                    this.totalRecords = 0;

                    this.notificationService.warn('Failure', 'Failed to load bill collections.');
                }
            });
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

    private applyCurrentPageSort(): void {
        if (!this.sortField) return;

        const field = this.sortField;
        const order = this.sortOrder;

        this.billCollections = [...this.billCollections].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return -1 * order;
            if (bValue == null) return 1 * order;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * order;
            }

            if (field === 'createdAt') {
                const aDate = new Date(String(aValue)).getTime();
                const bDate = new Date(String(bValue)).getTime();

                return (aDate - bDate) * order;
            }

            return String(aValue).localeCompare(String(bValue)) * order;
        });
    }

    onSelectionChange(selection: BillCollection[]): void {
        const currentPageIds = new Set(this.billCollections.map((collection) => collection.id));

        for (const id of currentPageIds) {
            this.selectedCollectionsById.delete(id);
        }

        for (const collection of selection ?? []) {
            this.selectedCollectionsById.set(collection.id, collection);
        }

        this.syncSelectedCollectionsFromMap();
    }

    private refreshSelectedObjectsFromCurrentPage(): void {
        for (const collection of this.billCollections) {
            if (this.selectedCollectionsById.has(collection.id)) {
                this.selectedCollectionsById.set(collection.id, collection);
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
            billReference: collection.billId,
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
        if (this.dateRangeInvalid()) return;

        this.first = 0;
        this.clearSelection();

        this.loadBillCollections();
    }

    resetFilters(): void {
        this.billId = null;
        this.selectedCollectionStatus = null;
        this.selectedBillCollectorId = null;
        this.selectedRecordStatus = null;
        this.createdFrom = null;
        this.createdTo = null;
        this.first = 0;

        this.clearSelection();

        this.loadBillCollections();
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

                    for (const collection of eligibleCollections) {
                        this.selectedCollectionsById.delete(collection.id);
                    }

                    this.syncSelectedCollectionsFromMap();
                    this.loadBillCollections();
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
        return this.billId !== null || this.selectedBillCollectorId !== null || !!this.selectedCollectionStatus || !!this.selectedRecordStatus || !!this.createdFrom || !!this.createdTo;
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
}
