import { Component, inject, Input } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Bill } from '@/core/models/model';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { Tag } from 'primeng/tag';
import { BillStatus } from '@/core/enums/enum';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { AcceptBillsResponse } from '@/core/services/api/response';
import { NotificationService } from '@/core/services/notification.service';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-bills-preview-component',
    imports: [TableModule, FormsModule, InputText, Button, DecimalPipe, InputNumber, Tag, DatePipe, ButtonDirective, IconField, InputIcon, Tooltip],
    templateUrl: './bills-preview.component.html',
    styleUrl: './bills-preview.component.scss'
})
export class BillsPreviewComponent {
    @Input({ required: true }) billsPreview: Bill[] = [];

    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    selectedBills: Bill[] = [];

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // Edit inside table
    clonedBills: { [id: string]: Bill } = {};

    // Search keyword
    keyword: string = '';

    // Accept bills
    isAcceptBillsLoading: boolean = false;

    // Edit inside table functions
    onRowEditInit(bill: Bill) {
        // Keep a clone so we can revert on cancel or error
        this.clonedBills[bill.id] = { ...bill };
    }

    onRowEditSave(bill: Bill) {
        // Update bill API call
        console.log(bill);
    }

    onRowEditCancel(bill: Bill, index: number) {
        // user cancelled → revert from clone
        const original = this.clonedBills[bill.id];
        if (original) {
            this.billsPreview[index] = original;
            delete this.clonedBills[bill.id];
        }
    }

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

    // UI styling
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

    // Accept Bills
    acceptBills() {
        this.isAcceptBillsLoading = true;

        if (this.selectedBills.length === 0) {
            this.isAcceptBillsLoading = false;
            this.notificationService.warn('Warning', 'Please select subscribers to generate their bills');
            return;
        }

        this.generatorOwnerService
            .acceptBills({
                bills: this.selectedBills
            })
            .subscribe({
                next: (response: AcceptBillsResponse) => {
                    if (response.success) {
                        this.notificationService.success('Bill Accepted', `Successfully inserted: ${response.billsInserted} bills`);
                    } else {
                        this.notificationService.error('Bill Rejected', `Something wen wrong while inserting bills`);
                    }

                    this.billsPreview = [];
                    this.selectedBills = [];

                    this.isAcceptBillsLoading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.billsPreview = [];
                    this.selectedBills = [];
                    this.isAcceptBillsLoading = false;
                }
            });
    }
}
