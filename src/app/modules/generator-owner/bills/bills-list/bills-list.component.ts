import { Component, DestroyRef, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { GetBillsResponse, GetGeneratorsResponse, GetLookupResponse, UpdateBillResponse } from '@/core/services/api/response';
import { Bill, Generator, Lookup } from '@/core/models/model';
import { BillStatus, LookupDomain } from '@/core/enums/enum';
import { debounceTime, finalize, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Papa from 'papaparse';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { DatePipe, DecimalPipe, formatDate, NgClass } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { UpdateBillRequest } from '@/core/services/api/request';
import { NotificationService } from '@/core/services/notification.service';
import { BillEditModalComponent } from '@/modules/generator-owner/bills/bill-edit-modal/bill-edit-modal.component';

export interface BillSearchFilter {
    generatorId?: number;
    subscriberName?: string;
    statusCode?: string;
    billDateFrom?: Date;
    billDateTo?: Date;
}

@Component({
    selector: 'app-bills-list-component',
    imports: [Button, Tag, TableModule, FormsModule, IconField, InputIcon, InputText, DatePicker, Select, DatePipe, DecimalPipe, ButtonDirective, NgClass, BillEditModalComponent],
    templateUrl: './bills-list.component.html',
    styleUrl: './bills-list.component.scss',
    standalone: true
})
export class BillsListComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    private readonly destroyRef = inject(DestroyRef);

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.billSearchFilter = {};
    }

    bills: Bill[] = [];
    selectedBills: Bill[] = [];

    loading = true;
    private loadingMore = false;

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0; // index of first row in current UI page
    rows = 10; // number of rows per UI page

    // API pagination
    private apiPageSize = 100; // requested page size
    private currentApiPage = -1; // last page index loaded from API (-1 = none yet)
    private hasMoreFromServer = true;

    // Total records in the DB (from API `page.totalCount`)
    totalRecords = 0;

    // Search filters
    billSearchFilter: BillSearchFilter;
    billStatuses: SelectOptionStrValue[] = [];
    generators: SelectOptionNumValue[] = [];
    isBillStatusesLoading: boolean = true;
    isGeneratorsLoading: boolean = true;

    // Edit inside table
    clonedBills: { [id: string]: Bill } = {};

    // per-row loading flags
    editBtnLoading: Record<number, boolean> = {};

    private search$ = new Subject<BillSearchFilter>();

    // Expandable Rows
    expandedRows: Record<string, boolean> = {};

    // Update Bill Modal
    editVisible = false;
    billToEdit: Bill | null = null;

    ngOnInit(): void {
        // Fetch subscriber statuses drop down items
        this.generatorOwnerService.getLookup({ domain: LookupDomain.BILL_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.billStatuses = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
                this.isBillStatusesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.billStatuses = [];
                this.isBillStatusesLoading = false;
            }
        });

        // Fetch generators drop down items
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((generator: Generator) => ({
                    value: generator.id,
                    label: generator.code
                }));
                this.isGeneratorsLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.generators = [];
                this.isGeneratorsLoading = false;
            }
        });

        // Stream of search terms → reset state → load first API page
        this.search$
            .pipe(
                debounceTime(300),
                tap(() => {
                    this.resetDataState(); // clear current list & pagination
                    this.loading = true;
                }),
                // first API page: if your backend is 1-based, use 1 instead of 0
                switchMap(() => this.fetchApiPage(1).pipe(finalize(() => (this.loading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    // Ensure that the first visible UI page has data
                    this.ensureDataFor(this.first + this.rows);
                },
                error: () => {
                    this.bills = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        // Initial load (empty search)
        this.search$.next(this.billSearchFilter);
    }

    // =========================
    // API wrapper using full page object
    // =========================
    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const { billDateFrom, billDateTo } = this.billSearchFilter;

        return this.generatorOwnerService
            .getBills({
                pageNumber,
                pageSize: this.apiPageSize,
                billDateFrom: billDateFrom ? formatDate(billDateFrom, 'yyyy-MM-dd', this.locale) : undefined,
                billDateTo: billDateTo ? formatDate(billDateTo, 'yyyy-MM-dd', this.locale) : undefined,
                statusCode: this.billSearchFilter.statusCode,
                generatorId: this.billSearchFilter.generatorId,
                subscriberName: this.billSearchFilter.subscriberName
            })
            .pipe(
                tap((res: GetBillsResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    // Append items from this page to the list
                    this.bills = [...this.bills, ...items];

                    // Track API pagination state
                    this.currentApiPage = apiPageNumber;
                    if (pageSize && pageSize > 0) {
                        this.apiPageSize = pageSize;
                    }

                    // Use server totalCount if available
                    this.totalRecords = totalCount;

                    // Rely on API flag to know if more pages exist
                    this.hasMoreFromServer = hasNext;
                }),
                finalize(() => (this.loadingMore = false))
            );
    }

    /**
     * Ensure that we have loaded data up to `targetIndex`.
     * If not, fetch the next API page (and repeat if needed).
     */
    private ensureDataFor(targetIndex: number): void {
        // Already have enough data
        if (targetIndex < this.bills.length) return;

        // No more data on server or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // Rare case: even after loading, targetIndex is still beyond what we have
                if (targetIndex >= this.bills.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => {
                this.hasMoreFromServer = false;
            }
        });
    }

    /**
     * Reset state when search / filters change
     */
    private resetDataState(): void {
        this.bills = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    // =========================
    // UI events
    // =========================

    clear(table: Table) {
        table.clear();
        this.search$.next(this.billSearchFilter);
    }

    // Custom "next" button (top left)
    next() {
        if (this.isLastPage()) return;

        this.first = this.first + this.rows;
        // Ask for data beyond the end of the new page
        this.ensureDataFor(this.first + this.rows);
    }

    // Custom "prev" button
    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    // PrimeNG paginator event (bottom paginator)
    pageChange(event: any) {
        const oldRows = this.rows;
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        // When rows-per-page changes, reset to first page
        if (event.rows != null && event.rows !== oldRows) {
            this.first = 0;
        }

        // Ensure that the new page has data (and load more from API if needed)
        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.bills.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // =========================
    // Export & actions
    // =========================

    exportToCsv() {
        if (!this.bills?.length) return;

        let listToExport: Bill[] = this.bills;

        if (this.selectedBills.length > 0) {
            listToExport = this.selectedBills;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bills.csv';
        a.click();
        URL.revokeObjectURL(url);
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

    // Search filter functions
    applyFilters() {
        this.search$.next(this.billSearchFilter);
    }

    resetFilters() {
        this.billSearchFilter = {
            billDateFrom: undefined,
            billDateTo: undefined,
            subscriberName: undefined,
            generatorId: undefined,
            statusCode: undefined
        };

        this.applyFilters();
    }

    // Edit inside table functions
    onRowEditInit(bill: Bill) {
        // Keep a clone so we can revert on cancel or error
        this.clonedBills[bill.id] = { ...bill };
    }

    openBillEditModal(bill: any) {
        this.billToEdit = bill;
        this.editVisible = true;
    }

    onBillEditSave(updatedBill: any) {
        this.updateBill(updatedBill);
    }

    onBillEditCancel() {
        // optional hook
    }

    onRowEditSave(bill: Bill) {
        this.updateBill(bill);
    }

    updateBill(bill: Bill) {
        console.log('bill to update', bill);

        this.setEditLoading(bill.id, true);

        let request: UpdateBillRequest = {
            billId: bill.id,
            subscriberLastName: bill.subscriberLastName,
            billDate: bill.billDate,
            amount: bill.amount,
            statusCode: bill.statusCode,
            currencyCode: bill.currencyCode,
            kvaFee: bill.kvaFee,
            notes: bill.notes,
            currentKva: bill.currentKva,
            previousKva: bill.previousKva,
            subscriberFirstName: bill.subscriberFirstName,
            subscriberId: bill.subscriberId,
            subscriptionAmps: bill.subscriptionAmps,
            subscriptionFeeFixed: bill.subscriptionFeeFixed,
            subscriptionFeeVar: bill.subscriptionFeeVar,
            status: bill.statusCode
        };

        this.generatorOwnerService.updateBill(request).subscribe({
            next: (response: UpdateBillResponse) => {
                this.notificationService.success('Successful', 'Bill updated successfully');

                console.log(this.findIndexById(request.billId));
                console.log(response.response.oldBill);

                // The updated bill will become the old one
                this.bills[this.findIndexById(request.billId)] = response.response.oldBill;

                // Will insert a new fresh bill at the top of the array if updated from PENDING to PENDING
                if (response.response.newBill.id !== response.response.oldBill.id) {
                    this.bills.push(response.response.newBill);
                }

                this.setEditLoading(bill.id, false);
            },
            error: (err) => {
                console.log(err);
                this.setEditLoading(bill.id, false);
            }
        });
    }

    payBill(bill: Bill) {
        bill.statusCode = BillStatus.PAID;
        this.updateBill(bill);
    }

    cancelBill(bill: Bill) {
        bill.statusCode = BillStatus.CANCELLED;
        this.updateBill(bill);
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.bills.length; i++) {
            if (this.bills[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    // Expandable row functions
    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[id] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) delete this.expandedRows[id];
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.bills.filter((s) => s?.id != null).map((s) => [String(s.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    setEditLoading(id: number, value: boolean) {
        this.editBtnLoading[id] = value;
    }

    protected readonly BillStatus = BillStatus;
}
