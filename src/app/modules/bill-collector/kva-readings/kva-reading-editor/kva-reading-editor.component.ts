import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { ImageCompressionService } from '@/core/services/image-compression.service';
import { AuthService } from '@/core/services/auth.service';
import { BillCollectorBillingPeriod, BillCollectorBillingPeriodService } from '@/core/services/bill-collector-billing-period.service';

import { KvaReading, Subscriber } from '@/core/models/model';
import { GetSubscribersResponse, UpsertKVAReadingResponse } from '@/core/services/api/response';
import { KvaReadingStatus } from '@/core/enums/enum';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { formatSubscriberAddress } from '@/core/utils/utils';
import { UpsertKvaReadingResult } from '@/core/dtos/dto';
import { BillingPeriodDialogComponent } from '@/modules/bill-collector/billing-period-dialog/billing-period-dialog.component';

type EditorMode = 'add' | 'update';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface KvaReadingEditorDetails {
    mode: EditorMode;
    readingId: number;
    subscriberId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    generatorCode: string;
    electricMeterNumber: string;
    previousKva: number;
    currentKva: number;
    address: string;
    status: string | null;
}

@Component({
    selector: 'app-kva-reading-editor',
    standalone: true,
    imports: [FormsModule, DecimalPipe, Button, InputNumber, Skeleton, Tag, LbPhonePipe, DynamicDialogModule],
    templateUrl: './kva-reading-editor.component.html',
    providers: [DialogService]
})
export class KvaReadingEditorComponent implements OnChanges, OnDestroy {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly imageCompressionService = inject(ImageCompressionService);
    private readonly authService = inject(AuthService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dialogService = inject(DialogService);

    readonly billingPeriodService = inject(BillCollectorBillingPeriodService);

    /**
     * Required for both add and update modes.
     */
    @Input({ required: true }) subscriberId!: number;

    /**
     * Pass a positive reading ID to update an existing reading.
     * Leave null or undefined to create a new reading.
     */
    @Input() readingId: number | null | undefined = null;

    /**
     * Pass the reading when the parent already has it.
     * This avoids loading the complete readings list again.
     */
    @Input() reading: KvaReading | null = null;

    /**
     * Optional billing period supplied by a parent such as Pending Work.
     */
    @Input() billYear: string | null = null;
    @Input() billMonth: string | null = null;

    /**
     * When true, the billing period is displayed but cannot be changed here.
     */
    @Input() billingPeriodLocked = false;

    @Input() showCancel = true;
    @Input() stickyActions = false;

    @Output() saved = new EventEmitter<UpsertKvaReadingResult>();
    @Output() cancelled = new EventEmitter<void>();

    /**
     * Async emission avoids changing a parent dialog binding during the
     * same Angular change-detection pass.
     */
    @Output() busyChange = new EventEmitter<boolean>(true);

    readonly autoBillOnReading = this.authService.autoBillOnReading;

    details: KvaReadingEditorDetails | null = null;

    kvaReading: number | null = null;

    loading = false;
    saving = false;
    submitted = false;

    compressingImage = false;
    loadingImagePreview = false;

    imageFile: File | null = null;
    imagePreviewUrl: string | null = null;
    hasExistingImage = false;

    subscriberDetailsExpanded = false;

    private previewObjectUrl: string | null = null;
    private detailsRequest?: Subscription;
    private imageRequest?: Subscription;
    private billingPeriodDialogRef?: DynamicDialogRef;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['subscriberId'] || changes['readingId'] || changes['reading']) {
            this.initializeEditor();
        }
    }

    ngOnDestroy(): void {
        this.detailsRequest?.unsubscribe();
        this.imageRequest?.unsubscribe();
        this.billingPeriodDialogRef?.close();
        this.clearPreviewObjectUrl();
    }

    get mode(): EditorMode {
        return this.details?.mode ?? this.requestedMode;
    }

    get requestedMode(): EditorMode {
        return this.reading || this.validReadingId !== null ? 'update' : 'add';
    }

    get title(): string {
        return this.mode === 'update' ? 'Update KWH Reading' : 'Add KWH Reading';
    }

    get submitLabel(): string {
        return this.mode === 'update' ? 'Save Changes' : 'Add Reading';
    }

    get busy(): boolean {
        return this.loading || this.saving || this.compressingImage;
    }

    get hasKvaReadingValue(): boolean {
        return this.kvaReading !== null && this.kvaReading !== undefined && Number.isFinite(this.kvaReading);
    }

    get isKvaReadingBelowMinimum(): boolean {
        if (!this.details || !this.hasKvaReadingValue) {
            return false;
        }

        return this.kvaReading! < this.details.currentKva;
    }

    get effectiveBillingPeriod(): BillCollectorBillingPeriod | null {
        if (this.billYear?.trim() && this.billMonth?.trim()) {
            return {
                billYear: this.billYear.trim(),
                billMonth: this.billMonth.trim().padStart(2, '0')
            };
        }

        return this.billingPeriodService.getSnapshot();
    }

    get hasExplicitBillingPeriod(): boolean {
        return !!(this.billYear?.trim() && this.billMonth?.trim());
    }

    get effectiveBillingPeriodLabel(): string {
        const period = this.effectiveBillingPeriod;

        if (!period) {
            return 'Not selected';
        }

        return `${period.billYear}/${String(period.billMonth).padStart(2, '0')}`;
    }

    get isEffectiveBillingPeriodCurrentMonth(): boolean {
        const period = this.effectiveBillingPeriod;

        if (!period) {
            return false;
        }

        const today = new Date();

        return Number(period.billYear) === today.getFullYear() && Number(period.billMonth) === today.getMonth() + 1;
    }

    get billingPeriodNeedsAttention(): boolean {
        return !this.effectiveBillingPeriod || !this.isEffectiveBillingPeriodCurrentMonth;
    }

    /**
     * All period states use the same primary color palette.
     * The icon communicates the state without changing colors.
     */
    get billingPeriodStateIcon(): string {
        if (this.billingPeriodNeedsAttention) {
            return 'pi pi-exclamation-circle';
        }

        if (this.billingPeriodLocked) {
            return 'pi pi-lock';
        }

        return 'pi pi-check-circle';
    }

    get billingPeriodStatusLabel(): string {
        const period = this.effectiveBillingPeriod;

        if (!period) {
            return 'Select before saving';
        }

        if (!this.isEffectiveBillingPeriodCurrentMonth) {
            return 'Verify before saving';
        }

        if (this.billingPeriodLocked) {
            return 'Bill generated on save';
        }

        return 'Bill generated on save';
    }

    get billingPeriodActionLabel(): string {
        return this.effectiveBillingPeriod ? '' : 'Set';
    }

    private get validReadingId(): number | null {
        const value = Number(this.readingId);

        return Number.isFinite(value) && value > 0 ? value : null;
    }

    private initializeEditor(): void {
        this.detailsRequest?.unsubscribe();
        this.imageRequest?.unsubscribe();

        this.resetEditorState();

        if (!Number.isFinite(this.subscriberId) || this.subscriberId <= 0) {
            this.notificationService.error('Invalid Subscriber', 'A valid subscriber is required.');
            return;
        }

        if (this.reading) {
            this.initializeFromReading(this.reading);
            return;
        }

        if (this.validReadingId !== null) {
            this.loadReading(this.validReadingId);
            return;
        }

        this.loadSubscriber();
    }

    private loadSubscriber(): void {
        this.setLoading(true);

        this.detailsRequest = this.billCollectorService
            .getSubs({
                pageNumber: 1,
                pageSize: 1,
                subscriberId: this.subscriberId
            })
            .pipe(
                finalize(() => this.setLoading(false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GetSubscribersResponse) => {
                    const subscriber = response?.page?.items?.[0];

                    if (!subscriber) {
                        this.notificationService.error('Subscriber Not Found', 'The subscriber details could not be loaded.');
                        return;
                    }

                    this.initializeFromSubscriber(subscriber);
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.error('Loading Failed', 'Failed to load the subscriber details.');
                }
            });
    }

    private loadReading(readingId: number): void {
        this.setLoading(true);

        this.detailsRequest = this.billCollectorService
            .getKvaReadingPerBilCollector()
            .pipe(
                finalize(() => this.setLoading(false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    const reading = (response?.readings ?? []).find((item: KvaReading) => item.id === readingId);

                    if (!reading) {
                        this.notificationService.error('Reading Not Found', 'The pending reading could not be loaded.');
                        return;
                    }

                    this.initializeFromReading(reading);
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.error('Loading Failed', 'Failed to load the pending reading.');
                }
            });
    }

    private initializeFromSubscriber(subscriber: Subscriber): void {
        this.details = {
            mode: 'add',
            readingId: -1,
            subscriberId: this.subscriberId,
            firstName: subscriber.firstName,
            lastName: subscriber.lastName,
            phoneNumber: subscriber.phoneNumber,
            generatorCode: subscriber.generatorCode ?? '',
            electricMeterNumber: subscriber.electricMeterNumber ?? '',
            previousKva: subscriber.previousKva ?? 0,
            currentKva: subscriber.currentKva ?? 0,
            address: subscriber.address ? formatSubscriberAddress(subscriber.address) : 'Address not available',
            status: null
        };

        this.kvaReading = null;
    }

    private initializeFromReading(reading: KvaReading): void {
        this.details = {
            mode: 'update',
            readingId: reading.id,
            subscriberId: reading.subscriberId,
            firstName: reading.subscriberFirstName,
            lastName: reading.subscriberLastName,
            phoneNumber: reading.subscriberPhoneNumber,
            generatorCode: reading.generatorCode,
            electricMeterNumber: reading.electricMeterNumber,
            previousKva: reading.kvaPrevious ?? 0,
            currentKva: reading.kvaCurrent ?? 0,
            address: this.formatReadingAddress(reading),
            status: reading.status
        };

        this.kvaReading = reading.kvaReading ?? null;

        if (reading.kvaReadingUrl?.trim()) {
            this.hasExistingImage = true;
            this.loadExistingImage(reading.id);
        }
    }

    private formatReadingAddress(reading: KvaReading): string {
        if (reading.address) {
            return formatSubscriberAddress(reading.address);
        }

        const parts = [reading.addressStreet, reading.addressBuilding ? `Building ${reading.addressBuilding}` : '', reading.addressFloor ? `Floor ${reading.addressFloor}` : '', reading.addressCity, reading.addressCountry].filter(
            (value) => !!value?.trim()
        );

        return parts.length ? parts.join(', ') : 'Address not available';
    }

    private loadExistingImage(readingId: number): void {
        this.loadingImagePreview = true;

        this.imageRequest = this.billCollectorService
            .getKvaReadingImage(readingId)
            .pipe(
                finalize(() => {
                    this.loadingImagePreview = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (blob) => {
                    if (!blob || blob.size === 0) {
                        this.hasExistingImage = false;
                        return;
                    }

                    this.setPreviewFromBlob(blob);
                    this.hasExistingImage = true;
                },
                error: () => {
                    this.hasExistingImage = false;
                    this.clearPreviewObjectUrl();
                    this.imagePreviewUrl = null;
                }
            });
    }

    selectReadingValue(event: Event): void {
        const input = event.target as HTMLInputElement;

        requestAnimationFrame(() => {
            input.select();
        });
    }

    async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.notificationService.error('Invalid File', 'Please select a valid image.');

            input.value = '';
            return;
        }

        this.setCompressing(true);

        try {
            const compressedFile = await this.imageCompressionService.compressImageToTargetSize(file, 400);

            this.imageFile = compressedFile;
            this.setPreviewFromBlob(compressedFile);
            this.hasExistingImage = true;
        } catch (error) {
            console.error(error);

            this.notificationService.error('Compression Failed', 'Failed to compress the image. Please try another image.');

            input.value = '';
        } finally {
            this.setCompressing(false);
        }
    }

    clearImage(): void {
        this.imageFile = null;
        this.hasExistingImage = false;
        this.loadingImagePreview = false;

        this.clearPreviewObjectUrl();
        this.imagePreviewUrl = null;
    }

    toggleSubscriberDetails(): void {
        this.subscriberDetailsExpanded = !this.subscriberDetailsExpanded;
    }

    isKvaReadingValid(): boolean {
        if (!this.details || !this.hasKvaReadingValue) {
            return false;
        }

        return this.kvaReading! >= this.details.currentKva;
    }

    submit(): void {
        this.submitted = true;

        if (!this.details || !this.isKvaReadingValid() || this.busy) {
            return;
        }

        const requiresBillingPeriod = this.autoBillOnReading() && this.mode === 'add';

        const billingPeriod = requiresBillingPeriod ? this.effectiveBillingPeriod : null;

        if (requiresBillingPeriod && !billingPeriod) {
            this.notificationService.warn('Billing Period Required', 'Select the billing month before saving the reading.');

            this.openBillingPeriodDialog();
            return;
        }

        this.setSaving(true);

        this.billCollectorService
            .upsertKVAReading({
                id: this.details.readingId,
                subscriberId: this.details.subscriberId,
                kvaReading: this.kvaReading!,
                status: KvaReadingStatus.PENDING,
                imageFile: this.imageFile,

                // Billing period is sent only when adding a reading
                // with automatic billing enabled.
                billYear: requiresBillingPeriod ? billingPeriod!.billYear : undefined,
                billMonth: requiresBillingPeriod ? billingPeriod!.billMonth : undefined
            })
            .pipe(
                finalize(() => this.setSaving(false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: UpsertKVAReadingResponse) => {
                    this.saved.emit(response.result);
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.error('Save Failed', 'Failed to save the KWH reading. Please try again.');
                }
            });
    }

    cancel(): void {
        if (this.busy) {
            return;
        }

        this.cancelled.emit();
    }

    openBillingPeriodDialog(): void {
        if (this.billingPeriodLocked) {
            return;
        }

        /*
         * Prevent repeated taps from opening multiple dialogs.
         */
        this.billingPeriodDialogRef?.close();

        const dialogRef = this.dialogService.open(BillingPeriodDialogComponent, {
            header: 'Billing Period',
            modal: true,
            closable: true,
            draggable: false,
            resizable: false,
            dismissableMask: false,
            width: '95vw',
            style: {
                maxWidth: '460px'
            },
            breakpoints: {
                '640px': '95vw'
            },
            contentStyle: {
                overflow: 'visible'
            }
        });

        this.billingPeriodDialogRef = dialogRef;

        dialogRef.onClose.pipe(take(1)).subscribe(() => {
            if (this.billingPeriodDialogRef === dialogRef) {
                this.billingPeriodDialogRef = undefined;
            }
        });
    }

    formatStatus(status: string | null | undefined): string {
        if (!status) {
            return 'Unknown';
        }

        return status
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    getStatusSeverity(status: string | null | undefined): TagSeverity {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'warn';

            case 'BILLED':
                return 'info';

            case 'PAID':
                return 'success';

            case 'CANCELLED':
                return 'danger';

            default:
                return 'secondary';
        }
    }

    private setPreviewFromBlob(blob: Blob): void {
        this.clearPreviewObjectUrl();

        this.previewObjectUrl = URL.createObjectURL(blob);

        this.imagePreviewUrl = this.previewObjectUrl;
    }

    private clearPreviewObjectUrl(): void {
        if (!this.previewObjectUrl) {
            return;
        }

        URL.revokeObjectURL(this.previewObjectUrl);

        this.previewObjectUrl = null;
    }

    private resetEditorState(): void {
        this.details = null;
        this.kvaReading = null;

        this.loading = false;
        this.saving = false;
        this.submitted = false;

        this.compressingImage = false;
        this.loadingImagePreview = false;

        this.imageFile = null;
        this.hasExistingImage = false;

        this.subscriberDetailsExpanded = false;

        this.clearPreviewObjectUrl();
        this.imagePreviewUrl = null;

        this.emitBusyState();
    }

    private setLoading(value: boolean): void {
        this.loading = value;
        this.emitBusyState();
    }

    private setSaving(value: boolean): void {
        this.saving = value;
        this.emitBusyState();
    }

    private setCompressing(value: boolean): void {
        this.compressingImage = value;
        this.emitBusyState();
    }

    private emitBusyState(): void {
        this.busyChange.emit(this.busy);
    }
}
