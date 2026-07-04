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
import { ImageCompressionService } from '@/core/services/image-compression.service';

@Component({
    selector: 'app-kva-readings.component',
    imports: [Button, IconField, InputIcon, DataView, FormsModule, InputText, Tag, Dialog, InputNumber, DatePipe, Skeleton, DecimalPipe, LbPhonePipe],
    templateUrl: './kva-readings.component.html',
    styleUrl: './kva-readings.component.scss'
})
export class KvaReadingsComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly imageCompressionService = inject(ImageCompressionService);
    private readonly destroyRef = inject(DestroyRef);

    loading = false;
    saving = false;
    compressingImage = false;

    readings: KvaReading[] = [];
    filteredReadings: KvaReading[] = [];

    keyword = '';
    pendingCount = 0;
    skeletonItems = [1, 2, 3];

    updateOpen = false;
    selected: KvaReading | null = null;

    editKvaReading: number | null = null;

    imageFile: File | undefined = undefined;
    imagePreviewUrl: string | null = null;
    loadingImagePreview = false;

    private previewObjectUrl: string | null = null;

    submitted = false;
    hasExistingImage = false;

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
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

    onSearch(v: string): void {
        this.keyword = (v ?? '').trim();
        this.applyFilter();
    }

    private applyFilter(): void {
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

    openUpdate(r: KvaReading): void {
        this.selected = r;
        this.editKvaReading = r.kvaReading ?? null;

        this.submitted = false;
        this.imageFile = undefined;
        this.compressingImage = false;

        this.hasExistingImage = false;
        this.clearPreviewUrl();
        this.imagePreviewUrl = null;
        this.loadingImagePreview = false;

        this.updateOpen = true;

        if (this.hasKvaReadingImage(r)) {
            this.loadExistingReadingImage(r.id);
        }
    }

    private hasKvaReadingImage(reading: KvaReading): boolean {
        const item = reading as KvaReading & {
            kvaReadingUrl?: string | null;
        };

        return !!item.kvaReadingUrl?.trim();
    }

    private loadExistingReadingImage(recordId: number): void {
        this.loadingImagePreview = true;

        this.billCollectorService
            .getKvaReadingImage(recordId)
            .pipe(
                finalize(() => (this.loadingImagePreview = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (blob) => {
                    if (!this.selected || this.selected.id !== recordId) {
                        return;
                    }

                    this.clearPreviewUrl();

                    if (!blob || blob.size === 0) {
                        this.imagePreviewUrl = null;
                        this.hasExistingImage = false;
                        return;
                    }

                    this.previewObjectUrl = URL.createObjectURL(blob);
                    this.imagePreviewUrl = this.previewObjectUrl;

                    this.hasExistingImage = true;
                },
                error: () => {
                    this.clearPreviewUrl();
                    this.imagePreviewUrl = null;
                    this.hasExistingImage = false;
                }
            });
    }

    private clearPreviewUrl(): void {
        if (this.previewObjectUrl) {
            URL.revokeObjectURL(this.previewObjectUrl);
            this.previewObjectUrl = null;
        }
    }

    closeUpdate(): void {
        this.updateOpen = false;
        this.submitted = false;
        this.selected = null;
        this.editKvaReading = null;
        this.imageFile = undefined;
        this.compressingImage = false;
        this.loadingImagePreview = false;

        this.clearPreviewUrl();
        this.imagePreviewUrl = null;
        this.hasExistingImage = false;
    }

    editKvaReadingValid(): boolean {
        if (!this.selected) return false;

        return this.editKvaReading !== null && this.editKvaReading !== undefined && this.editKvaReading >= this.selected.kvaCurrent;
    }

    async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.notificationService.warn('Invalid File', 'Please select a valid image.');
            input.value = '';
            return;
        }

        this.compressingImage = true;

        try {
            const compressedFile = await this.imageCompressionService.compressImageToTargetSize(file, 400);

            this.imageFile = compressedFile;

            this.clearPreviewUrl();

            this.previewObjectUrl = URL.createObjectURL(compressedFile);
            this.imagePreviewUrl = this.previewObjectUrl;

            this.hasExistingImage = true;
        } catch (error) {
            console.error(error);

            this.notificationService.warn('Compression Failed', 'Failed to compress the image. Please try another image.');

            input.value = '';
            this.imageFile = undefined;

            this.clearPreviewUrl();
            this.imagePreviewUrl = null;
            this.hasExistingImage = false;
        } finally {
            this.compressingImage = false;
        }
    }

    clearImage(): void {
        this.imageFile = undefined;

        this.clearPreviewUrl();

        this.imagePreviewUrl = null;
        this.hasExistingImage = false;
        this.loadingImagePreview = false;
    }

    submitUpdate(): void {
        this.submitted = true;

        if (!this.selected || !this.editKvaReadingValid() || this.saving || this.compressingImage) {
            return;
        }

        this.saving = true;

        this.billCollectorService
            .upsertKVAReading({
                id: this.selected.id,
                subscriberId: this.selected.subscriberId,
                kvaReading: this.editKvaReading!,
                status: KvaReadingStatus.PENDING,
                imageFile: this.imageFile
            })
            .pipe(
                finalize(() => (this.saving = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    const updated = res?.reading;

                    if (updated) {
                        const idx = this.readings.findIndex((x) => x.id === updated.id);

                        if (idx >= 0) {
                            this.readings[idx] = updated;
                        }

                        this.readings = [...this.readings];
                        this.pendingCount = this.readings.filter((r) => r.status === KvaReadingStatus.PENDING).length;
                        this.applyFilter();
                    }

                    this.notificationService.success('Success', 'Reading updated.');
                    this.closeUpdate();
                },
                error: (err) => {
                    console.error(err);

                    this.notificationService.warn('Failure', 'Failed to update reading. Please try again.');
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

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
