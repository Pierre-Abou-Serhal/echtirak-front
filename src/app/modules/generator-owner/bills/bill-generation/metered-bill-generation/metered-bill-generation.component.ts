import { Component, inject, Input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bill, KvaReading, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GenerateBillsForMeteredSubscribersResponse, GetKVAReadingsPerGeneratorResponse, GetLookupResponse, UpdateKVAReadingResponse } from '@/core/services/api/response';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { KvaReadingStatus, LookupDomain } from '@/core/enums/enum';
import { Tag } from 'primeng/tag';
import { GenerateBillsForMeteredSubscribersRequest, UpdateKVAReadingRequest } from '@/core/services/api/request';
import { NotificationService } from '@/core/services/notification.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize, Subject, Subscription } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { Skeleton } from 'primeng/skeleton';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { provideNgxMask } from 'ngx-mask';
import {
    KvaEditModalComponent
} from '@/modules/generator-owner/kva-reading-history/kva-edit-modal/kva-edit-modal.component';
import { DatePicker } from 'primeng/datepicker';
import { getBillYearMonth } from '@/core/utils/utils';
import { InputNumber } from 'primeng/inputnumber';

export interface KvaReadingLocalFilter {
    keyword?: string;
    subscriberId?: number;
    createdAtFrom?: Date;
    createdAtTo?: Date;
}

@Component({
    selector: 'app-metered-bill-generation',
    imports: [FormsModule, Button, IconField, InputIcon, InputText, TableModule, Tag, DecimalPipe, Dialog, Skeleton, LbPhonePipe, KvaEditModalComponent, DatePicker, DatePipe, InputNumber],
    templateUrl: './metered-bill-generation.component.html',
    styleUrl: './metered-bill-generation.component.scss',
    providers: [provideNgxMask()]
})
export class MeteredBillGenerationComponent implements OnInit, OnDestroy {
    generatorId: number = 0;

    // Input setter. used to change value from parent
    @Input({ alias: 'generatorId', required: true }) set _generatorId(value: number) {
        this.generatorId = value;
        this.loadKvaReadings();
    }

    @Input() acceptBills$!: Subject<void>;
    private sub?: Subscription;

    // Output generated bills from kva readings
    generatedBills = output<Bill[]>();

    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    notificationService: NotificationService = inject(NotificationService);

    kvaReadingsAll: KvaReading[] = [];
    kvaReadings: KvaReading[] = []; // keep your existing binding, but it becomes filtered result

    filter: KvaReadingLocalFilter = {};
    selectedKvaReadings: KvaReading[] = [];
    isKvaReadingLoading = false;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // Edit inside table
    clonedKvaReading: { [id: string]: KvaReading } = {};

    // Update KvaReadings vars
    kvaReadingStatuses: SelectOptionStrValue[] = [];

    isBillsGenerating: boolean = false;

    isKvaImageDialogOpen = false;
    loadingKvaImage = false;

    kvaImageUrl?: SafeUrl;
    private kvaImageObjectUrl?: string;

    private sanitizer = inject(DomSanitizer);

    // modal state
    kvaEditVisible = false;
    kvaToEdit: KvaReading | null = null;

    // per-row loading flags
    editBtnLoading: Record<number, boolean> = {};

    billPeriod: Date | null = null;

    ngOnInit() {
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

        this.sub = this.acceptBills$?.subscribe(() => this.onBillsAccepted());
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    loadKvaReadings() {
        this.isKvaReadingLoading = true;
        this.kvaReadings = [];

        this.generatorOwnerService
            .getKVAReadingsPerGenerator({
                generatorId: this.generatorId
            })
            .subscribe({
                next: (response: GetKVAReadingsPerGeneratorResponse) => {
                    this.kvaReadingsAll = response.readings ?? [];
                    let tempSelectedKvaReadings: KvaReading[] = this.selectedKvaReadings;

                    this.applyFiltersLocal(); // sets this.kvaReadings

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

    // Data table functions
    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    clear(table: Table) {
        table.clear();
    }

    next() {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    isLastPage(): boolean {
        return this.first + this.rows >= this.kvaReadings.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
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

    // Edit inside table functions
    onRowEditInit(kvaReading: KvaReading) {
        // Keep a clone so we can revert on cancel or error
        this.clonedKvaReading[kvaReading.id] = { ...kvaReading };
    }

    updateKvaReading(kvaReading: KvaReading) {

        if (kvaReading.kvaReading <= kvaReading.kvaCurrent) {
            this.notificationService.error('Error', 'KWH reading must be greater than ' + kvaReading.kvaCurrent);

            return;
        }

        this.setEditLoading(kvaReading.id, true);

        let request: UpdateKVAReadingRequest = {
            id: kvaReading.id,
            kvaReading: kvaReading.kvaReading,
            status: kvaReading.status
        };

        this.generatorOwnerService.updateKVAReading(request).subscribe({
            next: (response: UpdateKVAReadingResponse) => {
                this.notificationService.success('Successful', 'KWH reading updated successfully');

                if (response.reading.status === KvaReadingStatus.PENDING) {
                    this.kvaReadings[this.findIndexById(response.reading.id)] = response.reading;
                } else {
                    this.kvaReadings.splice(this.findIndexById(response.reading.id), 1);
                }

                this.setEditLoading(kvaReading.id, false);
            },
            error: (err) => {
                console.log(err);
                this.setEditLoading(kvaReading.id, false);
            }
        });
    }

    generateBills() {
        if (this.selectedKvaReadings.length > 0) {
            const period = getBillYearMonth(this.billPeriod);

            if (!period) {
                this.notificationService.warn('Warning', 'Please select Bill Period (year/month)');
                return;
            }

            if (this.selectedKvaReadings.length === 0) {
                this.notificationService.warn('Warning', 'Please select KWH readings to generate their bills');
                return;
            }

            this.isBillsGenerating = true;

            let request: GenerateBillsForMeteredSubscribersRequest = {
                kvaReadingIds: this.selectedKvaReadings.map((i) => i.id),
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
        } else {
            this.notificationService.warn('Warning', 'Please select KWH readings to generate their bills');
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

    hideKvaImageDialog() {
        this.isKvaImageDialogOpen = false;
        this.loadingKvaImage = false;

        if (this.kvaImageObjectUrl) {
            URL.revokeObjectURL(this.kvaImageObjectUrl);
            this.kvaImageObjectUrl = undefined;
        }
        this.kvaImageUrl = undefined;
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;

    downloadKvaImage() {
        if (!this.kvaImageObjectUrl) return;

        const a = document.createElement('a');
        a.href = this.kvaImageObjectUrl;
        a.download = `kva-reading-${Date.now()}.jpg`;
        a.click();
    }

    // Kva Reading edit modal functions
    openKvaEditModal(kvaReading: KvaReading) {
        this.kvaToEdit = kvaReading;
        this.kvaEditVisible = true;
    }

    onKvaEditSave(updated: KvaReading) {
        // call your existing API method
        this.updateKvaReading(updated);
    }

    onKvaEditCancel() {
        // optional hook
    }

    setEditLoading(id: number, value: boolean) {
        this.editBtnLoading[id] = value;
    }

    applyFiltersLocal(): void {
        const f = this.filter;

        const kw = (f.keyword ?? '').trim().toLowerCase();
        const subscriberId = f.subscriberId;

        // Normalize date boundaries (inclusive)
        const from = f.createdAtFrom ? this.startOfDay(f.createdAtFrom) : null;
        const to = f.createdAtTo ? this.endOfDay(f.createdAtTo) : null;

        this.kvaReadings = this.kvaReadingsAll.filter((r) => {
            // subscriberId
            if (subscriberId != null && subscriberId !== 0) {
                if (Number(r.subscriberId) !== Number(subscriberId)) return false;
            }

            // createdAt range
            if (from || to) {
                const created = r.createdAt ? new Date(r.createdAt as any) : null;
                if (!created) return false;

                if (from && created < from) return false;
                if (to && created > to) return false;
            }

            // keyword (match across similar fields like your globalFilterFields)
            if (kw) {
                const hay = [r.subscriberFirstName, r.subscriberLastName, r.subscriberPhoneNumber, r.electricMeterNumber, r.kvaReading, r.kvaPrevious, r.kvaCurrent, r.status].map((v) => (v ?? '').toString().toLowerCase()).join(' | ');

                if (!hay.includes(kw)) return false;
            }

            return true;
        });

        // Reset table UX
        this.first = 0;

        // Selection should not keep items that disappeared
        this.selectedKvaReadings = [];
    }

    resetFiltersLocal(): void {
        this.filter = {};
        this.applyFiltersLocal();
    }

    // helpers
    private startOfDay(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    }
    private endOfDay(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    }

    private onBillsAccepted() {
        if (!this.selectedKvaReadings?.length) return;

        const selectedIds = new Set(this.selectedKvaReadings.map((x) => x.id));

        this.kvaReadingsAll = this.kvaReadingsAll.filter((x) => !selectedIds.has(x.id));

        this.applyFiltersLocal(); // updates kvaReadings from kvaReadingsAll
    }
}
