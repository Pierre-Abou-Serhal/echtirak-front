import { Component, inject, Input } from '@angular/core';
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

@Component({
    selector: 'app-bills-preview-component',
    imports: [TableModule, FormsModule, InputText, Button, DecimalPipe, Tag, DatePipe, ButtonDirective, IconField, InputIcon, Tooltip, BillEditModalComponent, NgClass, Dialog],
    templateUrl: './bills-preview.component.html',
    styleUrl: './bills-preview.component.scss'
})
export class BillsPreviewComponent {
    private _allBills: Bill[] = [];

    displayBills: Bill[] = [];
    duplicateBills: Bill[] = [];

    duplicatesVisible = false;

    @Input({ required: true })
    set billsPreview(value: Bill[]) {
        this._allBills = value ?? [];

        this.duplicateBills = this._allBills.filter((b) => b.hasDuplicateBill);
        this.displayBills = this._allBills.filter((b) => !b.hasDuplicateBill);

        // Reset table-related state whenever new data arrives
        this.selectedBills = [];
        this.expandedRows = {};
        this.expandedDuplicateRows = {};
        this.first = 0;

        // Auto-open duplicates dialog if any duplicates exist
        if (this.duplicateBills.length > 0) {
            this.duplicatesVisible = true;
        }
    }
    get billsPreview(): Bill[] {
        return this._allBills;
    }

    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    selectedBills: Bill[] = [];

    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    keyword = '';
    isAcceptBillsLoading = false;

    // expandable rows
    expandedRows: Record<string, boolean> = {};

    // expandable rows (duplicates dialog table)
    duplicateKeyword = '';
    expandedDuplicateRows: Record<string, boolean> = {};

    onDuplicateGlobalFilter(table: Table, value: string) {
        const v = value.trim();
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

    // edit modal
    editVisible = false;
    billToEdit: Bill | null = null;

    // --- table helpers
    clear(table: Table) {
        table.clear();
    }

    onGlobalFilter(table: Table, value: string) {
        const v = value.trim();
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

    // --- row expansion
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

    // --- modal open / save
    openBillEditModal(bill: Bill) {
        this.billToEdit = bill;
        this.editVisible = true;
    }

    onBillEditSave(updatedBill: Bill) {
        // If edited bill is now duplicate / not duplicate, re-split safely:
        const idx = this._allBills.findIndex((b) => b.id === updatedBill.id);
        if (idx !== -1) this._allBills[idx] = updatedBill;

        this.duplicateBills = this._allBills.filter((b) => b.hasDuplicateBill);
        this.displayBills = this._allBills.filter((b) => !b.hasDuplicateBill);

        // Keep selection in sync
        const sIdx = this.selectedBills.findIndex((b) => b.id === updatedBill.id);
        if (sIdx !== -1) this.selectedBills[sIdx] = updatedBill;
    }

    onBillEditCancel() {
        // optional
    }

    // --- UI styling
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

    // --- Accept Bills (unchanged)
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
                billMonth: billMonth,
                billYear: billYear
            })
            .subscribe({
                next: (response: AcceptBillsResponse) => {
                    if (response.success) {
                        this.notificationService.success('Bill Accepted', `Successfully inserted: ${response.billsInserted} bills`);
                    } else {
                        this.notificationService.error('Bill Rejected', `Something went wrong while inserting bills`);
                    }

                    // clear
                    this._allBills = [];
                    this.displayBills = [];
                    this.duplicateBills = [];
                    this.selectedBills = [];
                    this.expandedRows = {};
                    this.isAcceptBillsLoading = false;
                },
                error: (err) => {
                    console.log(err);
                    this._allBills = [];
                    this.displayBills = [];
                    this.duplicateBills = [];
                    this.selectedBills = [];
                    this.expandedRows = {};
                    this.isAcceptBillsLoading = false;
                }
            });
    }

    // Button handler
    openDuplicatesDialog() {
        this.duplicatesVisible = true;
    }

    protected readonly BillStatus = BillStatus;
}
