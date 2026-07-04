import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { debounceTime, distinctUntilChanged, finalize, firstValueFrom, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Skeleton } from 'primeng/skeleton';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import { provideNgxMask } from 'ngx-mask';

import { QrScannerComponent } from '@/modules/bill-collector/qr-scanner/qr-scanner.component';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';

import { Subscriber } from '@/core/models/model';
import { SubscriberStatus } from '@/core/enums/enum';
import { GetSubscribersResponse } from '@/core/services/api/response';

import { LbPhonePipe } from '@/core/pipes/pipes';
import { formatSubscriberAddress } from '@/core/utils/utils';
import { BillCollectorQrNavigationService } from '@/core/services/bill-collector-qr-navigation.service';

type QrTarget = { type: 'kwh-reading'; subscriberId: number } | { type: 'bill-collection'; billId: number };

@Component({
    selector: 'app-subscribers.component',
    standalone: true,
    imports: [IconField, InputIcon, Skeleton, DataView, Tag, FormsModule, InputText, Button, QrScannerComponent, Dialog, LbPhonePipe, DecimalPipe],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss',
    providers: [provideNgxMask()]
})
export class SubscribersComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);
    private readonly qrNavigationService = inject(BillCollectorQrNavigationService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    subs: Subscriber[] = [];

    keyword = '';
    private search$ = new Subject<string>();

    private pageNumber = 1;
    private readonly pageSize = 20;

    hasMore = true;

    loading = false;
    loadingMore = false;

    skeletonItems = [1, 2, 3];

    isQrDialogOpen = false;

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap((query) => {
                    this.keyword = query;
                    this.reset();
                    this.loading = true;
                }),
                tap(() => this.fetchFirstPage()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.search$.next('');
    }

    onSearch(value: string): void {
        this.search$.next((value ?? '').trim());
    }

    loadMore(): void {
        if (!this.hasMore || this.loadingMore) return;

        this.fetchNextPage();
    }

    private fetchFirstPage(): void {
        this.pageNumber = 1;

        this.billCollectorService
            .getSubs({
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                keyword: this.keyword || undefined
            })
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (res) => {
                    const page = res?.page;
                    const items = page?.items ?? [];

                    this.subs = items;
                    this.hasMore = !!page?.hasNext;
                },
                error: () => {
                    this.subs = [];
                    this.hasMore = false;
                }
            });
    }

    private fetchNextPage(): void {
        this.loadingMore = true;

        const nextPage = this.pageNumber + 1;

        this.billCollectorService
            .getSubs({
                pageNumber: nextPage,
                pageSize: this.pageSize,
                keyword: this.keyword || undefined
            })
            .pipe(finalize(() => (this.loadingMore = false)))
            .subscribe({
                next: (res) => {
                    const page = res?.page;
                    const items = page?.items ?? [];

                    this.pageNumber = nextPage;
                    this.subs = [...this.subs, ...items];
                    this.hasMore = !!page?.hasNext;
                },
                error: () => {
                    this.hasMore = false;
                }
            });
    }

    private reset(): void {
        this.subs = [];
        this.pageNumber = 1;
        this.hasMore = true;
    }

    getSubscriberSeverity(statusCode: string) {
        switch (statusCode) {
            case SubscriberStatus.INACTIVE:
                return 'danger';

            case SubscriberStatus.ACTIVE:
                return 'success';

            default:
                return null;
        }
    }

    openSubscriberClick(subscriberId: number): void {
        this.router.navigate(['add-kva-reading', subscriberId], {
            relativeTo: this.route
        });
    }

    openQr(): void {
        this.isQrDialogOpen = true;
    }

    closeQr(): void {
        this.isQrDialogOpen = false;
    }

    async onQrScanned(value: string): Promise<void> {
        this.isQrDialogOpen = false;

        const target = await this.qrNavigationService.handleScannedValue(value);

        if (!target) {
            this.notificationService.warn('Invalid QR', 'This QR code is not recognized. Please try again or search manually.');
        }
    }

    protected readonly formatSubscriberAddress = formatSubscriberAddress;
}
