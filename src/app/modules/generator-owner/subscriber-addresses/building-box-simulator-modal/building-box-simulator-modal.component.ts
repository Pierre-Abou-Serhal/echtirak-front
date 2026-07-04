import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs';

import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

import { BuildingBox, Subscriber } from '@/core/models/model';
import { GetSubscribersByBuildingBoxTokenResponse, UpdateSubscriberBuildingBoxOrderResponse } from '@/core/services/api/response';

import { UpdateSubscriberBuildingBoxOrderRequest } from '@/core/services/api/request';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

interface BuildingBoxSlotView {
    index: number;
    subscriber: Subscriber;
}

@Component({
    selector: 'app-building-box-simulator-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DragDropModule, Dialog, Button, InputText, Message, Skeleton, Tag, Tooltip, LbPhonePipe, IconField, InputIcon],
    templateUrl: './building-box-simulator-modal.component.html',
    styleUrl: './building-box-simulator-modal.component.scss'
})
export class BuildingBoxSimulatorModalComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    private readonly dropListPrefix = `building-box-slot-${Math.random().toString(36).slice(2)}`;

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() token: string | null = null;

    @Output() orderUpdated = new EventEmitter<Subscriber[]>();

    box?: BuildingBox;
    subscribers: Subscriber[] = [];

    dropListIds: string[] = [];

    loading = false;
    savingOrder = false;
    downloadingQr = false;

    keyword = '';
    dirty = false;

    get slotViews(): BuildingBoxSlotView[] {
        return this.subscribers.map((subscriber, index) => ({
            index,
            subscriber
        }));
    }

    get displayedSlotViews(): BuildingBoxSlotView[] {
        const q = this.keyword.trim().toLowerCase();

        if (!q) return this.slotViews;

        return this.slotViews.filter(({ subscriber }) => {
            const fullName = `${subscriber.firstName ?? ''} ${subscriber.lastName ?? ''}`.toLowerCase();

            return (
                fullName.includes(q) ||
                String(subscriber.phoneNumber ?? '')
                    .toLowerCase()
                    .includes(q) ||
                String(subscriber.electricMeterNumber ?? '')
                    .toLowerCase()
                    .includes(q) ||
                String(subscriber.generatorCode ?? '')
                    .toLowerCase()
                    .includes(q)
            );
        });
    }

    get reorderDisabled(): boolean {
        return this.loading || this.savingOrder || !!this.keyword.trim();
    }

    get hasSubscribers(): boolean {
        return this.subscribers.length > 0;
    }

    onDialogShow(): void {
        this.loadBox();
    }

    close(): void {
        if (this.savingOrder) return;

        this.visible = false;
        this.visibleChange.emit(false);
        this.resetLocalState();
    }

    loadBox(): void {
        if (!this.token) {
            this.notificationService.warn('Missing Token', 'Building box token is missing.');
            return;
        }

        this.loading = true;
        this.dirty = false;
        this.keyword = '';

        this.generatorOwnerService
            .getSubscribersByBuildingBoxToken(this.token)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (response: GetSubscribersByBuildingBoxTokenResponse) => {
                    this.box = response.box;

                    // Overriding API pendingReadingsCount
                    this.box.pendingReadingsCount = this.subscribers.filter((sub) => sub.pendingKvaReading && sub.pendingKvaReading > 0).length;

                    this.subscribers = this.sortSubscribers(response.subscribers ?? []);
                    this.normalizeSortOrder();
                },
                error: (err) => {
                    console.error(err);
                    this.box = undefined;
                    this.subscribers = [];
                    this.rebuildDropListIds();
                    this.notificationService.error('Error', 'Failed to load building box subscribers.');
                }
            });
    }

    dropInSlot(event: CdkDragDrop<number, number, Subscriber>, targetIndex: number): void {
        if (this.reorderDisabled) return;

        const draggedSubscriber = event.item.data;

        if (!draggedSubscriber) return;

        const sourceIndex = this.subscribers.findIndex((s) => s.id === draggedSubscriber.id);

        if (sourceIndex < 0) return;
        if (sourceIndex === targetIndex) return;

        this.swapSubscribers(sourceIndex, targetIndex);

        this.normalizeSortOrder();
        this.dirty = true;
    }

    moveSubscriber(index: number, direction: -1 | 1): void {
        if (this.reorderDisabled) return;

        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= this.subscribers.length) return;

        this.swapSubscribers(index, targetIndex);

        this.normalizeSortOrder();
        this.dirty = true;
    }

    saveOrder(): void {
        if (!this.token) return;

        const request: UpdateSubscriberBuildingBoxOrderRequest = {
            items: this.subscribers.map((subscriber, index) => ({
                subscriberId: subscriber.id,
                sortOrder: index + 1
            }))
        };

        this.savingOrder = true;

        this.generatorOwnerService
            .updateSubscriberBuildingBoxOrder(this.token, request)
            .pipe(finalize(() => (this.savingOrder = false)))
            .subscribe({
                next: (response: UpdateSubscriberBuildingBoxOrderResponse) => {
                    this.subscribers = this.sortSubscribers(response.subscribers ?? this.subscribers);
                    this.normalizeSortOrder();
                    this.dirty = false;

                    this.orderUpdated.emit(this.subscribers);

                    this.notificationService.success('Order Updated', `${response.updatedCount} subscriber(s) updated successfully.`);
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.error('Error', 'Failed to update subscriber order.');
                }
            });
    }

    resetOrder(): void {
        this.loadBox();
    }

    downloadQrCode(): void {
        if (!this.token) return;

        this.downloadingQr = true;

        this.generatorOwnerService
            .getBuildingBoxQrCode(this.token)
            .pipe(finalize(() => (this.downloadingQr = false)))
            .subscribe({
                next: (blob: Blob) => {
                    this.downloadBlob(blob, this.getQrFileName());
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.error('Error', 'Failed to download QR code.');
                }
            });
    }

    getSlotDropListId(index: number): string {
        return `${this.dropListPrefix}-${index}`;
    }

    getSubscriberName(subscriber: Subscriber): string {
        const name = `${subscriber.firstName ?? ''} ${subscriber.lastName ?? ''}`.trim();

        return name || `Subscriber #${subscriber.id}`;
    }

    getSubscriberAddress(subscriber: Subscriber): string {
        const address = subscriber.address;

        if (address) {
            return [address.city, address.street, address.building, address.floor].filter(Boolean).join(', ');
        }

        return [this.box?.city, this.box?.street, this.box?.building].filter(Boolean).join(', ');
    }

    getReadingStatusSeverity(status?: string | null): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch ((status ?? '').toUpperCase()) {
            case 'PENDING':
                return 'warn';

            case 'SUBMITTED':
            case 'VALIDATED':
            case 'BILLED':
                return 'success';

            case 'CANCELLED':
            case 'REJECTED':
                return 'danger';

            default:
                return 'secondary';
        }
    }

    getBillingSeverity(model?: string | null): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch ((model ?? '').toUpperCase()) {
            case 'METERED':
                return 'info';

            case 'FIXED':
                return 'success';

            default:
                return 'secondary';
        }
    }

    private swapSubscribers(sourceIndex: number, targetIndex: number): void {
        const dragged = this.subscribers[sourceIndex];
        const target = this.subscribers[targetIndex];

        this.subscribers[sourceIndex] = target;
        this.subscribers[targetIndex] = dragged;
    }

    private sortSubscribers(subscribers: Subscriber[]): Subscriber[] {
        return [...subscribers].sort((a, b) => {
            const aOrder = a.boxSortOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.boxSortOrder ?? Number.MAX_SAFE_INTEGER;

            if (aOrder !== bOrder) return aOrder - bOrder;

            const aName = this.getSubscriberName(a).toLowerCase();
            const bName = this.getSubscriberName(b).toLowerCase();

            return aName.localeCompare(bName);
        });
    }

    private normalizeSortOrder(): void {
        this.subscribers = this.subscribers.map((subscriber, index) => ({
            ...subscriber,
            boxSortOrder: index + 1
        }));

        this.rebuildDropListIds();
    }

    private rebuildDropListIds(): void {
        this.dropListIds = this.subscribers.map((_, index) => this.getSlotDropListId(index));
    }

    private resetLocalState(): void {
        this.box = undefined;
        this.subscribers = [];
        this.dropListIds = [];
        this.keyword = '';
        this.dirty = false;
        this.loading = false;
        this.savingOrder = false;
        this.downloadingQr = false;
    }

    private getQrFileName(): string {
        const city = this.box?.city || 'box';
        const street = this.box?.street || '';
        const building = this.box?.building || '';

        const name = [city, street, building].filter(Boolean).join('-').replace(/\s+/g, '-').toLowerCase();

        return `building-box-${name || this.token}-qr-code.png`;
    }

    private downloadBlob(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}
