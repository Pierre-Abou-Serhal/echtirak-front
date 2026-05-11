import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Dialog } from 'primeng/dialog';
import { Button, ButtonDirective } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { Bill } from '@/core/models/model';
import { BillStatus, ReportPaperSize } from '@/core/enums/enum';
import { BillRow } from '@/core/dtos/dto';

import { GetBillsByPeriodStatusQueryParam, GetBulkBillReportRequest } from '@/core/services/api/request';

import { GetBillsByPeriodStatusResponse } from '@/core/services/api/response';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

export function getBillYearMonth(billPeriod: Date | null): { billYear: string; billMonth: string } | null {
    if (!billPeriod) return null;

    const year = String(billPeriod.getFullYear());
    const month = String(billPeriod.getMonth() + 1).padStart(2, '0');

    return { billYear: year, billMonth: month };
}

@Component({
    selector: 'app-bulk-bill-report-modal',
    standalone: true,
    imports: [FormsModule, Dialog, Button, ButtonDirective, DatePicker, Select, TableModule, Tag, DatePipe, DecimalPipe, CurrencyPipe, NgClass, Tooltip, InputText, IconField, InputIcon],
    templateUrl: './bulk-bill-report-modal.component.html'
})
export class BulkBillReportModalComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() billStatuses: { label: string; value: string }[] = [];

    bills: BillRow[] = [];
    selectedBills: BillRow[] = [];

    loadingBills = false;
    printing = false;

    billPeriod: Date | null = new Date();

    createdFrom: Date | null = new Date();
    createdTo: Date | null = new Date();

    selectedStatus = BillStatus.PENDING;
    paperSize = ReportPaperSize.A4;

    paperSizeOptions = Object.values(ReportPaperSize).map((size) => ({
        label: size,
        value: size
    }));

    fallbackStatusOptions = [
        { label: 'Pending', value: BillStatus.PENDING },
        { label: 'Paid', value: BillStatus.PAID },
        { label: 'Cancelled', value: BillStatus.CANCELLED }
    ];

    rows = 10;
    first = 0;
    rowsPerPageOptions = [10, 20, 50, 100];

    expandedRows: { [key: string]: boolean } = {};
    private expandedExtraFees = new Set<number>();

    keyword = '';

    onDialogShow(): void {
        this.setDefaultDates();
        this.loadBills();
    }

    get statusOptions(): { label: string; value: string }[] {
        return this.billStatuses?.length ? this.billStatuses : this.fallbackStatusOptions;
    }

    get selectedCount(): number {
        return this.selectedBills.length;
    }

    get totalRecords(): number {
        return this.bills.length;
    }

    private setDefaultDates(): void {
        const today = new Date();

        this.billPeriod ??= today;
        this.createdFrom ??= today;
        this.createdTo ??= today;
    }

    private toApiDate(date: Date | null): string {
        if (!date) return '';

        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

    dateRangeInvalid(): boolean {
        if (!this.createdFrom || !this.createdTo) return false;

        return this.createdFrom > this.createdTo;
    }

    loadBills(): void {
        if (this.dateRangeInvalid()) return;

        const period = getBillYearMonth(this.billPeriod);

        if (!period) {
            this.notificationService.warn('Missing Period', 'Please select a bill month and year.');
            return;
        }

        this.loadingBills = true;
        this.selectedBills = [];

        const queryParams: GetBillsByPeriodStatusQueryParam = {
            billYear: period.billYear,
            billMonth: period.billMonth,
            status: this.selectedStatus,
            createdFrom: this.createdFrom ? this.toApiDate(this.createdFrom) : undefined,
            createdTo: this.createdTo ? this.toApiDate(this.createdTo) : undefined
        };

        this.generatorOwnerService
            .getBillsByPeriodStatus(queryParams)
            .pipe(finalize(() => (this.loadingBills = false)))
            .subscribe({
                next: (res: GetBillsByPeriodStatusResponse) => {
                    this.bills = (res?.bills ?? []).map((b: Bill) => ({
                        ...b,
                        billPeriodKey: `${b.billYear}-${String(b.billMonth).padStart(2, '0')}`
                    }));

                    this.keyword = '';

                    this.selectedBills = [];
                    this.expandedRows = {};
                    this.expandedExtraFees.clear();
                    this.first = 0;
                },
                error: (err) => {
                    console.error(err);

                    this.bills = [];
                    this.selectedBills = [];
                    this.expandedRows = {};
                    this.expandedExtraFees.clear();
                    this.first = 0;
                }
            });
    }

    onGlobalFilter(table: Table, value: string): void {
        const v = (value ?? '').trim();

        this.keyword = v;
        table.filterGlobal(v, 'contains');

        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedExtraFees.clear();
        this.first = 0;
    }

    clear(table: Table): void {
        this.keyword = '';

        table.clear();

        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedExtraFees.clear();
        this.first = 0;
    }

    printSelectedBills(): void {
        if (!this.selectedBills.length) {
            this.notificationService.warn('No Bills Selected', 'Please select at least one bill to print.');
            return;
        }

        const request: GetBulkBillReportRequest = {
            billIds: this.selectedBills.map((b) => b.id),
            paperSize: this.paperSize
        };

        this.printing = true;

        this.generatorOwnerService
            .getBulkBillReport(request)
            .pipe(finalize(() => (this.printing = false)))
            .subscribe({
                next: (response: Blob | { body?: Blob | null }) => {
                    const blob = response instanceof Blob ? response : response?.body;

                    if (!blob) {
                        this.notificationService.warn('Failure', 'The report was generated but no file was returned.');
                        return;
                    }

                    this.openBlob(blob, 'bulk-bill-report.pdf');

                    this.notificationService.success('Report Generated', `${this.selectedBills.length} bill report(s) generated successfully.`);
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.resetTableState();
    }

    private resetTableState(): void {
        this.bills = [];
        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedExtraFees.clear();
        this.keyword = '';
        this.first = 0;
    }

    private openBlob(blob: Blob, fileName: string): void {
        const file = new Blob([blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = fileName;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    pageChange(event: any): void {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? this.rows;
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    next(): void {
        if (!this.isLastPage()) {
            this.first = this.first + this.rows;
        }
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    isLastPage(): boolean {
        return this.first + this.rows >= this.totalRecords;
    }

    reset(): void {
        this.first = 0;
        this.loadBills();
    }

    expandAll(): void {
        this.expandedRows = this.bills.reduce(
            (acc, bill) => {
                acc[String(bill.id)] = true;
                return acc;
            },
            {} as { [key: string]: boolean }
        );
    }

    collapseAll(): void {
        this.expandedRows = {};
    }

    onRowExpand(event: any): void {
        const id = event.data?.id;

        if (id != null) {
            this.expandedRows[String(id)] = true;
        }
    }

    onRowCollapse(event: any): void {
        const id = event.data?.id;

        if (id != null) {
            delete this.expandedRows[String(id)];
            this.expandedExtraFees.delete(Number(id));
        }
    }

    toggleExtraFees(billId: number): void {
        if (this.expandedExtraFees.has(billId)) {
            this.expandedExtraFees.delete(billId);
        } else {
            this.expandedExtraFees.add(billId);
        }
    }

    isExtraFeesExpanded(billId: number): boolean {
        return this.expandedExtraFees.has(billId);
    }

    getExtraFeesTotalUsd(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, fee) => {
            return sum + this.toNumber(fee.amount);
        }, 0);
    }

    getExtraFeesTotalLbp(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, fee) => {
            return sum + this.toNumber(fee.amountLBP);
        }, 0);
    }

    private toNumber(value: unknown): number {
        const n = Number(String(value ?? 0).replace(/,/g, ''));

        return Number.isFinite(n) ? n : 0;
    }

    getBillSeverity(statusCode: string) {
        switch (statusCode) {
            case BillStatus.PENDING:
                return 'info';
            case BillStatus.PAID:
                return 'success';
            case BillStatus.CANCELLED:
                return 'danger';
            default:
                return null;
        }
    }
}
