import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import * as Papa from 'papaparse';

import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { Bill, BillCollection, BillCollectorProfile, Forecast, Lookup } from '@/core/models/model';
import { ApproveOrRejectBillCollectionRequest, GetBillCollectionsQueryParam, GetBillsQueryParams, WalletForecastRequest } from '@/core/services/api/request';
import {
    ApproveOrRejectBillCollectionResponse,
    GetBillCollectorForGOResponse,
    GetBillsResponse,
    GetLookupResponse,
    GoGetBillCollectionsResponse,
    GOGetBillCollectionsItem,
    GOGetBillCollectionsSummary,
    WalletForecastResponse
} from '@/core/services/api/response';
import { BillCollectionRecordStatus, BillCollectionStatus, LookupDomain } from '@/core/enums/enum';
import { SelectOptionNumValue } from '@/core/dtos/dto';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { WalletService } from '@/core/services/wallet.service';

import { BillEditModalComponent } from '@/modules/generator-owner/bills/bill-edit-modal/bill-edit-modal.component';

type SelectOptionStrValue = {
    label: string;
    value: string;
};

@Component({
    selector: 'app-bill-collections',
    standalone: true,
    imports: [FormsModule, Button, TableModule, Tag, DatePicker, Select, InputNumber, DatePipe, DecimalPipe, CurrencyPipe, ConfirmDialogModule, Dialog, ToggleSwitch, BillEditModalComponent],
    templateUrl: './bill-collections.component.html',
    providers: [ConfirmationService]
})
export class BillCollectionsComponent implements OnInit, OnDestroy {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    private readonly walletService = inject(WalletService);

    private readonly notificationService = inject(NotificationService);

    private readonly confirmationService = inject(ConfirmationService);

    private readonly destroyRef = inject(DestroyRef);

    billCollectorGroups: GOGetBillCollectionsItem[] = [];
    billCollections: BillCollection[] = [];

    selectedCollections: BillCollection[] = [];

    private selectedCollectionsById = new Map<number, BillCollection>();

    summary: GOGetBillCollectionsSummary = this.emptySummary();

    loading = false;
    approving = false;
    rejecting = false;

    /**
     * Client-side pagination of loaded records.
     */
    first = 0;
    rows = 10;
    rowsPerPageOptions = [10, 50, 100, 200];

    /**
     * Server-side batch pagination.
     */
    private readonly serverPageSize = 2000;
    private currentServerPage = 0;

    totalRecords = 0;

    billReference: number | null = null;
    selectedRecordStatus: string | null = null;
    selectedBillCollectorId: number | null = null;

    createdFrom: Date | null = null;
    createdTo: Date | null = null;

    recordStatuses: SelectOptionStrValue[] = [];
    isRecordStatusesLoading = true;

    billCollectors: SelectOptionNumValue[] = [];
    isBillCollectorsLoading = true;

    hasAppliedRequiredFilters = false;

    billPreviewVisible = false;
    billPreviewLoading = false;
    billPreviewBill: Bill | null = null;

    // Approval dialog
    approvalDialogVisible = false;
    approvalCollections: BillCollection[] = [];
    sendPaidSms = false;

    // SMS forecast
    forecastingPaidSms = false;
    paidSmsForecastFailed = false;
    paidSmsForecast: Forecast | null = null;

    private paidSmsForecastRequest?: Subscription;

    ngOnInit(): void {
        this.applyDefaultFilterValues();
        this.loadLookups();
        this.loadBillCollectors();
    }

    ngOnDestroy(): void {
        this.paidSmsForecastRequest?.unsubscribe();
    }

    private loadLookups(): void {
        this.generatorOwnerService
            .getLookup({
                domain: LookupDomain.BILL_COLLECTION_RECORD_STATUS
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: GetLookupResponse) => {
                    this.recordStatuses = response.items.map((lookup: Lookup) => ({
                        value: lookup.code,
                        label: lookup.description
                    }));

                    this.selectedRecordStatus = BillCollectionRecordStatus.COLLECTED_PENDING_GO_APPROVAL;

                    this.isRecordStatusesLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.recordStatuses = [];
                    this.isRecordStatusesLoading = false;
                }
            });
    }

    private loadBillCollectors(): void {
        this.generatorOwnerService
            .getBillCollectorForGO()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: GetBillCollectorForGOResponse) => {
                    this.billCollectors = response.collectors.map((collector: BillCollectorProfile) => {
                        const collectorId = collector.userId ?? collector.id ?? 0;

                        return {
                            value: collectorId,
                            label: `${collector.firstName} ` + `${collector.lastName} - ` + collector.username
                        };
                    });

                    this.isBillCollectorsLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.billCollectors = [];
                    this.isBillCollectorsLoading = false;
                }
            });
    }

    private loadBillCollectionsPage(pageNumber: number, append: boolean): void {
        if (!this.hasAppliedRequiredFilters) {
            return;
        }

        if (this.filtersInvalid) {
            this.notificationService.warn('Validation', 'Please fill all required filters before searching.');
            return;
        }

        const queryParams: GetBillCollectionsQueryParam = {
            pageNumber,
            pageSize: this.serverPageSize,
            billReference: this.billReference ?? undefined,
            billCollectorId: this.selectedBillCollectorId ?? undefined,
            collectionScope: BillCollectionStatus.COLLECTED_BY_BC,
            collectionStatus: this.selectedRecordStatus ?? undefined,
            createdFrom: this.toApiDate(this.createdFrom),
            createdTo: this.toApiDate(this.createdTo)
        };

        this.loading = true;

        this.generatorOwnerService
            .getBillCollections(queryParams)
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GoGetBillCollectionsResponse) => {
                    const newCollections = this.mapCollectionsFromResponse(response);

                    this.currentServerPage = pageNumber;

                    this.totalRecords = response.page?.totalCount ?? newCollections.length;

                    this.summary = response.summary ?? this.emptySummary();

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
                error: (error) => {
                    console.error(error);

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
        if (!this.canLoadMoreCollections) {
            return;
        }

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
        if (this.selectedCollectionsById.size === 0) {
            return;
        }

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
            billId: collection.billId,
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

        const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });

        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = 'bill-collections.csv';

        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    }

    applyFilters(): void {
        if (this.requiredFiltersMissing) {
            this.notificationService.warn('Validation', 'Either enter a Bill Reference, or fill Bill Collector, Record Status, Created From, and Created To.');
            return;
        }

        if (this.dateRangeInvalid()) {
            return;
        }

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
        const eligibleCollections = this.approvableSelectedCollections;

        if (eligibleCollections.length === 0) {
            this.notificationService.warn('Warning', 'Please select at least one collection pending GO approval.');
            return;
        }

        this.clearPaidSmsForecast();

        this.approvalCollections = [...eligibleCollections];

        this.sendPaidSms = false;
        this.approvalDialogVisible = true;
    }

    rejectSelected(): void {
        const eligibleCollections = this.approvableSelectedCollections;

        if (eligibleCollections.length === 0) {
            this.notificationService.warn('Warning', 'Please select at least one collection pending GO approval.');
            return;
        }

        this.confirmationService.confirm({
            header: 'Reject Collections',
            message: `Are you sure you want to reject ` + `${eligibleCollections.length} ` + `selected pending collection(s)?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                this.approveOrRejectCollections(eligibleCollections, false, false);
            }
        });
    }

    get approvalCollectionCount(): number {
        return this.approvalCollections.length;
    }

    get approvalAmountTotals(): {
        currencyCode: string;
        amount: number;
    }[] {
        return this.calculateAmountTotals(this.approvalCollections);
    }

    get selectedAmountTotals(): {
        currencyCode: string;
        amount: number;
    }[] {
        return this.calculateAmountTotals(this.approvableSelectedCollections);
    }

    private calculateAmountTotals(collections: BillCollection[]): {
        currencyCode: string;
        amount: number;
    }[] {
        const totals = new Map<string, number>();

        for (const collection of collections) {
            const currencyCode = collection.currencyCode || 'UNKNOWN';

            const amount = Number(collection.amount ?? 0);

            totals.set(currencyCode, (totals.get(currencyCode) ?? 0) + amount);
        }

        return Array.from(totals.entries()).map(([currencyCode, amount]) => ({
            currencyCode,
            amount
        }));
    }

    get approvalActionLabel(): string {
        if (this.forecastingPaidSms) {
            return 'Calculating SMS Cost...';
        }

        return this.sendPaidSms ? `Approve ${this.approvalCollectionCount} & Send SMS` : `Approve ${this.approvalCollectionCount}`;
    }

    get canConfirmApproval(): boolean {
        if (this.approving || this.approvalCollections.length === 0) {
            return false;
        }

        if (!this.sendPaidSms) {
            return true;
        }

        return !this.forecastingPaidSms && !this.paidSmsForecastFailed && this.paidSmsForecast?.isAffordable === true;
    }

    closeApprovalDialog(): void {
        if (this.approving) {
            return;
        }

        this.resetApprovalDialog();
    }

    onSendPaidSmsChanged(enabled: boolean): void {
        this.sendPaidSms = enabled;
        this.clearPaidSmsForecast();

        if (!enabled) {
            return;
        }

        this.loadPaidSmsForecast();
    }

    loadPaidSmsForecast(): void {
        if (!this.sendPaidSms || this.approvalCollections.length === 0) {
            return;
        }

        const billIds = this.getApprovalBillIds();

        if (billIds.length === 0) {
            this.paidSmsForecastFailed = true;
            return;
        }

        const request: WalletForecastRequest = {
            billIds
        };

        this.paidSmsForecastRequest?.unsubscribe();

        this.forecastingPaidSms = true;
        this.paidSmsForecastFailed = false;
        this.paidSmsForecast = null;

        this.paidSmsForecastRequest = this.walletService
            .walletForecast(request)
            .pipe(
                finalize(() => {
                    this.forecastingPaidSms = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: WalletForecastResponse) => {
                    this.paidSmsForecast = response.forecast;
                },
                error: (error) => {
                    console.error(error);

                    this.paidSmsForecast = null;
                    this.paidSmsForecastFailed = true;
                }
            });
    }

    retryPaidSmsForecast(): void {
        if (this.forecastingPaidSms || !this.sendPaidSms) {
            return;
        }

        this.loadPaidSmsForecast();
    }

    continueWithoutPaidSms(): void {
        this.sendPaidSms = false;
        this.clearPaidSmsForecast();
    }

    confirmApproval(): void {
        if (!this.canConfirmApproval) {
            return;
        }

        this.approveOrRejectCollections([...this.approvalCollections], true, this.sendPaidSms);
    }

    private getApprovalBillIds(): number[] {
        const billIds = this.approvalCollections.map((collection) => Number(collection.billId));

        const hasInvalidBillId = billIds.some((billId) => !Number.isFinite(billId) || billId <= 0);

        if (hasInvalidBillId) {
            this.notificationService.warn('Missing Bill Data', 'One or more selected collections do not contain a valid bill ID.');

            return [];
        }

        return [...new Set(billIds)];
    }

    private approveOrRejectCollections(eligibleCollections: BillCollection[], approve: boolean, sendPaidSms: boolean): void {
        if (eligibleCollections.length === 0) {
            return;
        }

        const request: ApproveOrRejectBillCollectionRequest = {
            collectionIds: eligibleCollections.map((collection) => collection.id),
            approve,
            sendPaidSms: approve && sendPaidSms
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
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: ApproveOrRejectBillCollectionResponse) => {
                    const actionLabel = approve ? 'approved' : 'rejected';

                    const message = approve && sendPaidSms ? `${response.updatedCount} collection(s) approved and payment SMS messages sent successfully.` : `${response.updatedCount} collection(s) ${actionLabel} successfully.`;

                    this.notificationService.success('Successful', message);

                    if (approve) {
                        this.resetApprovalDialog();
                    }

                    this.clearSelection();
                    this.loadFirstBillCollectionsBatch();
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.warn('Failure', approve ? 'Failed to approve selected collections.' : 'Failed to reject selected collections.');
                }
            });
    }

    private resetApprovalDialog(): void {
        this.clearPaidSmsForecast();

        this.approvalDialogVisible = false;
        this.approvalCollections = [];
        this.sendPaidSms = false;
    }

    private clearPaidSmsForecast(): void {
        this.paidSmsForecastRequest?.unsubscribe();

        this.paidSmsForecastRequest = undefined;

        this.forecastingPaidSms = false;
        this.paidSmsForecastFailed = false;
        this.paidSmsForecast = null;
    }

    dateRangeInvalid(): boolean {
        if (!this.createdFrom || !this.createdTo) {
            return false;
        }

        return this.createdFrom > this.createdTo;
    }

    private toApiDate(date: Date | null): string | undefined {
        if (!date) {
            return undefined;
        }

        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

    get hasActiveFilters(): boolean {
        return this.billReference !== null || this.selectedBillCollectorId !== null || !!this.selectedRecordStatus || !!this.createdFrom || !!this.createdTo;
    }

    get canApproveReject(): boolean {
        return this.approvableSelectedCollections.length > 0 && !this.approving && !this.rejecting;
    }

    get approvableSelectedCollections(): BillCollection[] {
        return this.selectedCollections.filter((collection) => collection.statusCode === BillCollectionRecordStatus.COLLECTED_PENDING_GO_APPROVAL);
    }

    get hasBillReferenceFilter(): boolean {
        return this.billReference !== null && this.billReference !== undefined;
    }

    get areOtherFiltersRequired(): boolean {
        return !this.hasBillReferenceFilter;
    }

    get requiredFiltersMissing(): boolean {
        if (!this.areOtherFiltersRequired) {
            return false;
        }

        return this.selectedBillCollectorId == null || !this.selectedRecordStatus || !this.createdFrom || !this.createdTo;
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
            billReference
        };

        this.billPreviewLoading = true;
        this.billPreviewBill = null;

        this.generatorOwnerService
            .getBills(queryParams)
            .pipe(
                finalize(() => {
                    this.billPreviewLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GetBillsResponse) => {
                    const bill = response.page?.items?.[0] ?? null;

                    if (!bill) {
                        this.notificationService.warn('Not Found', 'No bill details found for this reference.');
                        return;
                    }

                    this.billPreviewBill = bill;
                    this.billPreviewVisible = true;
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.warn('Failure', 'Failed to load bill details.');
                }
            });
    }

    closeBillPreview(): void {
        this.billPreviewVisible = false;
        this.billPreviewBill = null;
    }

    private getDefaultCreatedFrom(): Date {
        const date = new Date();

        date.setHours(23, 59, 59, 999);

        return date;
    }

    private getDefaultCreatedTo(): Date {
        const date = new Date();

        date.setHours(23, 59, 59, 999);

        return date;
    }

    private applyDefaultFilterValues(): void {
        this.createdFrom = this.getDefaultCreatedFrom();

        this.createdTo = this.getDefaultCreatedTo();
    }
}
