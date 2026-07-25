import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, firstValueFrom, forkJoin, of, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { BillCollectorQrNavigationService } from '@/core/services/bill-collector-qr-navigation.service';

import { CollectionPending, NeedReading } from '@/core/services/api/response';
import { GetPendingWorkQueryParams } from '@/core/services/api/request';
import { BillCollectionStatus, BillStatus, PendingWorkAction } from '@/core/enums/enum';
import { BillSummary, NeedReadingItem, UpsertKvaReadingResult } from '@/core/dtos/dto';
import { LbPhonePipe } from '@/core/pipes/pipes';

import { QrScannerComponent } from '@/modules/bill-collector/qr-scanner/qr-scanner.component';
import { KvaReadingEditorComponent } from '@/modules/bill-collector/kva-readings/kva-reading-editor/kva-reading-editor.component';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-pending-work',
    standalone: true,
    imports: [FormsModule, DatePipe, DecimalPipe, Button, DatePicker, Dialog, IconField, InputIcon, InputText, Skeleton, Tag, LbPhonePipe, QrScannerComponent, KvaReadingEditorComponent],
    templateUrl: './pending-work.component.html'
})
export class PendingWorkComponent implements OnInit, OnDestroy {
    private readonly billCollectorService = inject(BillCollectorService);

    private readonly notificationService = inject(NotificationService);

    private readonly qrNavigationService = inject(BillCollectorQrNavigationService);

    private readonly destroyRef = inject(DestroyRef);

    readonly PendingWorkAction = PendingWorkAction;

    billPeriod: Date | null = new Date();

    activeAction: PendingWorkAction = PendingWorkAction.NEEDS_READING;

    loading = false;
    needsReadingLoadFailed = false;
    collectionPendingLoadFailed = false;

    needsReadingItems: NeedReadingItem[] = [];
    collectionBills: BillSummary[] = [];

    filteredNeedsReadingItems: NeedReadingItem[] = [];

    filteredCollectionBills: BillSummary[] = [];

    keyword = '';

    readonly skeletonItems = [1, 2, 3];

    printingBillId: number | null = null;

    // Shared KWH reading editor
    readingDialogOpen = false;
    readingEditorBusy = false;

    selectedPendingItem: NeedReadingItem | null = null;

    // QR scanner
    isQrDialogOpen = false;

    selectedBillForScan: BillSummary | null = null;

    collectingBillId: number | null = null;

    private pendingRequest?: Subscription;

    get selectedBillYear(): string | null {
        return this.billPeriod ? String(this.billPeriod.getFullYear()) : null;
    }

    get selectedBillMonth(): string | null {
        return this.billPeriod ? String(this.billPeriod.getMonth() + 1).padStart(2, '0') : null;
    }

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.pendingRequest?.unsubscribe();
    }

    reload(): void {
        if (!this.billPeriod) {
            this.clearPendingWorkResults();
            return;
        }

        this.pendingRequest?.unsubscribe();

        this.loading = true;
        this.needsReadingLoadFailed = false;
        this.collectionPendingLoadFailed = false;

        const billYear = this.billPeriod.getFullYear().toString();

        const billMonth = String(this.billPeriod.getMonth() + 1).padStart(2, '0');

        const needReadingParams: GetPendingWorkQueryParams = {
            billYear,
            billMonth,
            action: PendingWorkAction.NEEDS_READING
        };

        const collectionPendingParams: GetPendingWorkQueryParams = {
            billYear,
            billMonth,
            action: PendingWorkAction.COLLECTION_PENDING
        };

        const needsReadingRequest = this.billCollectorService.getNeedReading(needReadingParams).pipe(
            catchError((error) => {
                console.error('Failed to load pending readings.', error);

                this.needsReadingLoadFailed = true;

                return of<NeedReading>({
                    items: []
                });
            })
        );

        const collectionPendingRequest = this.billCollectorService.getCollectionPending(collectionPendingParams).pipe(
            catchError((error) => {
                console.error('Failed to load pending collections.', error);

                this.collectionPendingLoadFailed = true;

                return of<CollectionPending>({
                    bills: []
                });
            })
        );

        this.pendingRequest = forkJoin({
            needsReading: needsReadingRequest,
            collectionPending: collectionPendingRequest
        })
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: ({ needsReading, collectionPending }) => {
                    this.needsReadingItems = needsReading?.items ?? [];

                    this.collectionBills = collectionPending?.bills ?? [];

                    this.applyFilters();
                }
            });
    }

    onPeriodChange(): void {
        this.keyword = '';
        this.reload();
    }

    selectAction(action: PendingWorkAction): void {
        if (this.activeAction === action) {
            return;
        }

        this.activeAction = action;
        this.keyword = '';

        this.applyFilters();
    }

    onSearch(value: string): void {
        this.keyword = value ?? '';
        this.applyFilters();
    }

    clearSearch(): void {
        this.keyword = '';
        this.applyFilters();
    }

    private applyFilters(): void {
        const query = this.keyword.trim().toLocaleLowerCase();

        if (!query) {
            this.filteredNeedsReadingItems = [...this.needsReadingItems];

            this.filteredCollectionBills = [...this.collectionBills];

            return;
        }

        this.filteredNeedsReadingItems = this.needsReadingItems.filter((item) => {
            const searchableText = [
                item.subscriberId,
                item.firstName,
                item.lastName,
                item.generatorCode,
                item.addressCountry,
                item.addressCity,
                item.addressStreet,
                item.addressBuilding,
                item.addressFloor,
                item.pendingReadingId,
                item.pendingReadingStatus
            ]
                .map((value) => String(value ?? ''))
                .join(' ')
                .toLocaleLowerCase();

            return searchableText.includes(query);
        });

        this.filteredCollectionBills = this.collectionBills.filter((bill) => {
            const searchableText = [bill.id, bill.billReference, bill.subscriberId, bill.subscriberFirstName, bill.subscriberLastName, bill.subscriberPhoneNumber, bill.generatorCode, bill.statusCode, bill.collectionStatus, bill.barcodeValue]
                .map((value) => String(value ?? ''))
                .join(' ')
                .toLocaleLowerCase();

            return searchableText.includes(query);
        });
    }

    private clearPendingWorkResults(): void {
        this.loading = false;
        this.needsReadingItems = [];
        this.collectionBills = [];

        this.applyFilters();
    }

    get periodLabel(): string {
        if (!this.billPeriod) {
            return '';
        }

        const year = this.billPeriod.getFullYear();

        const month = String(this.billPeriod.getMonth() + 1).padStart(2, '0');

        return `${year}/${month}`;
    }

    get activeResultCount(): number {
        return this.activeAction === PendingWorkAction.NEEDS_READING ? this.filteredNeedsReadingItems.length : this.filteredCollectionBills.length;
    }

    get searchPlaceholder(): string {
        return this.activeAction === PendingWorkAction.NEEDS_READING ? 'Search subscriber, generator or address...' : 'Search subscriber, bill or generator...';
    }

    formatAddress(item: NeedReadingItem): string {
        const addressParts = [item.addressStreet, item.addressBuilding ? `Building ${item.addressBuilding}` : '', item.addressFloor ? `Floor ${item.addressFloor}` : '', item.addressCity, item.addressCountry].filter((value) => !!value?.trim());

        return addressParts.length ? addressParts.join(', ') : 'Address not available';
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

    getReadingSeverity(status: string | null | undefined): TagSeverity {
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

    getBillStatusSeverity(status: string | null | undefined): TagSeverity {
        switch (status?.toUpperCase()) {
            case BillStatus.PENDING:
                return 'info';

            case BillStatus.PAID:
                return 'success';

            case BillStatus.CANCELLED:
                return 'danger';

            default:
                return 'warn';
        }
    }

    getCollectionSeverity(status: string): TagSeverity {
        switch (status) {
            case BillCollectionStatus.NOT_COLLECTED:
                return 'info';

            case BillCollectionStatus.COLLECTED_BY_BC:
                return 'success';

            case BillCollectionStatus.COLLECTED_BY_GO:
                return 'warn';

            default:
                return 'warn';
        }
    }

    // ---------------------------------------------------------------------
    // Shared reading editor
    // ---------------------------------------------------------------------

    openReading(item: NeedReadingItem): void {
        this.selectedPendingItem = item;
        this.readingEditorBusy = false;
        this.readingDialogOpen = true;
    }

    closeReadingDialog(): void {
        if (this.readingEditorBusy) {
            this.readingDialogOpen = true;
            return;
        }

        this.readingDialogOpen = false;
        this.selectedPendingItem = null;
    }

    onReadingSaved(result: UpsertKvaReadingResult): void {
        const wasUpdate = Number(this.selectedPendingItem?.pendingReadingId) > 0;

        let message = wasUpdate ? 'KWH reading updated successfully.' : 'KWH reading added successfully.';

        if (result.billCreated) {
            message = 'Reading saved and bill created automatically.';
        } else if (result.billAmended) {
            message = 'Reading saved and the existing bill was amended.';
        }

        this.notificationService.success('Success', message);

        this.readingEditorBusy = false;
        this.readingDialogOpen = false;
        this.selectedPendingItem = null;

        this.reload();
    }

    get readingDialogTitle(): string {
        return Number(this.selectedPendingItem?.pendingReadingId) > 0 ? 'Update KWH Reading' : 'Add KWH Reading';
    }

    // ---------------------------------------------------------------------
    // Bill PDF
    // ---------------------------------------------------------------------

    printBill(bill: BillSummary): void {
        if (this.printingBillId !== null) {
            return;
        }

        const reportWindow = window.open('about:blank', '_blank');

        if (!reportWindow) {
            this.notificationService.warn('Popup Blocked', 'Please allow popups to open the bill PDF.');
            return;
        }

        reportWindow.opener = null;

        reportWindow.document.title = 'Preparing Bill';

        reportWindow.document.body.innerHTML = `
            <div style="font-family:Arial,sans-serif;padding:32px;text-align:center">
                Preparing bill PDF...
            </div>
        `;

        this.printingBillId = bill.id;

        this.billCollectorService
            .getBillReport(bill.id)
            .pipe(
                finalize(() => {
                    if (this.printingBillId === bill.id) {
                        this.printingBillId = null;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (blob) => {
                    if (!blob || blob.size === 0) {
                        reportWindow.close();

                        this.notificationService.warn('Empty Report', 'The bill report is empty.');

                        return;
                    }

                    const pdfBlob =
                        blob.type === 'application/pdf'
                            ? blob
                            : new Blob([blob], {
                                  type: 'application/pdf'
                              });

                    const reportUrl = URL.createObjectURL(pdfBlob);

                    reportWindow.location.href = reportUrl;

                    window.setTimeout(() => {
                        URL.revokeObjectURL(reportUrl);
                    }, 5 * 60_000);
                },
                error: (error) => {
                    console.error(error);
                    reportWindow.close();

                    this.notificationService.warn('Report Failed', 'Failed to open the bill PDF. Please try again.');
                }
            });
    }

    isPrintingBill(billId: number): boolean {
        return this.printingBillId === billId;
    }

    // ---------------------------------------------------------------------
    // Local QR collection
    // ---------------------------------------------------------------------

    openQrScanner(bill: BillSummary): void {
        if (this.collectingBillId !== null) {
            return;
        }

        this.selectedBillForScan = bill;
        this.isQrDialogOpen = true;
    }

    closeQr(): void {
        this.isQrDialogOpen = false;
        this.selectedBillForScan = null;
    }

    isCollectingBill(billId: number): boolean {
        return this.collectingBillId === billId;
    }

    async onQrScanned(value: string): Promise<void> {
        /*
         * Preserve the selected card before hiding
         * the dialog because onHide calls closeQr().
         */
        const expectedBill = this.selectedBillForScan;

        this.isQrDialogOpen = false;

        try {
            /*
             * Parse only. Do not call
             * handleScannedValue(), because that method
             * redirects bill QR codes to Bill Collections.
             */
            const target = this.qrNavigationService.parse(value);

            if (!target) {
                this.notificationService.warn('Invalid QR', 'This QR code is not recognized. Please try again.');
                return;
            }

            if (target.type !== 'bill-collection') {
                this.notificationService.warn('Wrong QR Type', 'Please scan the QR code printed on the selected bill.');
                return;
            }

            if (!expectedBill) {
                this.notificationService.warn('No Bill Selected', 'Select a bill and try scanning again.');
                return;
            }

            if (target.billId !== expectedBill.id) {
                this.notificationService.warn('Different Bill Scanned', `The scanned QR belongs to bill #${target.billId}, but bill #${expectedBill.billReference || expectedBill.id} was selected.`);
                return;
            }

            this.collectingBillId = target.billId;

            const response = await firstValueFrom(
                this.billCollectorService
                    .ScanBillBarcode({
                        billId: target.billId
                    })
                    .pipe(takeUntilDestroyed(this.destroyRef))
            );

            const collection = response?.item;

            this.notificationService.success('Bill Collected', collection ? `Bill #${collection.billReference} was collected successfully. Amount: ${collection.amount} ${collection.currencyCode}.` : 'Bill was collected successfully.');

            /*
             * Stay on Pending Work and refresh
             * both its counters and lists.
             */
            this.reload();
        } catch (error) {
            console.error(error);

            this.notificationService.warn('Scan Failed', 'The scanned QR code could not be processed.');
        } finally {
            this.collectingBillId = null;
            this.selectedBillForScan = null;
        }
    }
}
