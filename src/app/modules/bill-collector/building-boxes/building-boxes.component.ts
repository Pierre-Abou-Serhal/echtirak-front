import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, take } from 'rxjs';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';

import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { ImageCompressionService } from '@/core/services/image-compression.service';

import { BuildingBox, Subscriber } from '@/core/models/model';
import { BulkKvaReadingResponse, BulkKvaReadingResult, GetSubscribersByBuildingBoxTokenResponse, UpdateSubscriberBuildingBoxOrderResponse } from '@/core/services/api/response';
import { BulkKvaReadingRequest, UpdateSubscriberBuildingBoxOrderRequest } from '@/core/services/api/request';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { FloatLabel } from 'primeng/floatlabel';
import { PrimeTemplate } from 'primeng/api';
import { AuthService } from '@/core/services/auth.service';
import { BillCollectorBillingPeriodService } from '@/core/services/bill-collector-billing-period.service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
    BillingPeriodDialogComponent
} from '@/modules/bill-collector/billing-period-dialog/billing-period-dialog.component';

interface BillCollectorBoxReadingVm {
    subscriber: Subscriber;
    reading: number | null;
    picture?: File | null;
    picturePreviewUrl?: string | null;
    error?: string | null;
    result?: BulkKvaReadingResult | null;
    touched: boolean;
}

type PhotoMode = 'SHARED' | 'PER_METER';
type RowVisualState = 'empty' | 'active' | 'ready' | 'error' | 'saved' | 'failed';

@Component({
    selector: 'app-building-boxes.component',
    standalone: true,
    imports: [CommonModule, FormsModule, Button, InputText, SelectButton, Tag, Skeleton, Dialog, InputNumber, LbPhonePipe, FloatLabel, PrimeTemplate, DynamicDialogModule],
    templateUrl: './building-boxes.component.html',
    styleUrl: './building-boxes.component.scss',
    providers: [DialogService]
})
export class BuildingBoxesComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly imageCompressionService = inject(ImageCompressionService);
    private readonly authService = inject(AuthService);
    readonly billingPeriodService = inject(BillCollectorBillingPeriodService);

    readonly maxReading = 999999999;

    token = '';

    box?: BuildingBox;
    rows: BillCollectorBoxReadingVm[] = [];

    loading = false;
    submitting = false;
    savingOrder = false;

    keyword = '';
    reorderMode = false;
    orderDirty = false;

    photoMode: PhotoMode = 'SHARED';

    photoModeOptions = [
        { label: '1 Photo', value: 'SHARED' },
        { label: 'Each', value: 'PER_METER' }
    ];

    sharedImageFile?: File | null = null;
    sharedImagePreviewUrl?: string | null = null;

    bulkResponse?: BulkKvaReadingResponse | null = null;

    compressingSharedImage = false;
    compressingRowImageSubscriberId: number | null = null;

    activeSubscriberId: number | null = null;
    selectedSwapIndex: number | null = null;

    previewDialogVisible = false;
    previewImageUrl: string | null = null;
    previewImageTitle = '';

    private readonly dialogService = inject(DialogService);

    private billingPeriodDialogRef?: DynamicDialogRef;

    readonly autoBillOnReading = this.authService.autoBillOnReading;

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') ?? '';

        if (!this.token) {
            this.notificationService.error('Error', 'Building box token is missing.');
            return;
        }

        this.loadBox();
    }

    ngOnDestroy(): void {
        this.revokeSharedPreview();
        this.revokeAllRowPreviews();
        this.billingPeriodDialogRef?.close();
    }

    get filteredRows(): BillCollectorBoxReadingVm[] {
        const q = this.keyword.trim().toLowerCase();

        if (!q) return this.rows;

        return this.rows.filter((row) => {
            const subscriber = row.subscriber;
            const fullName = `${subscriber.firstName ?? ''} ${subscriber.lastName ?? ''}`.toLowerCase();

            return (
                fullName.includes(q) ||
                String(subscriber.phoneNumber ?? '')
                    .toLowerCase()
                    .includes(q) ||
                String(subscriber.electricMeterNumber ?? '')
                    .toLowerCase()
                    .includes(q)
            );
        });
    }

    get readyRowsCount(): number {
        return this.rows.filter((row) => this.isRowReadyForSubmit(row)).length;
    }

    get invalidTouchedRowsCount(): number {
        return this.rows.filter((row) => row.touched && !!this.getRowValidationError(row)).length;
    }

    get successCount(): number {
        return this.bulkResponse?.successCount ?? 0;
    }

    get failureCount(): number {
        return this.bulkResponse?.failureCount ?? 0;
    }

    get canReorder(): boolean {
        return this.reorderMode && !this.loading && !this.savingOrder;
    }

    loadBox(): void {
        this.loading = true;
        this.bulkResponse = null;
        this.orderDirty = false;
        this.selectedSwapIndex = null;

        this.revokeAllRowPreviews();

        this.billCollectorService
            .getSubscribersByBuildingBoxToken(this.token)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response: GetSubscribersByBuildingBoxTokenResponse) => {
                    this.box = response.box;

                    const subscribers = this.sortSubscribers(response.subscribers ?? []);

                    this.rows = subscribers.map((subscriber) => ({
                        subscriber,
                        reading: subscriber.pendingKvaReading ?? null,
                        picture: null,
                        picturePreviewUrl: null,
                        error: null,
                        result: null,
                        touched: subscriber.pendingKvaReading !== null && subscriber.pendingKvaReading !== undefined
                    }));

                    this.rows.forEach((row) => this.validateRow(row));
                },
                error: () => {
                    this.box = undefined;
                    this.rows = [];
                    this.notificationService.error('Error', 'Failed to load building box.');
                }
            });
    }

    toggleReorderMode(): void {
        this.reorderMode = !this.reorderMode;
        this.selectedSwapIndex = null;

        if (this.reorderMode) {
            this.keyword = '';
            this.activeSubscriberId = null;
        }
    }

    onReorderTileTap(index: number): void {
        if (!this.canReorder) return;

        if (this.selectedSwapIndex === null) {
            this.selectedSwapIndex = index;
            return;
        }

        if (this.selectedSwapIndex === index) {
            this.selectedSwapIndex = null;
            return;
        }

        this.swapRows(this.selectedSwapIndex, index);
        this.selectedSwapIndex = null;

        this.normalizeSortOrder();
        this.orderDirty = true;
    }

    saveOrder(): void {
        if (!this.orderDirty) return;

        const request: UpdateSubscriberBuildingBoxOrderRequest = {
            items: this.rows.map((row, index) => ({
                subscriberId: row.subscriber.id,
                sortOrder: index + 1
            }))
        };

        this.savingOrder = true;

        this.billCollectorService
            .updateSubscriberBuildingBoxOrder(this.token, request)
            .pipe(finalize(() => (this.savingOrder = false)))
            .subscribe({
                next: (response: UpdateSubscriberBuildingBoxOrderResponse) => {
                    this.applySubscriberOrderResponse(response.subscribers ?? []);
                    this.orderDirty = false;
                    this.reorderMode = false;
                    this.selectedSwapIndex = null;

                    this.notificationService.success('Order Updated', `${response.updatedCount} subscriber(s) updated.`);
                },
                error: () => {
                    this.notificationService.error('Error', 'Failed to save box order.');
                }
            });
    }

    resetOrder(): void {
        this.loadBox();
    }

    onReadingChanged(row: BillCollectorBoxReadingVm): void {
        row.touched = true;
        row.result = null;
        this.validateRow(row);
    }

    markRowTouched(row: BillCollectorBoxReadingVm): void {
        row.touched = true;
        this.activeSubscriberId = row.subscriber.id;
        this.validateRow(row);
    }

    blurRow(row: BillCollectorBoxReadingVm): void {
        this.activeSubscriberId = null;
        this.validateRow(row);
    }

    onPhotoModeChanged(): void {
        this.bulkResponse = null;

        this.rows.forEach((row) => {
            row.result = null;
            this.validateRow(row);
        });
    }

    async onSharedImageSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.notificationService.error('Invalid file', 'Please select an image.');
            input.value = '';
            return;
        }

        this.compressingSharedImage = true;

        try {
            const compressedFile = await this.imageCompressionService.compressImageToTargetSize(file, 400);

            this.revokeSharedPreview();

            this.sharedImageFile = compressedFile;
            this.sharedImagePreviewUrl = URL.createObjectURL(compressedFile);
        } catch (error) {
            console.error(error);

            this.notificationService.error('Compression Failed', 'Failed to compress the image. Please try another image.');

            this.sharedImageFile = null;
            this.revokeSharedPreview();
        } finally {
            this.compressingSharedImage = false;
            input.value = '';
        }
    }

    clearSharedImage(): void {
        this.sharedImageFile = null;
        this.revokeSharedPreview();
    }

    async onRowImageSelected(row: BillCollectorBoxReadingVm, event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.notificationService.error('Invalid file', 'Please select an image.');
            input.value = '';
            return;
        }

        this.compressingRowImageSubscriberId = row.subscriber.id;

        try {
            const compressedFile = await this.imageCompressionService.compressImageToTargetSize(file, 400);

            if (row.picturePreviewUrl) {
                URL.revokeObjectURL(row.picturePreviewUrl);
            }

            row.picture = compressedFile;
            row.picturePreviewUrl = URL.createObjectURL(compressedFile);
            row.result = null;
            row.touched = true;

            this.validateRow(row);
        } catch (error) {
            console.error(error);

            this.notificationService.error('Compression Failed', 'Failed to compress the image. Please try another image.');

            if (row.picturePreviewUrl) {
                URL.revokeObjectURL(row.picturePreviewUrl);
            }

            row.picture = null;
            row.picturePreviewUrl = null;

            this.validateRow(row);
        } finally {
            this.compressingRowImageSubscriberId = null;
            input.value = '';
        }
    }

    clearRowImage(row: BillCollectorBoxReadingVm): void {
        if (row.picturePreviewUrl) {
            URL.revokeObjectURL(row.picturePreviewUrl);
        }

        row.picture = null;
        row.picturePreviewUrl = null;
        row.touched = true;

        this.validateRow(row);
    }

    openImagePreview(url: string | null | undefined, title: string): void {
        if (!url) {
            this.notificationService.warn('No Photo', 'No photo was taken yet.');
            return;
        }

        this.previewImageUrl = url;
        this.previewImageTitle = title;
        this.previewDialogVisible = true;
    }

    closeImagePreview(): void {
        this.previewDialogVisible = false;
        this.previewImageUrl = null;
        this.previewImageTitle = '';
    }

    submitReadings(): void {
        const billingPeriod = this.autoBillOnReading() ? this.billingPeriodService.getSnapshot() : null;

        if (this.autoBillOnReading() && !billingPeriod) {
            this.notificationService.warn('Billing Period Required', 'Select the billing month before submitting readings.');

            this.openBillingPeriodDialog();
            return;
        }

        if (this.loading) {
            this.notificationService.warn('Loading', 'Please wait until the box is loaded.');
            return;
        }

        if (this.submitting) return;

        if (this.compressingSharedImage || this.compressingRowImageSubscriberId !== null) {
            this.notificationService.warn('Please Wait', 'Photo compression is still running.');
            return;
        }

        this.bulkResponse = null;

        const rowsToValidate = this.rows.filter((row) => this.hasReading(row) || this.hasRowPicture(row));

        rowsToValidate.forEach((row) => {
            row.touched = true;
            this.validateRow(row);
        });

        const invalidRows = rowsToValidate.filter((row) => !!this.getRowValidationError(row));

        if (invalidRows.length > 0) {
            this.notificationService.warn('Invalid Readings', 'Fix the red highlighted meters.');
            return;
        }

        const rowsToSubmit = rowsToValidate.filter((row) => this.hasReading(row));

        if (rowsToSubmit.length === 0) {
            this.notificationService.warn('No Readings', 'Enter at least one reading.');
            return;
        }

        const request: BulkKvaReadingRequest = {
            boxImage: this.photoMode === 'SHARED',
            boxImageFile: this.photoMode === 'SHARED' ? this.sharedImageFile : null,
            billYear: billingPeriod?.billYear,
            billMonth: billingPeriod?.billMonth,
            kvaReadings: rowsToSubmit.map((row) => ({
                subscriberId: row.subscriber.id,
                reading: Number(row.reading),
                picture: this.photoMode === 'PER_METER' ? (row.picture ?? null) : null
            }))
        };
        this.submitting = true;

        this.billCollectorService
            .bulkKvaReadings(this.token, request)
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe({
                next: (response: BulkKvaReadingResponse) => {
                    this.bulkResponse = response;
                    this.applyBulkResults(response);

                    if (response.failureCount > 0) {
                        this.notificationService.warn('Partially Submitted', `${response.successCount} OK, ${response.failureCount} failed.`);
                    } else {
                        this.notificationService.success('Submitted', `${response.successCount} reading(s) submitted.`);
                    }
                },
                error: () => {
                    this.notificationService.error('Error', 'Failed to submit readings.');
                }
            });
    }

    hasReading(row: BillCollectorBoxReadingVm): boolean {
        return row.reading !== null && row.reading !== undefined && String(row.reading).trim() !== '';
    }

    isRowReadyForSubmit(row: BillCollectorBoxReadingVm): boolean {
        return this.hasReading(row) && !this.getRowValidationError(row);
    }

    getRowState(row: BillCollectorBoxReadingVm): RowVisualState {
        const result = this.getResultForSubscriber(row.subscriber.id);

        if (result?.success) return 'saved';
        if (result && !result.success) return 'failed';

        if (this.activeSubscriberId === row.subscriber.id) {
            return 'active';
        }

        const error = this.getRowValidationError(row);

        if (error) return 'error';

        if (this.isRowReadyForSubmit(row)) return 'ready';

        return 'empty';
    }

    getRowIcon(row: BillCollectorBoxReadingVm): string {
        const state = this.getRowState(row);

        switch (state) {
            case 'ready':
                return 'pi pi-check';
            case 'error':
            case 'failed':
                return 'pi pi-exclamation-triangle';
            case 'saved':
                return 'pi pi-check-circle';
            case 'active':
                return 'pi pi-pencil';
            default:
                return 'pi pi-bolt';
        }
    }

    getMinAllowedReading(row: BillCollectorBoxReadingVm): number {
        return Number(row.subscriber.currentKva ?? row.subscriber.previousKva ?? 0);
    }

    // getCompactName(subscriber: Subscriber): string {
    //     const first = subscriber.firstName?.trim() ?? '';
    //     const last = subscriber.lastName?.trim() ?? '';
    //
    //     if (first && last) return `${first} ${last.charAt(0)}.`;
    //     if (first) return first;
    //     if (last) return last;
    //
    //     return `#${subscriber.id}`;
    // }

    getSubscriberName(subscriber: Subscriber): string {
        const name = `${subscriber.firstName ?? ''} ${subscriber.lastName ?? ''}`.trim();

        return name || `Subscriber #${subscriber.id}`;
    }

    getResultForSubscriber(subscriberId: number): BulkKvaReadingResult | null {
        return this.bulkResponse?.results?.find((result) => result.subscriberId === subscriberId) ?? null;
    }

    private hasRowPicture(row: BillCollectorBoxReadingVm): boolean {
        return this.photoMode === 'PER_METER' && !!row.picture;
    }

    private getRowValidationError(row: BillCollectorBoxReadingVm): string | null {
        if (!this.hasReading(row)) {
            return this.hasRowPicture(row) ? 'Missing reading' : null;
        }

        const reading = Number(row.reading);

        if (Number.isNaN(reading)) {
            return 'Invalid';
        }

        const min = this.getMinAllowedReading(row);

        if (reading < min) {
            return `Min ${min}`;
        }

        return null;
    }

    private validateRow(row: BillCollectorBoxReadingVm): void {
        row.error = this.getRowValidationError(row);
    }

    private applyBulkResults(response: BulkKvaReadingResponse): void {
        this.rows = this.rows.map((row) => {
            const result = response.results?.find((item) => item.subscriberId === row.subscriber.id) ?? null;

            if (!result) return row;

            if (result.success && result.reading) {
                return {
                    ...row,
                    subscriber: {
                        ...row.subscriber,
                        pendingReadingId: result.reading.id,
                        pendingKvaReading: result.reading.kvaReading,
                        pendingReadingStatus: result.reading.status
                    },
                    result,
                    error: null,
                    touched: true
                };
            }

            return {
                ...row,
                result,
                error: result.errorMessage || 'Failed',
                touched: true
            };
        });
    }

    private applySubscriberOrderResponse(subscribers: Subscriber[]): void {
        if (!subscribers.length) {
            this.normalizeSortOrder();
            return;
        }

        const previousRowsBySubscriberId = new Map(this.rows.map((row) => [row.subscriber.id, row]));

        const sortedSubscribers = this.sortSubscribers(subscribers);

        this.rows = sortedSubscribers.map((subscriber) => {
            const oldRow = previousRowsBySubscriberId.get(subscriber.id);

            return {
                subscriber,
                reading: oldRow?.reading ?? subscriber.pendingKvaReading ?? null,
                picture: oldRow?.picture ?? null,
                picturePreviewUrl: oldRow?.picturePreviewUrl ?? null,
                error: oldRow?.error ?? null,
                result: oldRow?.result ?? null,
                touched: oldRow?.touched ?? false
            };
        });
    }

    private sortSubscribers(subscribers: Subscriber[]): Subscriber[] {
        return [...subscribers].sort((a, b) => {
            const aOrder = a.boxSortOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.boxSortOrder ?? Number.MAX_SAFE_INTEGER;

            if (aOrder !== bOrder) return aOrder - bOrder;

            return this.getSubscriberName(a).localeCompare(this.getSubscriberName(b));
        });
    }

    private normalizeSortOrder(): void {
        this.rows = this.rows.map((row, index) => ({
            ...row,
            subscriber: {
                ...row.subscriber,
                boxSortOrder: index + 1
            }
        }));
    }

    private swapRows(firstIndex: number, secondIndex: number): void {
        const copy = [...this.rows];

        const first = copy[firstIndex];
        copy[firstIndex] = copy[secondIndex];
        copy[secondIndex] = first;

        this.rows = copy;
    }

    private revokeSharedPreview(): void {
        if (this.sharedImagePreviewUrl) {
            URL.revokeObjectURL(this.sharedImagePreviewUrl);
            this.sharedImagePreviewUrl = null;
        }
    }

    private revokeAllRowPreviews(): void {
        this.rows.forEach((row) => {
            if (row.picturePreviewUrl) {
                URL.revokeObjectURL(row.picturePreviewUrl);
                row.picturePreviewUrl = null;
            }
        });
    }

    openBillingPeriodDialog(): void {
        /*
         * Prevent multiple billing-period dialogs from being opened by repeated
         * taps.
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
}
