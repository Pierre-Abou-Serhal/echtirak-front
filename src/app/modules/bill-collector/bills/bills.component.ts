import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { BillSummary } from '@/core/dtos/dto';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { GetBillCollectorBillsQueryParams } from '@/core/services/api/request';
import { GetBillCollectorBillsResponse } from '@/core/services/api/response';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { BillCollectionStatus, BillStatus } from '@/core/enums/enum';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-bills',
    standalone: true,
    imports: [FormsModule, DatePipe, DecimalPipe, Button, DatePicker, IconField, InputIcon, InputText, Skeleton, Tag, LbPhonePipe],
    templateUrl: './bills.component.html'
})
export class BillsComponent implements OnInit, OnDestroy {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    billPeriod: Date | null = new Date();

    bills: BillSummary[] = [];
    filteredBills: BillSummary[] = [];

    keyword = '';
    loading = false;
    loadFailed = false;

    printingBillId: number | null = null;

    /**
     * Contains the IDs of bills whose extra-fee section is expanded.
     */
    expandedExtraFeeBillIds = new Set<number>();

    readonly skeletonItems = [1, 2, 3];
    readonly loadMoreStep = 20;

    visibleCount = this.loadMoreStep;

    private billsRequest?: Subscription;

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.billsRequest?.unsubscribe();
    }

    get periodLabel(): string {
        if (!this.billPeriod) {
            return 'All periods';
        }

        const year = this.billPeriod.getFullYear();
        const month = String(this.billPeriod.getMonth() + 1).padStart(2, '0');

        return `${year}/${month}`;
    }

    get isCurrentMonthSelected(): boolean {
        if (!this.billPeriod) {
            return false;
        }

        const today = new Date();

        return this.billPeriod.getFullYear() === today.getFullYear() && this.billPeriod.getMonth() === today.getMonth();
    }

    get visibleBills(): BillSummary[] {
        return this.filteredBills.slice(0, this.visibleCount);
    }

    get hasMoreBills(): boolean {
        return this.visibleCount < this.filteredBills.length;
    }

    reload(): void {
        this.billsRequest?.unsubscribe();

        this.loading = true;
        this.loadFailed = false;

        const queryParams: GetBillCollectorBillsQueryParams = this.billPeriod
            ? {
                  billYear: String(this.billPeriod.getFullYear()),
                  billMonth: String(this.billPeriod.getMonth() + 1).padStart(2, '0')
              }
            : {};

        this.billsRequest = this.billCollectorService
            .getBills(queryParams)
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GetBillCollectorBillsResponse) => {
                    this.bills = response?.bills ?? [];
                    this.applyFilter();
                },
                error: (error) => {
                    console.error(error);

                    this.bills = [];
                    this.filteredBills = [];
                    this.visibleCount = this.loadMoreStep;
                    this.loadFailed = true;

                    this.notificationService.error('Loading Failed', 'Failed to load the bills.');
                }
            });
    }

    onPeriodSelected(): void {
        this.keyword = '';
        this.reload();
    }

    showCurrentMonth(): void {
        const today = new Date();

        this.billPeriod = new Date(today.getFullYear(), today.getMonth(), 1);

        this.keyword = '';
        this.reload();
    }

    showAllBills(): void {
        this.billPeriod = null;
        this.keyword = '';
        this.reload();
    }

    onSearch(value: string): void {
        this.keyword = value ?? '';
        this.applyFilter();
    }

    clearSearch(): void {
        this.keyword = '';
        this.applyFilter();
    }

    loadMore(): void {
        this.visibleCount += this.loadMoreStep;
    }

    toggleExtraFees(billId: number): void {
        if (this.expandedExtraFeeBillIds.has(billId)) {
            this.expandedExtraFeeBillIds.delete(billId);
        } else {
            this.expandedExtraFeeBillIds.add(billId);
        }
    }

    isExtraFeesExpanded(billId: number): boolean {
        return this.expandedExtraFeeBillIds.has(billId);
    }

    getExtraFeesTotal(bill: BillSummary): number {
        const providedTotal = Number(bill.extraFeesTotal);

        if (Number.isFinite(providedTotal) && providedTotal > 0) {
            return providedTotal;
        }

        return (bill.extraFees ?? []).reduce((total, fee) => total + Number(fee.amount ?? 0), 0);
    }

    getExtraFeesTotalLbp(bill: BillSummary): string | null {
        if (bill.extraFeesTotalLBP?.trim()) {
            return bill.extraFeesTotalLBP;
        }

        const total = (bill.extraFees ?? []).reduce((sum, fee) => sum + this.parseFormattedAmount(fee.amountLBP), 0);

        if (total <= 0) {
            return null;
        }

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 4
        }).format(total);
    }

    getExtraFeeName(fee: BillSummary['extraFees'][number]): string {
        return fee.extraFeeName || fee.name || 'Extra fee';
    }

    private parseFormattedAmount(value: string | number | null | undefined): number {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        if (!value) {
            return 0;
        }

        const parsed = Number(value.replaceAll(',', '').trim());

        return Number.isFinite(parsed) ? parsed : 0;
    }

    private applyFilter(): void {
        const query = this.keyword.trim().toLocaleLowerCase();

        this.visibleCount = this.loadMoreStep;

        if (!query) {
            this.filteredBills = [...this.bills];
            return;
        }

        this.filteredBills = this.bills.filter((bill) => {
            const searchableText = [
                bill.id,
                bill.billReference,
                bill.subscriberId,
                bill.subscriberFirstName,
                bill.subscriberLastName,
                bill.subscriberPhoneNumber,
                bill.generatorCode,
                bill.statusCode,
                bill.statusDescription,
                bill.collectionStatus,
                bill.barcodeValue,
                bill.billingModel,
                bill.billingModelName
            ]
                .map((value) => String(value ?? ''))
                .join(' ')
                .toLocaleLowerCase();

            return searchableText.includes(query);
        });
    }

    openBillPdf(bill: BillSummary): void {
        if (this.printingBillId !== null) {
            return;
        }

        /*
         * Opening the tab immediately prevents mobile browsers
         * from treating it as an unsolicited popup.
         */
        const reportWindow = window.open('about:blank', '_blank');

        if (!reportWindow) {
            this.notificationService.warn('Popup Blocked', 'Please allow popups to open the bill PDF.');
            return;
        }

        reportWindow.opener = null;
        reportWindow.document.title = 'Preparing Bill';

        reportWindow.document.body.innerHTML = `
            <div style="
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                font-family: Arial, sans-serif;
                text-align: center;
            ">
                Preparing bill PDF...
            </div>
        `;

        this.printingBillId = bill.id;

        this.billCollectorService
            .getBillReport(bill.id)
            .pipe(
                finalize(() => {
                    if (this.printingBillId === bill.id) {
                        this.printingBillId = null;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (blob) => {
                    if (!blob || blob.size === 0) {
                        reportWindow.close();

                        this.notificationService.warn('Empty Report', 'The bill report is empty.');

                        return;
                    }

                    const pdfBlob =
                        blob.type === 'application/pdf'
                            ? blob
                            : new Blob([blob], {
                                  type: 'application/pdf'
                              });

                    const reportUrl = URL.createObjectURL(pdfBlob);

                    reportWindow.location.href = reportUrl;

                    window.setTimeout(() => {
                        URL.revokeObjectURL(reportUrl);
                    }, 5 * 60_000);
                },
                error: (error) => {
                    console.error(error);
                    reportWindow.close();

                    this.notificationService.error('Report Failed', 'Failed to open the bill PDF.');
                }
            });
    }

    isPrintingBill(billId: number): boolean {
        return this.printingBillId === billId;
    }

    getBillStatusSeverity(status: string | null | undefined): TagSeverity {
        switch (status?.toUpperCase()) {
            case BillStatus.PENDING:
                return 'info';

            case BillStatus.PAID:
                return 'success';

            case BillStatus.CANCELLED:
                return 'danger';

            default:
                return 'warn';
        }
    }

    getCollectionSeverity(status: string): TagSeverity {
        switch (status) {
            case BillCollectionStatus.NOT_COLLECTED:
                return 'info';

            case BillCollectionStatus.COLLECTED_BY_BC:
                return 'success';

            case BillCollectionStatus.COLLECTED_BY_GO:
                return 'warn';

            default:
                return 'warn';
        }
    }

    formatStatus(status: string | null | undefined): string {
        if (!status) {
            return 'Unknown';
        }

        return status
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }
}
