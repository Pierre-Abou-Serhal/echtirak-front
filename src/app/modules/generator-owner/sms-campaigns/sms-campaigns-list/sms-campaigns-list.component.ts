import { Component, DestroyRef, Inject, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { SmsCampaign } from '@/core/models/model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupDomain, SmsCampaignStatus } from '@/core/enums/enum';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import * as Papa from 'papaparse';
import { debounceTime, finalize, Subject, switchMap, tap } from 'rxjs';
import { GetLookupResponse, GetSmsCampaignsResponse } from '@/core/services/api/response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

export interface SmsCampaignSearchFilter {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
}

@Component({
    selector: 'app-sms-campaigns-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule, InputTextModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TagModule, TooltipModule, Select, DatePicker, IconField, InputIcon],
    templateUrl: './sms-campaigns-list.component.html',
    styleUrl: './sms-campaigns-list.component.scss'
})
export class SmsCampaignsListComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public campaigns: SmsCampaign[] = [];
    public selectedCampaigns: SmsCampaign[] = [];
    loading = true;
    private loadingMore = false;
    isSmsCampaignStatusesLoading: boolean = true;

    //UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0; // index of first row in current UI page
    rows = 10; // number of rows per UI page

    // API pagination
    private apiPageSize = 100; // requested page size from server
    private currentApiPage = -1; // last page index loaded from API (-1 = none yet)
    private hasMoreFromServer = true;

    // Total records in the DB (from API `page.totalCount`)
    totalRecords = 0;

    public smsCampaignStatuses: SelectOptionStrValue[] = [];

    private search$ = new Subject<SmsCampaignSearchFilter>();
    smsCampaignSearchFilter: SmsCampaignSearchFilter;
    keyword: string = '';

    constructor(@Inject(LOCALE_ID) private locale: string) {
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
                    this.campaigns = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        this.smsCampaignSearchFilter = {};

        // Initial load (empty search)
        this.search$.next(this.smsCampaignSearchFilter);
        this.loadSmsCampaignStatuses();
    }

    // API wrapper for campaigns using full page object
    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const { fromDate, toDate } = this.smsCampaignSearchFilter;

        return this.generatorOwnerService
            .getSmsCampaigns({
                pageNumber,
                pageSize: this.apiPageSize,
                fromDate: fromDate ? formatDate(fromDate, 'yyyy-MM-dd', this.locale) : undefined,
                ToDate: toDate ? formatDate(toDate, 'yyyy-MM-dd', this.locale) : undefined,
                status: this.smsCampaignSearchFilter.status
            })
            .pipe(
                tap((res: GetSmsCampaignsResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    // Append items from this page to the list
                    this.campaigns = [...this.campaigns, ...items];

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
        if (targetIndex < this.campaigns.length) return;

        // No more data on server or already loading
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                // Rare case: even after loading, targetIndex is still beyond what we have
                if (targetIndex >= this.campaigns.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => {
                this.hasMoreFromServer = false;
            }
        });
    }

    loadSmsCampaignStatuses() {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.SMS_CAMPAIGN_STATUS }).subscribe({
            next: (res: GetLookupResponse) => {
                this.smsCampaignStatuses = res.items.map((item) => ({ label: item.description, value: item.code }));
                this.isSmsCampaignStatusesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.smsCampaignStatuses = [];
                this.isSmsCampaignStatusesLoading = false;
            }
        });
    }

    viewDetails(smsCampaign: SmsCampaign) {
        this.router.navigate(['/app/generator-owner/sms-campaigns', smsCampaign.id]);
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case SmsCampaignStatus.COMPLETED:
                return 'success';
            case SmsCampaignStatus.PENDING:
                return 'warn';
            case SmsCampaignStatus.PROCESSING:
                return 'info';
            case SmsCampaignStatus.FAILED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    onGlobalFilter(table: Table, event: string) {
        table.filterGlobal(event, 'contains');
        this.reset();
    }

    // Reset state when search / filters change

    private resetDataState(): void {
        this.campaigns = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    clear(table: Table) {
        this.keyword = '';
        this.reset();
        table.clear();
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
        const atEndOfLoadedArray = this.first + this.rows >= this.campaigns.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.campaigns?.length) return;

        let listToExport: SmsCampaign[] = this.campaigns;

        if (this.selectedCampaigns.length > 0) {
            listToExport = this.selectedCampaigns;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'smsCampaigns.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    applyFilters() {
        this.search$.next(this.smsCampaignSearchFilter);
    }

    resetFilters() {
        this.smsCampaignSearchFilter = {};

        this.applyFilters();
    }

    createSmsCampaign() {
        this.router.navigate(['/app/generator-owner/sms-campaigns-create']);
    }
}
