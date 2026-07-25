import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { KvaReadingStatus } from '@/core/enums/enum';
import { KvaReading } from '@/core/models/model';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { UpsertKvaReadingResult } from '@/core/dtos/dto';
import {
    KvaReadingEditorComponent
} from '@/modules/bill-collector/kva-readings/kva-reading-editor/kva-reading-editor.component';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-kva-readings.component',
    standalone: true,
    imports: [FormsModule, DatePipe, DecimalPipe, Button, DataView, Dialog, IconField, InputIcon, InputText, Skeleton, Tag, LbPhonePipe, KvaReadingEditorComponent, KvaReadingEditorComponent],
    templateUrl: './kva-readings.component.html',
    styleUrl: './kva-readings.component.scss'
})
export class KvaReadingsComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    loading = false;

    readings: KvaReading[] = [];
    filteredReadings: KvaReading[] = [];

    keyword = '';
    pendingCount = 0;
    readonly skeletonItems = [1, 2, 3];

    updateOpen = false;
    selected: KvaReading | null = null;
    readingEditorBusy = false;

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
        if (this.loading) return;

        this.loading = true;

        this.billCollectorService
            .getKvaReadingPerBilCollector()
            .pipe(
                finalize(() => (this.loading = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    this.readings = response?.readings ?? [];
                    this.updatePendingCount();
                    this.applyFilter();
                },
                error: (error) => {
                    console.error(error);
                    this.readings = [];
                    this.filteredReadings = [];
                    this.pendingCount = 0;
                    this.notificationService.error('Loading Failed', 'Failed to load the KWH readings.');
                }
            });
    }

    onSearch(value: string): void {
        this.keyword = (value ?? '').trim();
        this.applyFilter();
    }

    private applyFilter(): void {
        const query = this.keyword.toLowerCase();

        if (!query) {
            this.filteredReadings = [...this.readings];
            return;
        }

        this.filteredReadings = this.readings.filter((reading) => {
            const searchableText = [reading.subscriberFirstName, reading.subscriberLastName, reading.subscriberPhoneNumber, reading.electricMeterNumber, reading.generatorCode, String(reading.subscriberId), String(reading.id)].join(' ').toLowerCase();

            return searchableText.includes(query);
        });
    }

    openUpdate(reading: KvaReading): void {
        if (reading.status !== KvaReadingStatus.PENDING) return;

        this.selected = reading;
        this.readingEditorBusy = false;
        this.updateOpen = true;
    }

    closeUpdate(): void {
        if (this.readingEditorBusy) {
            // PrimeNG may emit onHide after a programmatic or browser close.
            // Keep the editor mounted while it is saving or compressing.
            this.updateOpen = true;
            return;
        }

        this.updateOpen = false;
        this.selected = null;
    }

    onReadingUpdated(result: UpsertKvaReadingResult): void {
        const updatedReading = result.reading;
        const index = this.readings.findIndex((reading) => reading.id === updatedReading.id);

        if (index >= 0) {
            // Preserve any list-only properties that are not repeated by the
            // upsert response, such as duplicate-reading indicators.
            this.readings[index] = {
                ...this.readings[index],
                ...updatedReading
            };
            this.readings = [...this.readings];
            this.updatePendingCount();
            this.applyFilter();
        }

        this.readingEditorBusy = false;
        this.updateOpen = false;
        this.selected = null;

        this.notificationService.success('Success', this.getSaveMessage(result));

        // This should not normally happen, but reloading keeps the list
        // authoritative if the API returned a different reading identity.
        if (index < 0) {
            this.reload();
        }
    }

    getSeverity(status: string): TagSeverity {
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

    private updatePendingCount(): void {
        this.pendingCount = this.readings.filter((reading) => reading.status === KvaReadingStatus.PENDING).length;
    }

    private getSaveMessage(result: UpsertKvaReadingResult): string {
        if (result.billCreated) {
            return 'Reading updated and bill created.';
        }

        if (result.billAmended) {
            return 'Reading updated and bill amended.';
        }

        return 'Reading updated successfully.';
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
