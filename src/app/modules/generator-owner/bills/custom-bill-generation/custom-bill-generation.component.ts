import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { Bill, Generator, Subscriber } from '@/core/models/model';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { GenerateBillsForSelectedSubscribersResponse, GetGeneratorsResponse, GetSubscribersResponse } from '@/core/services/api/response';
import { SubscriberStatus } from '@/core/enums/enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Table, TableModule } from 'primeng/table';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { SelectOptionNumValue } from '@/core/dtos/dto';
import { Select } from 'primeng/select';
import { BillsPreviewComponent } from '@/modules/generator-owner/bills/bills-preview/bills-preview.component';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { DecimalPipe, NgClass } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { formatSubscriberAddress, getBillYearMonth } from '@/core/utils/utils';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-custom-bill-generation-component',
    imports: [Button, TableModule, ButtonDirective, IconField, InputIcon, InputText, FormsModule, Tag, Select, BillsPreviewComponent, LbPhonePipe, NgClass, DatePicker, DecimalPipe, Tooltip],
    templateUrl: './custom-bill-generation.component.html',
    styleUrl: './custom-bill-generation.component.scss',
    standalone: true
})
export class CustomBillGenerationComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);

    billsPreview: Bill[] = [];

    subscribers: Subscriber[] = [];
    selectedSubscribers: Subscriber[] = [];
    generators: SelectOptionNumValue[] = [];

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

    // Searching
    keyword = '';
    private search$ = new Subject<{ keyword: string; generatorId: number }>();
    selectedGeneratorId: number = 0;
    isGeneratorsLoading: boolean = true;

    isGeneratingBills: boolean = false;

    // Expandable Rows
    expandedRows: Record<string, boolean> = {};

    billPeriod: Date | null = null;

    ngOnInit(): void {
        // Fetch generators drop down items
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((generator: Generator) => ({
                    value: generator.id,
                    label: generator.code
                }));
                this.isGeneratorsLoading = false;
                this.selectedGeneratorId = response.generators[0].id ?? 0;
                // Initial load (empty search)
                this.search$.next({ keyword: '', generatorId: this.selectedGeneratorId });
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
                distinctUntilChanged((prev, curr) => prev.keyword === curr.keyword && prev.generatorId === curr.generatorId),
                tap(({ keyword }) => {
                    this.keyword = keyword;
                    this.resetDataState();
                    this.loading = true;
                }),
                switchMap(() => this.fetchApiPage(1).pipe(finalize(() => (this.loading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    // Ensure that the first visible UI page has data
                    this.ensureDataFor(this.first + this.rows);
                },
                error: () => {
                    this.subscribers = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });
    }

    // =========================
    // API wrapper using full page object
    // =========================
    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        return this.generatorOwnerService
            .getSubscribers({
                pageNumber,
                pageSize: this.apiPageSize,
                keyword: this.keyword || undefined,
                generatorId: this.selectedGeneratorId ?? undefined
            })
            .pipe(
                tap((res: GetSubscribersResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    // Append items from this page to the list
                    this.subscribers = [...this.subscribers, ...items];

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
        if (targetIndex < this.subscribers.length) return;

        // No more data on server or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // Rare case: even after loading, targetIndex is still beyond what we have
                if (targetIndex >= this.subscribers.length && this.hasMoreFromServer) {
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
        this.subscribers = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    // =========================
    // UI events
    // =========================

    onGlobalFilter(table: Table, value: string) {
        const v = value.trim();
        this.search$.next({ keyword: v, generatorId: this.selectedGeneratorId });

        // If you want ONLY server-side filtering, comment this out:
        // table.filterGlobal(v, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.search$.next({ keyword: '', generatorId: this.selectedGeneratorId });
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
        const atEndOfLoadedArray = this.first + this.rows >= this.subscribers.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // UI styling
    getSubscriberSeverity(statusCode: string) {
        switch (statusCode) {
            case SubscriberStatus.INACTIVE:
                return 'danger';

            case SubscriberStatus.ACTIVE:
                return 'success';

            default:
                return null;
        }
    }

    onGeneratorChange() {
        this.search$.next({ keyword: this.keyword, generatorId: this.selectedGeneratorId });
        this.selectedSubscribers = [];
    }

    // Generate bills functions
    generateBills() {
        const period = getBillYearMonth(this.billPeriod);

        if (!period) {
            this.notificationService.warn('Warning', 'Please select Bill Period (year/month)');
            return;
        }

        if (this.selectedSubscribers.length === 0) {
            this.notificationService.warn('Warning', 'Please select subscribers to generate their bills');
            return;
        }

        this.isGeneratingBills = true;
        this.billsPreview = [];

        this.generatorOwnerService
            .generateBillsForSelectedSubscribers({
                generatorId: this.selectedGeneratorId,
                subscriberIds: this.selectedSubscribers.map((sub) => sub.id),
                billMonth: period.billMonth,
                billYear: period.billYear
            })
            .subscribe({
                next: (response: GenerateBillsForSelectedSubscribersResponse) => {
                    this.billsPreview = response.bills.map((bill, index) => ({
                        ...bill,
                        id: index + 1
                    }));
                    this.isGeneratingBills = false;
                },
                error: (err) => {
                    console.log(err);
                    this.billsPreview = [];
                    this.isGeneratingBills = false;
                }
            });
    }

    // Expandable row functions
    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[String(id)] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) delete this.expandedRows[String(id)];
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.subscribers.filter((s) => s?.id != null).map((s) => [String(s.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    protected readonly formatSubscriberAddress = formatSubscriberAddress;
}
