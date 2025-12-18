import { Component, DestroyRef, Inject, inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, Subject, switchMap, tap } from 'rxjs';

import { Table, TableModule } from 'primeng/table';
import { Button, ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

import * as Papa from 'papaparse';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { GetGeneratorsResponse, GetLookupResponse, GetKVAReadingsResponse, UpdateKVAReadingResponse } from '@/core/services/api/response';
import { Generator, KvaReading, Lookup } from '@/core/models/model';
import { KvaReadingStatus, LookupDomain } from '@/core/enums/enum';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { UpdateKVAReadingRequest } from '@/core/services/api/request';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { InputNumber } from 'primeng/inputnumber';

export interface KvaReadingSearchFilter {
    generatorId?: number;
    subscriberId?: number;
    status?: string;
    createdAtFrom?: Date;
    createdAtTo?: Date;
    keyword?: string;
}

@Component({
    selector: 'app-kva-reading-history.component',
    imports: [FormsModule, DatePipe, DecimalPipe, TableModule, Button, ButtonDirective, Tag, IconField, InputIcon, InputText, DatePicker, Select, Dialog, Skeleton, InputNumber],
    templateUrl: './kva-reading-history.component.html',
    styleUrl: './kva-reading-history.component.scss',
    standalone: true
})
export class KvaReadingHistoryComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('dt') table!: Table;

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.filter = {};
    }

    // Data
    kvaReadings: KvaReading[] = [];
    selectedReadings: KvaReading[] = [];

    // Loading
    loading = true;
    private loadingMore = false;

    // UI pagination (PrimeNG table)
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // API pagination
    private apiPageSize = 100;
    private currentApiPage = -1;
    private hasMoreFromServer = true;

    totalRecords = 0;

    // Filters
    filter: KvaReadingSearchFilter;

    generators: SelectOptionNumValue[] = [];
    statuses: SelectOptionStrValue[] = [];

    isGeneratorsLoading = true;
    isStatusesLoading = true;

    // Edit inside table
    clonedKvaReading: { [id: string]: KvaReading } = {};

    isKvaImageDialogOpen = false;
    loadingKvaImage = false;

    kvaImageUrl?: SafeUrl;
    private kvaImageObjectUrl?: string;
    isKvaReadingSaving: boolean = false;

    private sanitizer = inject(DomSanitizer);

    private search$ = new Subject<KvaReadingSearchFilter>();

    ngOnInit(): void {
        // Generators dropdown
        this.generatorOwnerService.getGenerators().subscribe({
            next: (res: GetGeneratorsResponse) => {
                this.generators = res.generators.map((g: Generator) => ({ value: g.id, label: g.code }));
                this.isGeneratorsLoading = false;
            },
            error: () => {
                this.generators = [];
                this.isGeneratorsLoading = false;
            }
        });

        this.generatorOwnerService.getLookup({ domain: LookupDomain.KVA_READING_STATUS as any }).subscribe({
            next: (res: GetLookupResponse) => {
                this.statuses = res.items.map((l: Lookup) => ({ value: l.code, label: l.code }));
                this.isStatusesLoading = false;
            },
            error: () => {
                this.statuses = [];
                this.isStatusesLoading = false;
            }
        });

        // Search stream
        this.search$
            .pipe(
                debounceTime(250),
                tap(() => {
                    this.resetDataState();
                    this.loading = true;
                }),
                switchMap(() => this.fetchApiPage(1).pipe(finalize(() => (this.loading = false)))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => this.ensureDataFor(this.first + this.rows),
                error: () => {
                    this.kvaReadings = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });

        // Initial load
        this.search$.next(this.filter);
    }

    // ========= API =========

    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const { createdAtFrom, createdAtTo } = this.filter;

        return this.generatorOwnerService
            .getKVAReadings({
                pageNumber,
                pageSize: this.apiPageSize,
                generatorId: this.filter.generatorId,
                subscriberId: this.filter.subscriberId,
                status: this.filter.status,
                createdAtFrom: createdAtFrom ? formatDate(createdAtFrom, 'yyyy-MM-dd', this.locale) : undefined,
                createdAtTo: createdAtTo ? formatDate(createdAtTo, 'yyyy-MM-dd', this.locale) : undefined,
                keyword: this.filter.keyword
            })
            .pipe(
                tap((res: GetKVAReadingsResponse) => {
                    const page = res?.page;
                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    this.kvaReadings = [...this.kvaReadings, ...items];

                    this.currentApiPage = apiPageNumber;
                    if (pageSize && pageSize > 0) this.apiPageSize = pageSize;

                    this.totalRecords = totalCount;
                    this.hasMoreFromServer = hasNext;
                }),
                finalize(() => (this.loadingMore = false))
            );
    }

    private ensureDataFor(targetIndex: number): void {
        if (targetIndex < this.kvaReadings.length) return;
        if (!this.hasMoreFromServer || this.loadingMore) return;

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber).subscribe({
            next: () => {
                if (targetIndex >= this.kvaReadings.length && this.hasMoreFromServer) {
                    this.ensureDataFor(targetIndex);
                }
            },
            error: () => (this.hasMoreFromServer = false)
        });
    }

    private resetDataState(): void {
        this.kvaReadings = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
        this.selectedReadings = [];
    }

    // ========= UI / Filters =========

    applyFilters(): void {
        this.search$.next(this.filter);
    }

    resetFilters(): void {
        this.filter = {
            generatorId: undefined,
            subscriberId: undefined,
            status: undefined,
            createdAtFrom: undefined,
            createdAtTo: undefined,
            keyword: undefined
        };

        this.applyFilters();
    }

    clear(table: Table): void {
        table.clear();
        this.filter = {};
        this.search$.next(this.filter);
    }

    next(): void {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
        this.ensureDataFor(this.first + this.rows);
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset(): void {
        this.first = 0;
    }

    pageChange(event: any): void {
        const oldRows = this.rows;
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;

        if (event.rows != null && event.rows !== oldRows) this.first = 0;

        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.kvaReadings.length;
        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // ========= Export =========

    exportToCsv(): void {
        if (!this.kvaReadings?.length) return;

        let listToExport = this.kvaReadings;
        if (this.selectedReadings?.length) listToExport = this.selectedReadings;

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'kva_readings.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

    // ========= UI Helpers =========

    getKvaReadingSeverity(statusCode: string) {
        switch (statusCode) {
            case KvaReadingStatus.PENDING:
                return 'info';

            case KvaReadingStatus.BILLED:
                return 'success';

            case KvaReadingStatus.CANCELLED:
                return 'danger';

            default:
                return null;
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.kvaReadings.length; i++) {
            if (this.kvaReadings[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getOverlayOptions(): OverlayOptions {
        return {
            listener: (event: Event, options?: OverlayListenerOptions) => {
                if (options?.type === 'scroll') {
                    return false;
                }
                return options?.valid;
            }
        };
    }

    // See KVA reading image
    onKvaReadingViewImage(kvaReading: KvaReading) {
        if (!kvaReading?.id) return;

        this.isKvaImageDialogOpen = true;
        this.loadingKvaImage = true;

        // cleanup old preview
        if (this.kvaImageObjectUrl) {
            URL.revokeObjectURL(this.kvaImageObjectUrl);
            this.kvaImageObjectUrl = undefined;
            this.kvaImageUrl = undefined;
        }

        // IMPORTANT: use a service method that returns Blob
        this.generatorOwnerService
            .getKvaReadingImage(kvaReading.id)
            .pipe(finalize(() => (this.loadingKvaImage = false)))
            .subscribe({
                next: (blob) => {
                    this.kvaImageObjectUrl = URL.createObjectURL(blob);
                    this.kvaImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.kvaImageObjectUrl);
                },
                error: (err) => {
                    console.error('Failed to load image', err);
                    this.isKvaImageDialogOpen = false;
                }
            });
    }

    // Edit inside table functions
    onRowEditInit(kvaReading: KvaReading) {
        // Keep a clone so we can revert on cancel or error
        this.clonedKvaReading[kvaReading.id] = { ...kvaReading };
    }

    onRowEditSave(kvaReading: KvaReading) {
        this.updateKvaReading(kvaReading);
    }

    onRowEditCancel(kvaReading: KvaReading, index: number) {
        // user canceled → revert from clone
        const original = this.clonedKvaReading[kvaReading.id];
        if (original) {
            this.kvaReadings[index] = original;
            delete this.clonedKvaReading[kvaReading.id];
        }
        this.table.cancelRowEdit(kvaReading);
    }

    updateKvaReading(kvaReading: KvaReading) {
        console.log('kva reading to update', kvaReading);

        if (kvaReading.kvaReading <= kvaReading.kvaCurrent) {
            this.notificationService.error('Error', 'KWH reading must be greater than ' + kvaReading.kvaCurrent);

            return;
        }

        this.isKvaReadingSaving = true;

        let request: UpdateKVAReadingRequest = {
            id: kvaReading.id,
            kvaReading: kvaReading.kvaReading,
            status: kvaReading.status
        };

        this.generatorOwnerService.updateKVAReading(request).subscribe({
            next: (response: UpdateKVAReadingResponse) => {
                this.notificationService.success('Successful', 'KWH reading updated successfully');

                this.kvaReadings[this.findIndexById(response.reading.id)] = response.reading;

                this.isKvaReadingSaving = false;
                this.table.cancelRowEdit(kvaReading);
            },
            error: (err) => {
                console.log(err);
                this.isKvaReadingSaving = false;
                this.table.cancelRowEdit(kvaReading);
            }
        });
    }

    hideKvaImageDialog() {
        this.isKvaImageDialogOpen = false;
        this.loadingKvaImage = false;

        if (this.kvaImageObjectUrl) {
            URL.revokeObjectURL(this.kvaImageObjectUrl);
            this.kvaImageObjectUrl = undefined;
        }
        this.kvaImageUrl = undefined;
    }

    downloadKvaImage() {
        if (!this.kvaImageObjectUrl) return;

        const a = document.createElement('a');
        a.href = this.kvaImageObjectUrl;
        a.download = `kva-reading-${Date.now()}.jpg`;
        a.click();
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
