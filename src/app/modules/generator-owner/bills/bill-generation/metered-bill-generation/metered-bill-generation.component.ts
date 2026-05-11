import { Component, inject, Input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { finalize, Subject, Subscription } from 'rxjs';
import * as Papa from 'papaparse';

import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { DatePicker } from 'primeng/datepicker';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { provideNgxMask } from 'ngx-mask';

import { Bill, KvaReading, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { GenerateBillsForMeteredSubscribersResponse, GetKVAReadingsPerGeneratorResponse, GetLookupResponse, UpdateKVAReadingResponse } from '@/core/services/api/response';

import { GenerateBillsForMeteredSubscribersRequest, UpdateKVAReadingRequest } from '@/core/services/api/request';

import { KvaReadingStatus, LookupDomain } from '@/core/enums/enum';
import { KvaReadingLocalFilter, SelectOptionStrValue } from '@/core/dtos/dto';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { getBillYearMonth } from '@/core/utils/utils';

import { KvaEditModalComponent } from '@/modules/generator-owner/kva-reading-history/kva-edit-modal/kva-edit-modal.component';

enum KvaReadingAction {
    EDIT = 'EDIT',
    VIEW_IMAGE = 'VIEW_IMAGE',
    CANCEL = 'CANCEL'
}

@Component({
    selector: 'app-metered-bill-generation',
    standalone: true,
    imports: [FormsModule, Button, IconField, InputIcon, InputText, InputNumber, TableModule, Tag, DecimalPipe, Dialog, Skeleton, LbPhonePipe, KvaEditModalComponent, DatePicker, DatePipe, ContextMenuModule, ConfirmDialogModule],
    templateUrl: './metered-bill-generation.component.html',
    styleUrl: './metered-bill-generation.component.scss',
    providers: [provideNgxMask(), ConfirmationService]
})
export class MeteredBillGenerationComponent implements OnInit, OnDestroy {
    generatorId = 0;

    @Input({ alias: 'generatorId', required: true }) set _generatorId(value: number) {
        this.generatorId = value;
        this.loadKvaReadings();
    }

    @Input() acceptBills$!: Subject<void>;

    private sub?: Subscription;

    generatedBills = output<Bill[]>();

    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    notificationService: NotificationService = inject(NotificationService);
    confirmationService: ConfirmationService = inject(ConfirmationService);

    private sanitizer = inject(DomSanitizer);

    kvaReadingsAll: KvaReading[] = [];
    kvaReadings: KvaReading[] = [];

    filter: KvaReadingLocalFilter = {};
    selectedKvaReadings: KvaReading[] = [];

    isKvaReadingLoading = false;

    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    kvaReadingStatuses: SelectOptionStrValue[] = [];

    isBillsGenerating = false;

    isKvaImageDialogOpen = false;
    loadingKvaImage = false;

    kvaImageUrl?: SafeUrl;
    private kvaImageObjectUrl?: string;

    kvaEditVisible = false;
    kvaToEdit: KvaReading | null = null;

    billPeriod: Date | null = null;

    items: MenuItem[] = [];
    selectedKvaReading: KvaReading | null = null;

    private actionLoading: Record<string, boolean> = {};

    ngOnInit(): void {
        this.loadKvaReadingStatuses();

        this.sub = this.acceptBills$?.subscribe(() => this.onBillsAccepted());
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    private loadKvaReadingStatuses(): void {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.KVA_READING_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.kvaReadingStatuses = response.items
                    .filter((lookup: Lookup) => lookup.code !== KvaReadingStatus.BILLED)
                    .map((lookup: Lookup) => ({
                        value: lookup.code,
                        label: lookup.code
                    }));
            },
            error: (err) => {
                console.log(err);
                this.kvaReadingStatuses = [];
            }
        });
    }

    loadKvaReadings(): void {
        if (!this.generatorId) return;

        this.isKvaReadingLoading = true;
        this.kvaReadings = [];

        this.generatorOwnerService
            .getKVAReadingsPerGenerator({
                generatorId: this.generatorId
            })
            .subscribe({
                next: (response: GetKVAReadingsPerGeneratorResponse) => {
                    this.kvaReadingsAll = response.readings ?? [];

                    const tempSelectedKvaReadings: KvaReading[] = this.selectedKvaReadings;

                    this.applyFiltersLocal();

                    this.selectedKvaReadings = this.getSelectedKvaReadingsAfterLoad(tempSelectedKvaReadings, this.kvaReadings);

                    this.isKvaReadingLoading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.kvaReadings = [];
                    this.isKvaReadingLoading = false;
                }
            });
    }

    getSelectedKvaReadingsAfterLoad(tmpSelected: KvaReading[], loaded: KvaReading[]): KvaReading[] {
        const ids = new Set(tmpSelected.map((kvaReading) => kvaReading.id));

        return loaded.filter((kvaReading) => ids.has(kvaReading.id));
    }

    pageChange(event: any): void {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    clear(table: Table): void {
        table.clear();
    }

    next(): void {
        if (this.isLastPage()) return;

        this.first = this.first + this.rows;
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset(): void {
        this.first = 0;
    }

    isLastPage(): boolean {
        return this.first + this.rows >= this.kvaReadings.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv(): void {
        if (!this.kvaReadings?.length) return;

        let listToExport: KvaReading[] = this.kvaReadings;

        if (this.selectedKvaReadings.length > 0) {
            listToExport = this.selectedKvaReadings;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'kva-readings.csv';
        a.click();

        URL.revokeObjectURL(url);
    }

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

    generateBills(): void {
        const pendingSelectedReadings = this.selectedKvaReadings.filter((reading) => reading.status === KvaReadingStatus.PENDING);

        if (pendingSelectedReadings.length === 0) {
            this.notificationService.warn('Warning', 'Please select pending KWH readings to generate their bills');
            return;
        }

        const period = getBillYearMonth(this.billPeriod);

        if (!period) {
            this.notificationService.warn('Warning', 'Please select Bill Period (year/month)');
            return;
        }

        this.isBillsGenerating = true;

        const request: GenerateBillsForMeteredSubscribersRequest = {
            kvaReadingIds: pendingSelectedReadings.map((i) => i.id),
            billMonth: period.billMonth,
            billYear: period.billYear
        };

        this.generatorOwnerService.generateBillsForMeteredSubscribers(request).subscribe({
            next: (response: GenerateBillsForMeteredSubscribersResponse) => {
                this.generatedBills.emit(
                    response.bills.map((bill, index) => ({
                        ...bill,
                        id: index + 1
                    }))
                );

                this.isBillsGenerating = false;
            },
            error: (err) => {
                console.log(err);

                this.generatedBills.emit([]);
                this.isBillsGenerating = false;
            }
        });
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

    onKvaReadingViewImage(kvaReading: KvaReading): void {
        if (!kvaReading?.id) return;

        this.setActionLoading(kvaReading.id, KvaReadingAction.VIEW_IMAGE, true);

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
                    this.setActionLoading(kvaReading.id, KvaReadingAction.VIEW_IMAGE, false);
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

    openKvaEditModal(kvaReading: KvaReading | null | undefined): void {
        if (!kvaReading) return;

        this.setActionLoading(kvaReading.id, KvaReadingAction.EDIT, true);

        this.kvaToEdit = kvaReading;
        this.kvaEditVisible = true;

        this.setActionLoading(kvaReading.id, KvaReadingAction.EDIT, false);
    }

    onKvaEditSave(updated: KvaReading): void {
        this.updateKvaReading(updated, KvaReadingAction.EDIT);
    }

    onKvaEditCancel(): void {
        // Optional hook
    }

    updateKvaReading(kvaReading: KvaReading, action: KvaReadingAction = KvaReadingAction.EDIT): void {
        const isCancelling = action === KvaReadingAction.CANCEL;

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

                    if (isCancelling) {
                        this.notificationService.success('Successful', 'KWH reading cancelled successfully');
                    } else {
                        this.notificationService.success('Successful', 'KWH reading updated successfully');
                    }
                },
                error: (err) => {
                    console.log(err);
                }
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

                this.updateKvaReading(updated, KvaReadingAction.CANCEL);
            }
        });
    }

    private applyUpdatedReading(updatedReading: KvaReading): void {
        if (updatedReading.status !== KvaReadingStatus.PENDING) {
            this.kvaReadingsAll = this.removeReadingFromArray(this.kvaReadingsAll, updatedReading.id);
            this.kvaReadings = this.removeReadingFromArray(this.kvaReadings, updatedReading.id);
            this.selectedKvaReadings = this.removeReadingFromArray(this.selectedKvaReadings, updatedReading.id);

            return;
        }

        this.kvaReadingsAll = this.replaceReadingInArray(this.kvaReadingsAll, updatedReading);
        this.kvaReadings = this.replaceReadingInArray(this.kvaReadings, updatedReading);
        this.selectedKvaReadings = this.replaceReadingInArray(this.selectedKvaReadings, updatedReading);
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

    applyFiltersLocal(): void {
        const f = this.filter;

        const kw = (f.keyword ?? '').trim().toLowerCase();
        const subscriberId = f.subscriberId;

        const from = f.createdAtFrom ? this.startOfDay(f.createdAtFrom) : null;
        const to = f.createdAtTo ? this.endOfDay(f.createdAtTo) : null;

        this.kvaReadings = this.kvaReadingsAll.filter((r) => {
            if (subscriberId != null && subscriberId !== 0) {
                if (Number(r.subscriberId) !== Number(subscriberId)) return false;
            }

            if (from || to) {
                const created = r.createdAt ? new Date(r.createdAt as any) : null;
                if (!created) return false;

                if (from && created < from) return false;
                if (to && created > to) return false;
            }

            if (kw) {
                const hay = [r.subscriberFirstName, r.subscriberLastName, r.subscriberPhoneNumber, r.electricMeterNumber, r.kvaReading, r.kvaPrevious, r.kvaCurrent, r.status, r.generatorCode]
                    .map((v) => (v ?? '').toString().toLowerCase())
                    .join(' | ');

                if (!hay.includes(kw)) return false;
            }

            return true;
        });

        this.first = 0;
        this.selectedKvaReadings = [];
    }

    resetFiltersLocal(): void {
        this.filter = {};
        this.applyFiltersLocal();
    }

    private startOfDay(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    }

    private endOfDay(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    }

    private onBillsAccepted(): void {
        if (!this.selectedKvaReadings?.length) return;

        const selectedIds = new Set(this.selectedKvaReadings.map((x) => x.id));

        this.kvaReadingsAll = this.kvaReadingsAll.filter((x) => !selectedIds.has(x.id));

        this.applyFiltersLocal();
    }

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
                disabled: !this.isPending(kvaReading) || this.isActionLoading(id, KvaReadingAction.EDIT),
                data: {
                    severity: 'info',
                    loading: this.isActionLoading(id, KvaReadingAction.EDIT)
                },
                command: () => this.openKvaEditModal(kvaReading)
            },
            {
                label: 'View Image',
                icon: 'pi pi-eye',
                disabled: !kvaReading.kvaReadingUrl || this.isActionLoading(id, KvaReadingAction.VIEW_IMAGE),
                data: {
                    severity: 'secondary',
                    loading: this.isActionLoading(id, KvaReadingAction.VIEW_IMAGE)
                },
                command: () => this.onKvaReadingViewImage(kvaReading)
            },
            {
                label: 'Cancel KWH',
                icon: 'pi pi-times-circle',
                disabled: !this.isPending(kvaReading) || this.isActionLoading(id, KvaReadingAction.CANCEL),
                data: {
                    severity: 'danger',
                    loading: this.isActionLoading(id, KvaReadingAction.CANCEL)
                },
                command: () => this.cancelKvaReading(kvaReading)
            }
        ];
    }

    private isPending(kvaReading: KvaReading | null | undefined): boolean {
        return !!kvaReading && kvaReading.status === KvaReadingStatus.PENDING;
    }

    private key(id: number, action: KvaReadingAction): string {
        return `${id}:${action}`;
    }

    isActionLoading(id: number, action: KvaReadingAction): boolean {
        return !!this.actionLoading[this.key(id, action)];
    }

    setActionLoading(id: number, action: KvaReadingAction, value: boolean): void {
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

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
