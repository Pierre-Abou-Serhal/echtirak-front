import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BarcodeScannedEvent, QrScannerComponent } from '@/modules/bill-collector/qr-scanner/qr-scanner.component';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Skeleton } from 'primeng/skeleton';
import { Subscriber } from '@/core/models/model';
import { debounceTime, distinctUntilChanged, finalize, firstValueFrom, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { SubscriberStatus } from '@/core/enums/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { NotificationService } from '@/core/services/notification.service';
import { GetSubscribersResponse } from '@/core/services/api/response';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { provideNgxMask } from 'ngx-mask';
import { formatSubscriberAddress } from '@/core/utils/utils';

@Component({
    selector: 'app-subscribers.component',
    imports: [IconField, InputIcon, Skeleton, DataView, Tag, FormsModule, InputText, Button, QrScannerComponent, Dialog, LbPhonePipe, DecimalPipe],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss',
    standalone: true,
    providers: [provideNgxMask()]
})
export class SubscribersComponent implements OnInit {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly notificationService = inject(NotificationService);

    private router = inject(Router);
    private route = inject(ActivatedRoute);

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
    scanningBillBarcode = false;

    ngOnInit(): void {
        this.search$
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap((q) => {
                    this.keyword = q;
                    this.reset();
                    this.loading = true;
                }),
                tap(() => this.fetchFirstPage()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.search$.next('');
    }

    onSearch(value: string) {
        this.search$.next((value ?? '').trim());
    }

    loadMore() {
        if (!this.hasMore || this.loadingMore) return;
        this.fetchNextPage();
    }

    private fetchFirstPage() {
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

    private fetchNextPage() {
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

    private reset() {
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

    openSubscriberClick(subscriberId: number) {
        this.router.navigate(['add-kva-reading', subscriberId], { relativeTo: this.route });
    }

    openQr() {
        this.isQrDialogOpen = true;
    }

    closeQr() {
        this.isQrDialogOpen = false;
    }

    async onQrScanned(value: string): Promise<void> {
        this.isQrDialogOpen = false;

        const id = this.extractSubscriberIdFromQr(value);

        if (!id) {
            this.notificationService.warn('Failure', 'Failed to extract QR code content. Try to search for subscriber manually.');
            return;
        }

        const isValid = await this.isParsedSubIdValid(id);

        if (!isValid) {
            this.notificationService.warn('Failure', 'Something went wrong reading the QR code. Try to search for subscriber manually.');
            return;
        }

        this.router.navigate(['add-kva-reading', id], { relativeTo: this.route });
    }

    onBarcodeScanned(event: BarcodeScannedEvent): void {
        if (this.scanningBillBarcode) return;

        const readBarcode: string = event.value;
        const billId = Number(readBarcode.replace('BILL-', ''));

        if (!Number.isInteger(billId) || billId <= 0) {
            this.isQrDialogOpen = false;

            this.notificationService.warn('Failure', 'Invalid bill barcode. Try to search for the bill manually.');

            return;
        }

        this.scanningBillBarcode = true;

        this.billCollectorService
            .ScanBillBarcode({
                billId
            })
            .pipe(finalize(() => (this.scanningBillBarcode = false)))
            .subscribe({
                next: (res) => {
                    this.isQrDialogOpen = false;

                    const collection = res?.item;

                    this.notificationService.success('Bill Collected', collection ? `Bill #${collection.billId} was collected successfully. Amount: ${collection.amount} ${collection.currencyCode}.` : 'Bill was collected successfully.');
                },
                error: (err) => {
                    console.error(err);

                    this.isQrDialogOpen = false;

                    this.notificationService.warn('Failure', 'Failed to collect bill. Please try again or search manually.');
                }
            });
    }

    private extractSubscriberIdFromQr(qr: string): number | null {
        try {
            const url = new URL(qr.trim());
            const segments = url.pathname.split('/').filter(Boolean);
            const last = segments.at(-1);
            const id = Number(last);

            return Number.isFinite(id) && id > 0 ? id : null;
        } catch {
            const s = qr.trim().replace(/\/+$/, '');
            const last = s.split('/').at(-1);
            const id = Number(last);

            return Number.isFinite(id) && id > 0 ? id : null;
        }
    }

    private async isParsedSubIdValid(parsedSubId: number): Promise<boolean> {
        try {
            const res: GetSubscribersResponse = await firstValueFrom(
                this.billCollectorService.getSubs({
                    pageNumber: 1,
                    pageSize: 1,
                    keyword: parsedSubId.toString()
                })
            );

            const items = res?.page?.items ?? [];
            return items.length === 1 && items[0].id === parsedSubId;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    protected readonly formatSubscriberAddress = formatSubscriberAddress;
}
