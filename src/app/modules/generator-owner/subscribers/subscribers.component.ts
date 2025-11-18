import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Generator, Subscriber } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Papa from 'papaparse';
import { GetGeneratorsResponse, GetSubscribersResponse, UpsertSubscriberResponse } from '@/core/services/api/response';
import { Tag } from 'primeng/tag';
import { BillingMode, SubscriberStatus } from '@/core/enums/enum';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { NotificationService } from '@/core/services/notification.service';
import { SelectOption } from '@/core/dtos/dto';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-subscribers',
    standalone: true,
    imports: [TableModule, InputIcon, IconField, FormsModule, ButtonDirective, InputText, Button, Tag, Dialog, Select, InputNumber],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);

    subscribers: Subscriber[] = [];
    selectedSubscribers: Subscriber[] = [];

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
    private search$ = new Subject<string>();

    // Subscriber dialog
    isSubscriberDialogOpen: boolean = false;
    selectedSubscriber: Subscriber = new Subscriber();
    submitted: boolean = false;
    subscriberStatuses: SelectOption[] = [
        { label: 'Active', value: SubscriberStatus.ACTIVE },
        { label: 'Inactive', value: SubscriberStatus.INACTIVE }
    ];
    billingModes: SelectOption[] = [
        { label: 'Metered', value: BillingMode.METERED },
        { label: 'Fixed', value: BillingMode.FIXED },
    ]
    isSubscriberSaving: boolean = false;
    generators: SelectOption[] = [];

    ngOnInit(): void {
        // Stream of search terms → reset state → load first API page
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap((q) => {
                    this.keyword = q;
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
                    this.subscribers = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        // Initial load (empty search)
        this.search$.next('');

        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                response.generators.forEach((generator: Generator) => {
                    this.generators.push({
                       value: generator.id,
                       label: generator.code
                    });
                });
            },
            error: (err) => {
                console.log(err);
                this.generators = [];
            }
        })
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
                keyword: this.keyword || undefined
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
        this.search$.next(v);

        // If you want ONLY server-side filtering, comment this out:
        // table.filterGlobal(v, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.search$.next('');
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

    // =========================
    // Export & actions
    // =========================

    exportToCsv() {
        if (!this.subscribers?.length) return;

        let listToExport: Subscriber[] = this.subscribers;

        if (this.selectedSubscribers.length > 0) {
            listToExport = this.selectedSubscribers;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
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

    // Dialog functions
    openNew() {
        this.selectedSubscriber = new Subscriber();
        this.submitted = false;
        this.isSubscriberDialogOpen = true;
    }

    editSubscriber(subscriber: Subscriber) {
        this.selectedSubscriber = { ...subscriber };
        this.isSubscriberDialogOpen = true;
    }

    hideDialog() {
        this.isSubscriberDialogOpen = false;
        this.submitted = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.subscribers.length; i++) {
            if (this.subscribers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveSubscriber() {
        this.submitted = true;
        this.isSubscriberSaving = true;

        if (this.isSubscriberValid()) {
            let isCreatingSub = this.selectedSubscriber.id === 0;
            this.generatorOwnerService.upsertSubscriber({
                ...this.selectedSubscriber
            }).subscribe({
                next: (response: UpsertSubscriberResponse) => {
                    if (!isCreatingSub) {
                        // Edit
                        this.subscribers[this.findIndexById(this.selectedSubscriber.id)] = this.selectedSubscriber;
                        this.notificationService.success('Successful', 'Subscriber Updated');
                    } else {
                        // Add
                        this.selectedSubscriber.id = response.id;
                        this.subscribers.push(this.selectedSubscriber);
                        this.notificationService.success('Successful', 'Subscriber Created');
                    }

                    this.subscribers = [...this.subscribers];
                    this.isSubscriberDialogOpen = false;
                    this.selectedSubscriber = new Subscriber();
                    this.isSubscriberSaving = false;
                },
                error: (err) => {
                    console.log(err);
                    this.isSubscriberSaving = false;
                }
            });
        } else {
            this.isSubscriberSaving = false;
        }
    }

    isSubscriberValid() {
        return this.selectedSubscriber.phoneNumber.length > 0 &&
            this.selectedSubscriber.firstName.length > 0 &&
            this.selectedSubscriber.lastName.length > 0 &&
            this.selectedSubscriber.subscriptionAmps > 0 &&
            this.selectedSubscriber.previousKva > 0 &&
            this.selectedSubscriber.currentKva > 0 &&
            this.selectedSubscriber.electricMeterNumber.length > 0 &&
            this.selectedSubscriber.billingModeCode.length > 0 &&
            this.selectedSubscriber.statusCode.length > 0
    }
}
