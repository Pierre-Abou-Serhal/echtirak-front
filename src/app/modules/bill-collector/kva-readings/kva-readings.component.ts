import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DataView } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { KvaReading } from '@/core/models/model';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KvaReadingStatus } from '@/core/enums/enum';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { LbPhonePipe } from '@/core/pipes/pipes';

@Component({
    selector: 'app-kva-readings.component',
    imports: [Button, IconField, InputIcon, DataView, FormsModule, InputText, Tag, Dialog, InputNumber, DatePipe, Skeleton, DecimalPipe, LbPhonePipe],
    templateUrl: './kva-readings.component.html',
    styleUrl: './kva-readings.component.scss'
})
export class KvaReadingsComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    loading = false;
    saving = false;

    readings: KvaReading[] = [];
    filteredReadings: KvaReading[] = [];

    keyword = '';
    pendingCount = 0;

    // update dialog state
    updateOpen = false;
    selected: KvaReading | null = null;

    editKvaReading: number | null = null;
    imageFile: File | undefined = undefined;
    imagePreviewUrl: string | null = null;
    loadingImagePreview = false;
    private previewObjectUrl: string | null = null; // keep track to revoke

    submitted = false;

    hasExistingImage = false;

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.loading = true;

        this.billCollectorService
            .getKvaReadingPerBilCollector()
            .pipe(
                finalize(() => (this.loading = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.readings = res?.readings ?? [];
                    this.pendingCount = this.readings.filter((r) => r.status === KvaReadingStatus.PENDING).length;
                    this.applyFilter();
                },
                error: (err) => {
                    console.error(err);
                    this.readings = [];
                    this.filteredReadings = [];
                    this.pendingCount = 0;
                }
            });
    }

    onSearch(v: string) {
        this.keyword = (v ?? '').trim();
        this.applyFilter();
    }

    private applyFilter() {
        const q = this.keyword.toLowerCase();

        if (!q) {
            this.filteredReadings = [...this.readings];
            return;
        }

        this.filteredReadings = this.readings.filter((r) => {
            const hay = [r.subscriberFirstName, r.subscriberLastName, r.subscriberPhoneNumber, r.electricMeterNumber, r.generatorCode, String(r.subscriberId), String(r.id)].join(' ').toLowerCase();

            return hay.includes(q);
        });
    }

    openUpdate(r: KvaReading) {
        this.selected = r;
        this.editKvaReading = r.kvaReading ?? null;

        this.submitted = false;
        this.imageFile = undefined;

        this.hasExistingImage = false; // reset
        this.clearPreviewUrl();
        this.imagePreviewUrl = null;

        this.updateOpen = true;

        this.loadExistingReadingImage(r.id);
    }

    private loadExistingReadingImage(recordId: number) {
        this.loadingImagePreview = true;

        this.billCollectorService
            .getKvaReadingImage(recordId)
            .pipe(finalize(() => (this.loadingImagePreview = false)))
            .subscribe({
                next: (blob) => {
                    this.clearPreviewUrl();
                    this.previewObjectUrl = URL.createObjectURL(blob);
                    this.imagePreviewUrl = this.previewObjectUrl;

                    this.hasExistingImage = true;
                },
                error: () => {
                    this.imagePreviewUrl = null;
                    this.hasExistingImage = false;
                }
            });
    }

    private clearPreviewUrl() {
        if (this.previewObjectUrl) {
            URL.revokeObjectURL(this.previewObjectUrl);
            this.previewObjectUrl = null;
        }
    }

    closeUpdate() {
        this.updateOpen = false;
        this.submitted = false;
        this.selected = null;
        this.editKvaReading = null;
        this.imageFile = undefined;

        this.clearPreviewUrl();
        this.imagePreviewUrl = null;
    }

    editKvaReadingValid() {
        return this.editKvaReading !== null && this.editKvaReading !== undefined && this.editKvaReading >= this.selected!.kvaCurrent;
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.imageFile = file;

        this.clearPreviewUrl();
        this.previewObjectUrl = URL.createObjectURL(file);
        this.imagePreviewUrl = this.previewObjectUrl;

        this.hasExistingImage = true;
    }

    clearImage() {
        this.imageFile = undefined;
        if (this.imagePreviewUrl && this.imagePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.imagePreviewUrl);
        }
    }

    submitUpdate() {
        this.submitted = true;

        if (!this.selected || !this.editKvaReadingValid() || !this.isImageValid() || this.saving) return;

        this.saving = true;

        this.billCollectorService
            .upsertKVAReading({
                id: this.selected.id,
                subscriberId: this.selected.subscriberId,
                kvaReading: this.editKvaReading!,
                status: KvaReadingStatus.PENDING, // or keep same status if your backend expects it
                imageFile: this.imageFile
            })
            .pipe(finalize(() => (this.saving = false)))
            .subscribe({
                next: (res) => {
                    const updated = res?.reading;
                    if (updated) {
                        const idx = this.readings.findIndex((x) => x.id === updated.id);
                        if (idx >= 0) this.readings[idx] = updated;
                        this.readings = [...this.readings];
                        this.applyFilter();
                    }

                    this.notificationService.success('Success', 'Reading updated.');
                    this.closeUpdate();
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    getSeverity(status: string) {
        switch (status) {
            case KvaReadingStatus.PENDING:
                return 'success';
            case KvaReadingStatus.BILLED:
                return 'info';
            case KvaReadingStatus.CANCELLED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    isImageValid(): boolean {
        return !!this.imageFile || this.hasExistingImage;
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
