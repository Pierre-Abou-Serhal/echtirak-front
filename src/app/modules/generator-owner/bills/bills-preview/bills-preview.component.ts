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

@Component({
    selector: 'app-bills-preview-component',
    imports: [TableModule, FormsModule, InputText, Button, DecimalPipe, Tag, DatePipe, ButtonDirective, IconField, InputIcon, Tooltip, BillEditModalComponent, NgClass],
    templateUrl: './bills-preview.component.html',
    styleUrl: './bills-preview.component.scss'
})
export class BillsPreviewComponent {
    @Input({ required: true }) billsPreview: Bill[] = [];

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
        return this.billsPreview ? this.first + this.rows >= this.billsPreview.length : true;
    }

    isFirstPage(): boolean {
        return this.billsPreview ? this.first === 0 : true;
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
        this.expandedRows = Object.fromEntries(this.billsPreview.filter((b) => b?.id != null).map((b) => [String(b.id), true]));
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
        // Update billsPreview list item
        const idx = this.billsPreview.findIndex((b) => b.id === updatedBill.id);
        if (idx !== -1) this.billsPreview[idx] = updatedBill;

        // Keep selectedBills in sync (important if user selected that row)
        const sIdx = this.selectedBills.findIndex((b) => b.id === updatedBill.id);
        if (sIdx !== -1) this.selectedBills[sIdx] = updatedBill;

        // Optional: if the edited bill row is expanded, keep it expanded
        if (updatedBill?.id != null && this.expandedRows[String(updatedBill.id)]) {
            this.expandedRows[String(updatedBill.id)] = true;
        }
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
            this.notificationService.warn('Warning', 'Please select subscribers to generate their bills');
            return;
        }

        this.generatorOwnerService.acceptBills({ bills: this.selectedBills }).subscribe({
            next: (response: AcceptBillsResponse) => {
                if (response.success) {
                    this.notificationService.success('Bill Accepted', `Successfully inserted: ${response.billsInserted} bills`);
                } else {
                    this.notificationService.error('Bill Rejected', `Something went wrong while inserting bills`);
                }

                this.billsPreview = [];
                this.selectedBills = [];
                this.expandedRows = {};

                this.isAcceptBillsLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.billsPreview = [];
                this.selectedBills = [];
                this.expandedRows = {};
                this.isAcceptBillsLoading = false;
            }
        });
    }

    protected readonly BillStatus = BillStatus;
}
