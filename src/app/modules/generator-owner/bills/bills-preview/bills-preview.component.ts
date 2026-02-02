import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Bill } from '@/core/models/model';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
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

type BillRow = Bill & { billPeriodKey: string };

@Component({
    selector: 'app-bills-preview-component',
    imports: [TableModule, FormsModule, InputText, Button, DecimalPipe, Tag, DatePipe, ButtonDirective, IconField, InputIcon, Tooltip, BillEditModalComponent, NgClass, Dialog],
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
        return {
            ...b,
            billPeriodKey: `${b.billYear}-${String(b.billMonth).padStart(2, '0')}`
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
        if (id != null) delete this.expandedRows[String(id)];
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
        // modal returns Bill; convert it back to BillRow
        const updatedRow = this.toBillRow(updatedBill);

        // Update in the source array
        const idx = this._allBills.findIndex((b) => b.id === updatedRow.id);
        if (idx !== -1) this._allBills[idx] = updatedRow;

        // Re-split after change
        this.splitBills();

        // Keep selection in sync
        const sIdx = this.selectedBills.findIndex((b) => b.id === updatedRow.id);
        if (sIdx !== -1) this.selectedBills[sIdx] = updatedRow;

        // If currently editing, update reference
        if (this.billToEdit?.id === updatedRow.id) {
            this.billToEdit = updatedRow;
        }
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
        this.isAcceptBillsLoading = true;

        if (this.selectedBills.length === 0) {
            this.isAcceptBillsLoading = false;
            this.notificationService.warn('Warning', 'Please select bills to accept');
            return;
        }

        const billYear = this.selectedBills[0].billYear;
        const billMonth = this.selectedBills[0].billMonth;

        this.generatorOwnerService
            .acceptBills({
                bills: this.selectedBills,
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
    }

    openDuplicatesDialog() {
        this.duplicatesVisible = true;
    }

    protected readonly BillStatus = BillStatus;
}
