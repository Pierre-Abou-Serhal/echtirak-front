import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Subscriber } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as Papa from 'papaparse';

// --- API response types for clarity ---
interface SubscribersPage {
    items: Subscriber[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

interface SubscribersResponse {
    page: SubscribersPage;
}

@Component({
    selector: 'app-subscribers',
    standalone: true,
    imports: [TableModule, InputIcon, IconField, FormsModule, ButtonDirective, InputText, Button],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly destroyRef = inject(DestroyRef);

    // =========================
    // Data & UI state
    // =========================
    subscribers: Subscriber[] = [];
    selectedSubscribers: Subscriber[] = [];

    loading = true;
    private loadingMore = false;

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;          // index of first row in current UI page
    rows  = 10;         // number of rows per UI page

    // API pagination
    private apiPageSize = 100;   // requested page size
    private currentApiPage = -1; // last page index loaded from API (-1 = none yet)
    private hasMoreFromServer = true;

    // Total records in the DB (from API `page.totalCount`)
    totalRecords = 0;

    // Searching
    keyword = '';
    private search$ = new Subject<string>();

    ngOnInit(): void {
        // Stream of search terms → reset state → load first API page
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap((q) => {
                    this.keyword = q;
                    this.resetDataState();       // clear current list & pagination
                    this.loading = true;
                }),
                // first API page: if your backend is 1-based, use 1 instead of 0
                switchMap(() => this.fetchApiPage(0).pipe(
                    finalize(() => (this.loading = false))
                )),
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
    }

    // =========================
    // API wrapper using full page object
    // =========================
    private fetchApiPage(pageNumber: number) {
        pageNumber = Math.max(1, pageNumber || 1);  // <— clamp here

        this.loadingMore = true;

        return this.generatorOwnerService.getSubscribers({
            pageNumber,
            pageSize: this.apiPageSize,
            keyword: this.keyword || undefined
        })
            .pipe(
                tap((res: SubscribersResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const {
                        items = [],
                        pageNumber: apiPageNumber,
                        pageSize,
                        totalCount,
                        totalPages,
                        hasNext,
                        hasPrevious
                    } = page;

                    // Append items from this page to the list
                    this.subscribers = [...this.subscribers, ...items];

                    // Track API pagination state
                    this.currentApiPage = apiPageNumber;
                    if (pageSize && pageSize > 0) {
                        this.apiPageSize = pageSize;
                    }

                    // Use server totalCount if available
                    this.totalRecords = typeof totalCount === 'number'
                        ? totalCount
                        : this.subscribers.length;

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
        this.rows  = event.rows  ?? this.rows;

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

        const csv = Papa.unparse(this.subscribers);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    actionTaken(subscriber: Subscriber) {
        alert(`clicked on ${subscriber.firstName} ${subscriber.lastName}`);
    }
}
