import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Bill } from '@/core/models/model';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Tag } from 'primeng/tag';
import { BillStatus } from '@/core/enums/enum';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { AcceptBillsResponse } from '@/core/services/api/response';
import { NotificationService } from '@/core/services/notification.service';
import { Tooltip } from 'primeng/tooltip';
import { BillEditModalComponent } from '@/modules/generator-owner/bills/bill-edit-modal/bill-edit-modal.component';
import { Dialog } from 'primeng/dialog';

type BillRow = Bill & {
    billPeriodKey: string;

    /** UI-only: used only by Custom Bill Generation. */
    customCurrentKvaReading?: number | null;

    /** UI-only: stable base reading used to map previous/current KWH on save. */
    customKwhBasePreviousKva?: number | null;

    /** UI-only: marks that the custom reading was entered/reviewed. */
    customKwhReadingProvided?: boolean;
};

@Component({
    selector: 'app-bills-preview-component',
    imports: [TableModule, FormsModule, InputText, Button, DecimalPipe, Tag, DatePipe, ButtonDirective, IconField, InputIcon, Tooltip, BillEditModalComponent, NgClass, Dialog, CurrencyPipe],
    templateUrl: './bills-preview.component.html',
    styleUrl: './bills-preview.component.scss'
})
export class BillsPreviewComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    // keep everything internally as BillRow
    private _allBills: BillRow[] = [];

    displayBills: BillRow[] = [];
    duplicateBills: BillRow[] = [];

    duplicatesVisible = false;

    @Output() billAcceptedSuccess = new EventEmitter<void>();

    /**
     * Set this to true only when this preview is used inside Custom Bill Generation.
     * It enables the KWH reading review flow and passes customKwhReadingMode to the edit modal.
     */
    @Input() customBillGenerationMode = false;

    selectedBills: BillRow[] = [];

    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    keyword = '';
    isAcceptBillsLoading = false;

    // expandable rows
    expandedRows: Record<string, boolean> = {};

    // duplicates dialog
    duplicateKeyword = '';
    expandedDuplicateRows: Record<string, boolean> = {};

    // edit modal
    editVisible = false;
    billToEdit: BillRow | null = null;

    // Extra Options
    extraFeesExpanded: Record<number, boolean> = {};

    // Confirmation dialog for bills that need review before accept
    reviewMissingFeesVisible = false;
    billsRequiringReview: BillRow[] = [];
    missingFeeBills: BillRow[] = []; // bills that have at least 1 extra fee with missing amount
    missingKwhReadingBills: BillRow[] = []; // custom bill generation only
    expandedMissingFeeRows: Record<string, boolean> = {};
    missingFeeKeyword = '';
    missingFeeExtraFeesExpanded: Record<number, boolean> = {};

    // ========= INPUT =========
    @Input({ required: true })
    set billsPreview(value: Bill[]) {
        const incoming = value ?? [];

        // map -> BillRow (computed field)
        this._allBills = incoming.map((b) => this.toBillRow(b));

        this.splitBills();

        // Reset table-related state whenever new data arrives
        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedDuplicateRows = {};
        this.first = 0;

        // Auto-open duplicates dialog if any duplicates exist
        this.duplicatesVisible = this.duplicateBills.length > 0;
    }

    get billsPreview(): Bill[] {
        // if someone reads it, return as Bill[]
        return this._allBills;
    }

    // ========= helpers =========
    private toBillRow(b: Bill): BillRow {
        const source = b as BillRow;

        return {
            ...source,
            billPeriodKey: `${source.billYear}-${String(source.billMonth).padStart(2, '0')}`,
            customCurrentKvaReading: source.customCurrentKvaReading ?? null,
            customKwhBasePreviousKva: source.customKwhBasePreviousKva ?? null,
            customKwhReadingProvided: source.customKwhReadingProvided ?? false
        };
    }

    private splitBills(): void {
        this.duplicateBills = this._allBills.filter((b) => b.hasDuplicateBill);
        this.displayBills = this._allBills.filter((b) => !b.hasDuplicateBill);
    }

    // ========= duplicates table =========
    onDuplicateGlobalFilter(table: Table, value: string) {
        const v = (value ?? '').trim();
        this.duplicateKeyword = v;
        table.filterGlobal(v, 'contains');
    }

    clearDuplicates(table: Table) {
        table.clear();
        this.duplicateKeyword = '';
    }

    onDuplicateRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedDuplicateRows[String(id)] = true;
    }

    onDuplicateRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) delete this.expandedDuplicateRows[String(id)];
    }

    expandAllDuplicates() {
        this.expandedDuplicateRows = Object.fromEntries(this.duplicateBills.filter((b) => b?.id != null).map((b) => [String(b.id), true]));
    }

    collapseAllDuplicates() {
        this.expandedDuplicateRows = {};
    }

    // ========= main table =========
    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, value: string) {
        const v = (value ?? '').trim();
        table.filterGlobal(v, 'contains');
    }

    next() {
        this.first = this.first + this.rows;
    }
    prev() {
        this.first = this.first - this.rows;
    }
    reset() {
        this.first = 0;
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLastPage(): boolean {
        return this.displayBills ? this.first + this.rows >= this.displayBills.length : true;
    }

    isFirstPage(): boolean {
        return this.displayBills ? this.first === 0 : true;
    }

    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[String(id)] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) {
            delete this.expandedRows[String(id)];
            delete this.extraFeesExpanded[id];
        }
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.displayBills.filter((b) => b?.id != null).map((b) => [String(b.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    // ========= modal =========
    openBillEditModal(bill: BillRow) {
        this.billToEdit = bill;
        this.editVisible = true;
    }

    onBillEditSave(updatedBill: Bill) {
        const updatedRow = this.toBillRow(updatedBill);

        const idx = this._allBills.findIndex((b) => b.id === updatedRow.id);
        if (idx !== -1) this._allBills[idx] = updatedRow;

        this.splitBills();

        const sIdx = this.selectedBills.findIndex((b) => b.id === updatedRow.id);
        if (sIdx !== -1) this.selectedBills[sIdx] = updatedRow;

        if (this.billToEdit?.id === updatedRow.id) {
            this.billToEdit = updatedRow;
        }

        // recompute problematic bills after edit
        this.refreshBillsRequiringReview();

        const validIds = new Set(this.billsRequiringReview.map((b) => String(b.id)));
        this.expandedMissingFeeRows = Object.fromEntries(Object.entries(this.expandedMissingFeeRows).filter(([id]) => validIds.has(id)));
    }

    onBillEditCancel() {}

    // ========= UI styling =========
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

    // ========= Accept Bills =========
    acceptBills() {
        if (this.isAcceptBillsLoading) return;

        if (this.selectedBills.length === 0) {
            this.notificationService.warn('Warning', 'Please select bills to accept');
            return;
        }

        this.refreshBillsRequiringReview();

        if (this.billsRequiringReview.length > 0) {
            this.reviewMissingFeesVisible = true;
            return;
        }

        this.acceptBillsConfirmed();
    }

    acceptBillsConfirmed() {
        this.isAcceptBillsLoading = true;

        const sanitizedBills = this.sanitizeBillsForAccept(this.selectedBills);

        const billYear = sanitizedBills[0].billYear;
        const billMonth = sanitizedBills[0].billMonth;

        this.generatorOwnerService
            .acceptBills({
                bills: sanitizedBills,
                billMonth,
                billYear
            })
            .subscribe({
                next: (response: AcceptBillsResponse) => {
                    if (response.success) {
                        this.notificationService.success('Bill Accepted', `Successfully inserted: ${response.billsInserted} bills`);
                    } else {
                        this.notificationService.error('Bill Rejected', `Something went wrong while inserting bills`);
                    }

                    this.clearAllState();
                    this.billAcceptedSuccess.emit();
                },
                error: (err) => {
                    console.log(err);
                    this.clearAllState();
                }
            });
    }

    private clearAllState(): void {
        this._allBills = [];
        this.displayBills = [];
        this.duplicateBills = [];
        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedDuplicateRows = {};
        this.isAcceptBillsLoading = false;
        this.duplicatesVisible = false;
        this.billToEdit = null;
        this.editVisible = false;
        this.reviewMissingFeesVisible = false;
        this.billsRequiringReview = [];
        this.missingFeeBills = [];
        this.missingKwhReadingBills = [];
    }

    openDuplicatesDialog() {
        this.duplicatesVisible = true;
    }

    // Extra Fees:
    toggleExtraFees(billId: number) {
        this.extraFeesExpanded[billId] = !this.extraFeesExpanded[billId];
    }

    isExtraFeesExpanded(billId: number): boolean {
        return this.extraFeesExpanded[billId];
    }

    getExtraFeesTotalUsd(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    }

    getExtraFeesTotalLbp(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, f) => sum + (Number(f.amountLBP) || 0), 0);
    }

    private hasMissingExtraFeeAmounts(bill: BillRow): boolean {
        const fees = bill.extraFees ?? [];
        if (fees.length === 0) return false;

        return fees.some((f) => Number(f?.amount ?? 0) <= 0);
    }

    private findBillsWithMissingExtraFeeAmounts(bills: BillRow[]): BillRow[] {
        return (bills ?? []).filter((b) => this.hasMissingExtraFeeAmounts(b));
    }

    private hasMissingCustomKwhReading(bill: BillRow): boolean {
        if (!this.customBillGenerationMode) return false;

        const reading = Number(bill.customCurrentKvaReading ?? bill.currentKva);
        const baseReading = Number(bill.customKwhBasePreviousKva ?? bill.previousKva);

        if (!bill.customKwhReadingProvided) return true;
        if (!Number.isFinite(reading)) return true;
        if (!Number.isFinite(baseReading)) return true;

        return reading < baseReading;
    }

    private findBillsWithMissingCustomKwhReadings(bills: BillRow[]): BillRow[] {
        return (bills ?? []).filter((b) => this.hasMissingCustomKwhReading(b));
    }

    private refreshBillsRequiringReview(): void {
        this.missingFeeBills = this.findBillsWithMissingExtraFeeAmounts(this.selectedBills);
        this.missingKwhReadingBills = this.findBillsWithMissingCustomKwhReadings(this.selectedBills);

        const byId = new Map<number, BillRow>();

        for (const bill of [...this.missingFeeBills, ...this.missingKwhReadingBills]) {
            if (bill.id != null) byId.set(bill.id, bill);
        }

        this.billsRequiringReview = Array.from(byId.values());
    }

    get hasBlockingKwhReadingIssues(): boolean {
        return this.missingKwhReadingBills.length > 0;
    }

    getReviewIssues(bill: BillRow): string[] {
        const issues: string[] = [];

        if (this.hasMissingExtraFeeAmounts(bill)) {
            issues.push('Missing extra fee amount');
        }

        if (this.hasMissingCustomKwhReading(bill)) {
            issues.push('Missing Current KWH reading');
        }

        return issues;
    }

    // Accept dialog
    closeAcceptConfirmation() {
        this.billsRequiringReview = [];
        this.missingFeeBills = [];
        this.missingKwhReadingBills = [];
    }

    private sanitizeBillsForAccept(bills: BillRow[]): Bill[] {
        return (bills ?? []).map((bill) => {
            const validExtraFees = (bill.extraFees ?? []).filter((f) => Number(f?.amount ?? 0) > 0);
            const { billPeriodKey, customCurrentKvaReading, customKwhBasePreviousKva, customKwhReadingProvided, ...sanitizedBill } = bill;

            return {
                ...sanitizedBill,
                extraFees: validExtraFees.length > 0 ? validExtraFees : null
            } as Bill;
        });
    }

    openMissingFeeBillEdit(bill: BillRow) {
        this.openBillEditModal(bill);
    }

    closeMissingFeesReview() {
        this.reviewMissingFeesVisible = false;
    }

    acceptBillsAnyway() {
        this.refreshBillsRequiringReview();

        if (this.hasBlockingKwhReadingIssues) {
            this.notificationService.warn('Warning', 'Please enter the missing Current KWH reading before accepting the bills.');
            return;
        }

        this.reviewMissingFeesVisible = false;
        this.acceptBillsConfirmed();
    }

    acceptBillsAfterReview() {
        this.refreshBillsRequiringReview();

        if (this.billsRequiringReview.length > 0) {
            this.notificationService.warn('Warning', 'Please fix all required bill issues before accepting.');
            return;
        }

        this.reviewMissingFeesVisible = false;
        this.acceptBillsConfirmed();
    }

    getProblematicExtraFees(bill: BillRow) {
        return (bill.extraFees ?? []).filter((f) => Number(f?.amount ?? 0) <= 0);
    }

    clearMissingFeeTable(table: Table) {
        table.clear();
        this.missingFeeKeyword = '';
    }

    onMissingFeeRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedMissingFeeRows[String(id)] = true;
    }

    onMissingFeeRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) {
            delete this.expandedMissingFeeRows[String(id)];
            delete this.missingFeeExtraFeesExpanded[id];
        }
    }

    expandAllMissingFeeRows() {
        this.expandedMissingFeeRows = Object.fromEntries(this.billsRequiringReview.filter((b) => b?.id != null).map((b) => [String(b.id), true]));
    }

    collapseAllMissingFeeRows() {
        this.expandedMissingFeeRows = {};
    }

    toggleMissingFeeExtraFees(billId: number) {
        this.missingFeeExtraFeesExpanded[billId] = !this.missingFeeExtraFeesExpanded[billId];
    }

    isMissingFeeExtraFeesExpanded(billId: number): boolean {
        return this.missingFeeExtraFeesExpanded[billId];
    }

    isMissingAmount(fee: any): boolean {
        return Number(fee?.amount ?? 0) <= 0;
    }

    onMissingFeeGlobalFilter(table: Table, value: string) {
        const v = (value ?? '').trim();
        this.missingFeeKeyword = v;
        table.filterGlobal(v, 'contains');
    }

    protected readonly BillStatus = BillStatus;
    protected readonly Number = Number;
}
