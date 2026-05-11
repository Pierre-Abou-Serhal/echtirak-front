import { Component, DestroyRef, Inject, inject, LOCALE_ID, OnInit } from '@angular/core';
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
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ConfirmationService, MenuItem } from 'primeng/api';

import * as Papa from 'papaparse';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { GetGeneratorsResponse, GetLookupResponse, GetKVAReadingsResponse, UpdateKVAReadingResponse } from '@/core/services/api/response';

import { Generator, KvaReading, Lookup } from '@/core/models/model';
import { KvaReadingHistoryAction, KvaReadingStatus, LookupDomain } from '@/core/enums/enum';
import { KvaReadingSearchFilter, SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { UpdateKVAReadingRequest } from '@/core/services/api/request';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { KvaEditModalComponent } from '@/modules/generator-owner/kva-reading-history/kva-edit-modal/kva-edit-modal.component';

import { LbPhonePipe } from '@/core/pipes/pipes';
import { provideNgxMask } from 'ngx-mask';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-kva-reading-history.component',
    imports: [
        FormsModule,
        DatePipe,
        DecimalPipe,
        TableModule,
        Button,
        ButtonDirective,
        Tag,
        IconField,
        InputIcon,
        InputText,
        DatePicker,
        Select,
        Dialog,
        Skeleton,
        KvaEditModalComponent,
        LbPhonePipe,
        ContextMenuModule,
        ConfirmDialog,
        ConfirmDialogModule
    ],
    templateUrl: './kva-reading-history.component.html',
    styleUrl: './kva-reading-history.component.scss',
    standalone: true,
    providers: [provideNgxMask(), ConfirmationService]
})
export class KvaReadingHistoryComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly confirmationService = inject(ConfirmationService);

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.filter = {};
    }

    // Data
    kvaReadings: KvaReading[] = [];
    selectedReadings: KvaReading[] = [];

    // Loading
    loading = true;
    private loadingMore = false;

    // UI pagination
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

    // Image dialog
    isKvaImageDialogOpen = false;
    loadingKvaImage = false;

    kvaImageUrl?: SafeUrl;
    private kvaImageObjectUrl?: string;

    private search$ = new Subject<KvaReadingSearchFilter>();

    // Edit modal
    kvaEditVisible = false;
    kvaToEdit: KvaReading | null = null;

    // Context menu
    items: MenuItem[] = [];
    selectedKvaReading: KvaReading | null = null;
    private actionLoading: Record<string, boolean> = {};

    ngOnInit(): void {
        this.generatorOwnerService.getGenerators().subscribe({
            next: (res: GetGeneratorsResponse) => {
                this.generators = res.generators.map((g: Generator) => ({
                    value: g.id,
                    label: g.code
                }));

                this.isGeneratorsLoading = false;
            },
            error: () => {
                this.generators = [];
                this.isGeneratorsLoading = false;
            }
        });

        this.generatorOwnerService.getLookup({ domain: LookupDomain.KVA_READING_STATUS as any }).subscribe({
            next: (res: GetLookupResponse) => {
                this.statuses = res.items
                    .filter((i) => i.code !== KvaReadingStatus.BILLED)
                    .map((l: Lookup) => ({
                        value: l.code,
                        label: l.code
                    }));

                this.isStatusesLoading = false;
            },
            error: () => {
                this.statuses = [];
                this.isStatusesLoading = false;
            }
        });

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

        this.search$.next(this.filter);
    }

    // =========================
    // API
    // =========================

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

                    if (pageSize && pageSize > 0) {
                        this.apiPageSize = pageSize;
                    }

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
            error: () => {
                this.hasMoreFromServer = false;
            }
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

    // =========================
    // UI / Filters
    // =========================

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

        if (event.rows != null && event.rows !== oldRows) {
            this.first = 0;
        }

        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEndOfLoadedArray = this.first + this.rows >= this.kvaReadings.length;

        return atEndOfLoadedArray && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    // =========================
    // Export
    // =========================

    exportToCsv(): void {
        if (!this.kvaReadings?.length) return;

        let listToExport = this.kvaReadings;

        if (this.selectedReadings?.length) {
            listToExport = this.selectedReadings;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'kva_readings.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

    // =========================
    // Helpers
    // =========================

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

    // =========================
    // Image
    // =========================

    onKvaReadingViewImage(kvaReading: KvaReading): void {
        if (!kvaReading?.id) return;

        this.setActionLoading(kvaReading.id, KvaReadingHistoryAction.VIEW_IMAGE, true);

        this.isKvaImageDialogOpen = true;
        this.loadingKvaImage = true;

        if (this.kvaImageObjectUrl) {
            URL.revokeObjectURL(this.kvaImageObjectUrl);
            this.kvaImageObjectUrl = undefined;
            this.kvaImageUrl = undefined;
        }

        this.generatorOwnerService
            .getKvaReadingImage(kvaReading.id)
            .pipe(
                finalize(() => {
                    this.loadingKvaImage = false;
                    this.setActionLoading(kvaReading.id, KvaReadingHistoryAction.VIEW_IMAGE, false);
                })
            )
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

    hideKvaImageDialog(): void {
        this.isKvaImageDialogOpen = false;
        this.loadingKvaImage = false;

        if (this.kvaImageObjectUrl) {
            URL.revokeObjectURL(this.kvaImageObjectUrl);
            this.kvaImageObjectUrl = undefined;
        }

        this.kvaImageUrl = undefined;
    }

    downloadKvaImage(): void {
        if (!this.kvaImageObjectUrl) return;

        const a = document.createElement('a');
        a.href = this.kvaImageObjectUrl;
        a.download = `kva-reading-${Date.now()}.jpg`;
        a.click();
    }

    // =========================
    // Update / Edit
    // =========================

    updateKvaReading(kvaReading: KvaReading, action: KvaReadingHistoryAction = KvaReadingHistoryAction.EDIT): void {
        const isCancelling = action === KvaReadingHistoryAction.CANCEL;

        if (!isCancelling && kvaReading.kvaReading <= kvaReading.kvaCurrent) {
            this.notificationService.error('Error', 'KWH reading must be greater than ' + kvaReading.kvaCurrent);
            return;
        }

        this.setActionLoading(kvaReading.id, action, true);

        const request: UpdateKVAReadingRequest = {
            id: kvaReading.id,
            kvaReading: kvaReading.kvaReading,
            status: kvaReading.status
        };

        this.generatorOwnerService
            .updateKVAReading(request)
            .pipe(finalize(() => this.setActionLoading(kvaReading.id, action, false)))
            .subscribe({
                next: (response: UpdateKVAReadingResponse) => {
                    this.applyUpdatedReading(response.reading);

                    this.notificationService.success('Successful', isCancelling ? 'KWH reading cancelled successfully' : 'KWH reading updated successfully');
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private applyUpdatedReading(updatedReading: KvaReading): void {
        /**
         * If the current filter is PENDING and the reading becomes CANCELLED,
         * remove it from the current table because it no longer matches the filter.
         */
        if (this.filter.status && updatedReading.status !== this.filter.status) {
            this.kvaReadings = this.removeReadingFromArray(this.kvaReadings, updatedReading.id);
            this.selectedReadings = this.removeReadingFromArray(this.selectedReadings, updatedReading.id);
            return;
        }

        this.kvaReadings = this.replaceReadingInArray(this.kvaReadings, updatedReading);

        if (updatedReading.status !== KvaReadingStatus.PENDING) {
            this.selectedReadings = this.removeReadingFromArray(this.selectedReadings, updatedReading.id);
        } else {
            this.selectedReadings = this.replaceReadingInArray(this.selectedReadings, updatedReading);
        }
    }

    private replaceReadingInArray(list: KvaReading[], updatedReading: KvaReading): KvaReading[] {
        const index = list.findIndex((reading) => reading.id === updatedReading.id);

        if (index === -1) return list;

        const copy = [...list];
        copy[index] = updatedReading;

        return copy;
    }

    private removeReadingFromArray(list: KvaReading[], readingId: number): KvaReading[] {
        return list.filter((reading) => reading.id !== readingId);
    }

    openKvaEditModal(kvaReading: KvaReading | null | undefined): void {
        if (!kvaReading) return;

        this.setActionLoading(kvaReading.id, KvaReadingHistoryAction.EDIT, true);

        this.kvaToEdit = kvaReading;
        this.kvaEditVisible = true;

        this.setActionLoading(kvaReading.id, KvaReadingHistoryAction.EDIT, false);
    }

    onKvaEditSave(updated: KvaReading): void {
        this.updateKvaReading(updated);
    }

    onKvaEditCancel(): void {
        // Optional hook
    }

    // =========================
    // Context Menu
    // =========================

    openRowMenu(event: MouseEvent, kvaReading: KvaReading, cm: ContextMenu): void {
        event.preventDefault();
        event.stopPropagation();

        this.selectedKvaReading = kvaReading;
        this.items = this.buildMenuItems(kvaReading);

        cm.show(event);
    }

    private buildMenuItems(kvaReading: KvaReading): MenuItem[] {
        const id = kvaReading.id;

        return [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                disabled: !this.isPending(kvaReading) || this.isActionLoading(id, KvaReadingHistoryAction.EDIT),
                data: {
                    severity: 'info',
                    loading: this.isActionLoading(id, KvaReadingHistoryAction.EDIT)
                },
                command: () => this.openKvaEditModal(kvaReading)
            },
            {
                label: 'View Image',
                icon: 'pi pi-eye',
                disabled: !kvaReading.kvaReadingUrl || this.isActionLoading(id, KvaReadingHistoryAction.VIEW_IMAGE),
                data: {
                    severity: 'secondary',
                    loading: this.isActionLoading(id, KvaReadingHistoryAction.VIEW_IMAGE)
                },
                command: () => this.onKvaReadingViewImage(kvaReading)
            },
            {
                label: 'Cancel KWH',
                icon: 'pi pi-times-circle',
                disabled: !this.isPending(kvaReading) || this.isActionLoading(id, KvaReadingHistoryAction.CANCEL),
                data: {
                    severity: 'danger',
                    loading: this.isActionLoading(id, KvaReadingHistoryAction.CANCEL)
                },
                command: () => this.cancelKvaReading(kvaReading)
            }
        ];
    }

    private isPending(kvaReading: KvaReading | null | undefined): boolean {
        return !!kvaReading && kvaReading.status === KvaReadingStatus.PENDING;
    }

    private key(id: number, action: KvaReadingHistoryAction): string {
        return `${id}:${action}`;
    }

    isActionLoading(id: number, action: KvaReadingHistoryAction): boolean {
        return !!this.actionLoading[this.key(id, action)];
    }

    setActionLoading(id: number, action: KvaReadingHistoryAction, value: boolean): void {
        this.actionLoading[this.key(id, action)] = value;

        if (this.selectedKvaReading?.id === id) {
            this.items = this.buildMenuItems(this.selectedKvaReading);
        }
    }

    onMenuItemClick(item: MenuItem, ev: Event): void {
        ev.preventDefault();
        ev.stopPropagation();

        if (item.disabled) return;

        item.command?.({
            originalEvent: ev,
            item
        });
    }

    cancelKvaReading(kvaReading: KvaReading | null | undefined): void {
        if (!kvaReading) return;

        this.confirmationService.confirm({
            message: 'Are you sure you want to cancel this KWH reading?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                const updated: KvaReading = {
                    ...kvaReading,
                    status: KvaReadingStatus.CANCELLED
                };

                this.updateKvaReading(updated, KvaReadingHistoryAction.CANCEL);
            }
        });
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
