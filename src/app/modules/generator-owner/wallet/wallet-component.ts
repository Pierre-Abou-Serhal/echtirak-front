import { Component, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, formatDate, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { GetWalletTransactionsQueryParams } from '@/core/services/api/request';
import { Lookup, WalletTransaction } from '@/core/models/model';
import { GetLookupResponse, GetWalletTransactionsResponse } from '@/core/services/api/response';
import * as Papa from 'papaparse';
import { WalletService } from '@/core/services/wallet.service';
import { LookupDomain } from '@/core/enums/enum';
import { finalize, tap } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';
import { UserContextService } from '@/core/services/user-context.service';

@Component({
    selector: 'app-wallet-component',
    imports: [Button, DatePicker, DatePipe, DecimalPipe, FormsModule, IconField, PrimeTemplate, ReactiveFormsModule, Select, TableModule, ProgressSpinner, AsyncPipe, CurrencyPipe, NgClass],
    templateUrl: './wallet-component.html',
    styleUrl: './wallet-component.scss'
})
export class WalletComponent implements OnInit {
    private readonly walletService = inject(WalletService);
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    readonly userContext = inject(UserContextService);

    isWalletTransactionsLoading = false;
    isWalletTransactionTypesLoading = false;

    // Filters used for the API
    filters: GetWalletTransactionsQueryParams = {};

    // Table data
    walletTransactions: WalletTransaction[] = [];
    selectedWalletTransactions: WalletTransaction[] = [];

    // Dropdown
    walletTransactionTypes: SelectOptionStrValue[] = [];

    // Data table vars
    rowsPerPageOptions: number[] = [10, 20, 50, 100];
    first: number = 0;
    rows: number = 10;

    // API pagination
    private apiPageSize = 100;
    private currentApiPage = -1; // last loaded page (-1 = none yet)
    private hasMoreFromServer = true;
    private loadingMore = false;

    totalRecords = 0;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    ngOnInit() {
        this.loadWalletTransactionTypes();
        this.loadInitialTransactions();
    }

    loadWalletTransactionTypes() {
        this.isWalletTransactionTypesLoading = true;

        this.generatorOwnerService.getLookup({ domain: LookupDomain.WALLET_TRANSACTION_TYPE }).subscribe({
            next: (response: GetLookupResponse) => {
                this.walletTransactionTypes = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
                this.isWalletTransactionTypesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.walletTransactionTypes = [];
                this.isWalletTransactionTypesLoading = false;
            }
        });
    }

    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const query: GetWalletTransactionsQueryParams = {
            pageNumber,
            pageSize: this.apiPageSize,
            fromDate: this.filters.fromDate ? formatDate(this.filters.fromDate, 'yyyy-MM-dd', this.locale) : undefined,
            toDate: this.filters.toDate ? formatDate(this.filters.toDate, 'yyyy-MM-dd', this.locale) : undefined,
            type: this.filters.type
        };

        return this.walletService.getWalletTransactions(query).pipe(
            tap((res: GetWalletTransactionsResponse) => {
                const page = res?.page;
                if (!page) {
                    this.hasMoreFromServer = false;
                    return;
                }

                const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                // Append new items
                this.walletTransactions = [...this.walletTransactions, ...items];

                // Track API state
                this.currentApiPage = apiPageNumber;
                if (pageSize && pageSize > 0) {
                    this.apiPageSize = pageSize;
                }

                this.totalRecords = totalCount ?? this.totalRecords;
                this.hasMoreFromServer = hasNext;
            }),
            finalize(() => (this.loadingMore = false))
        );
    }

    private ensureDataFor(targetIndex: number): void {
        // We already have enough data
        if (targetIndex < this.walletTransactions.length) return;

        // No more data or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        // For a 1-based API
        const nextPageNumber = this.currentApiPage < 1 ? 1 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // In case we still didn't load enough, keep going
                if (targetIndex >= this.walletTransactions.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => {
                this.hasMoreFromServer = false;
            }
        });
    }

    private loadInitialTransactions(): void {
        this.resetDataState();
        this.isWalletTransactionsLoading = true;

        // First page = 1 (or 0 if your API is 0-based)
        this.fetchApiPage(1)
            .pipe(finalize(() => (this.isWalletTransactionsLoading = false)))
            .subscribe({
                next: () => {
                    // Make sure the first UI page has data loaded
                    this.ensureDataFor(this.first + this.rows);
                },
                error: () => {
                    this.walletTransactions = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });
    }

    applyFilters() {
        this.loadInitialTransactions();
    }

    resetFilters() {
        this.filters = {};
        this.applyFilters();
    }

    private resetDataState(): void {
        this.walletTransactions = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    pageChange(event: any) {
        const oldRows = this.rows;
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        // If user changes page size, go back to first page
        if (event.rows != null && event.rows !== oldRows) {
            this.first = 0;
        }

        // Make sure the new page has data; load from API if needed
        this.ensureDataFor(this.first + this.rows);
    }

    next() {
        if (this.isLastPage()) return;

        this.first = this.first + this.rows;
        this.ensureDataFor(this.first + this.rows);
    }

    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.walletTransactions.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.walletTransactions?.length) return;

        let listToExport: WalletTransaction[] = this.walletTransactions;

        if (this.selectedWalletTransactions.length > 0) {
            listToExport = this.selectedWalletTransactions;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wallet-transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}
