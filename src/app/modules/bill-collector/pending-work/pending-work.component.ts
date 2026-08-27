import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, firstValueFrom, forkJoin, of, Subscription } from 'rxjs';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { AsYouType, CountryCode, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';

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

import { environment } from '../../../../environments/environment';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface PhoneCountry {
    iso2: CountryCode;
    name: string;
    dialCode: string;
    flag: string;
    searchText: string;
}

@Component({
    selector: 'app-pending-work',
    standalone: true,
    imports: [FormsModule, DatePipe, DecimalPipe, Button, DatePicker, Dialog, IconField, InputIcon, InputText, Select, Skeleton, Tag, LbPhonePipe, QrScannerComponent, KvaReadingEditorComponent],
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

    private pendingRequest?: Subscription;

    /*
     * KWH reading editor
     */
    readingDialogOpen = false;
    readingEditorBusy = false;
    selectedPendingItem: NeedReadingItem | null = null;

    /*
     * Bill PDF
     */
    printingBillId: number | null = null;

    /*
     * Page-level QR scanner
     */
    isQrDialogOpen = false;

    /*
     * Direct bill collection
     */
    collectDialogVisible = false;
    selectedBillForCollection: BillSummary | null = null;
    collectingBillId: number | null = null;

    /*
     * WhatsApp dialog
     */
    whatsAppDialogVisible = false;
    selectedWhatsAppBill: BillSummary | null = null;

    whatsAppPhoneNumber = '';
    whatsAppPhoneTouched = false;

    loadingWhatsAppSubscriberCode = false;
    whatsAppSubscriberCode: string | null = null;
    whatsAppSubscriberCodeLoadFailed = false;

    private whatsAppSubscriberRequest?: Subscription;

    private readonly subscriberCodeCache = new Map<number, string>();

    private readonly regionNames = new Intl.DisplayNames(['en'], {
        type: 'region'
    });

    readonly phoneCountries: PhoneCountry[] = getCountries()
        .map((iso2) => {
            const name = this.regionNames.of(iso2) ?? iso2;
            const dialCode = getCountryCallingCode(iso2);

            return {
                iso2,
                name,
                dialCode,
                flag: this.getCountryFlag(iso2),
                searchText: `${name} ${iso2} +${dialCode}`
            };
        })
        .sort((first, second) => first.name.localeCompare(second.name));

    selectedPhoneCountry: PhoneCountry = this.phoneCountries.find((country) => country.iso2 === 'LB') ?? this.phoneCountries[0]!;

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
        this.whatsAppSubscriberRequest?.unsubscribe();
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

    getCollectionSeverity(status: string | null | undefined): TagSeverity {
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

    /*
     * KWH reading editor
     */

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

    /*
     * Bill PDF
     */

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

    /*
     * Page-level QR collection
     */

    openQrScanner(): void {
        if (this.collectingBillId !== null) {
            return;
        }

        this.isQrDialogOpen = true;
    }

    closeQr(): void {
        this.isQrDialogOpen = false;
    }

    async onQrScanned(value: string): Promise<void> {
        this.isQrDialogOpen = false;

        try {
            const target = this.qrNavigationService.parse(value);

            if (!target) {
                this.notificationService.warn('Invalid QR', 'This QR code is not recognized. Please try again.');

                return;
            }

            if (target.type !== 'bill-collection') {
                this.notificationService.warn('Wrong QR Type', 'Please scan a bill collection QR code.');

                return;
            }

            if (!Number.isInteger(target.billId) || target.billId <= 0) {
                this.notificationService.warn('Invalid Bill', 'The scanned QR code does not contain a valid bill.');

                return;
            }

            await this.collectBillById(target.billId, 'Scan Failed', 'The scanned bill could not be collected. Please try again.');
        } catch (error) {
            console.error(error);

            this.notificationService.warn('Scan Failed', 'The scanned QR code could not be processed.');
        }
    }

    /*
     * Direct bill collection
     */

    canCollectBill(bill: BillSummary): boolean {
        return bill.statusCode === BillStatus.PENDING && bill.collectionStatus === BillCollectionStatus.NOT_COLLECTED;
    }

    openCollectDialog(bill: BillSummary): void {
        if (this.collectingBillId !== null || !this.canCollectBill(bill)) {
            return;
        }

        this.selectedBillForCollection = bill;
        this.collectDialogVisible = true;
    }

    resetCollectDialog(): void {
        if (this.collectingBillId === null) {
            this.selectedBillForCollection = null;
        }
    }

    isCollectingBill(billId: number): boolean {
        return this.collectingBillId === billId;
    }

    async confirmBillCollection(): Promise<void> {
        const bill = this.selectedBillForCollection;

        if (!bill || this.collectingBillId !== null) {
            return;
        }

        /*
         * Preserve the bill locally because hiding the dialog
         * triggers resetCollectDialog().
         */
        this.collectDialogVisible = false;

        await this.collectBillById(bill.id, 'Collection Failed', 'The bill could not be collected. Please try again.');

        this.selectedBillForCollection = null;
    }

    private async collectBillById(billId: number, failureTitle: string, failureMessage: string): Promise<void> {
        if (this.collectingBillId !== null) {
            return;
        }

        this.collectingBillId = billId;

        try {
            const response = await firstValueFrom(
                this.billCollectorService
                    .ScanBillBarcode({
                        billId
                    })
                    .pipe(takeUntilDestroyed(this.destroyRef))
            );

            const collection = response?.item;

            this.notificationService.success('Bill Collected', collection ? `Bill #${collection.billReference} was collected successfully. Amount: ${collection.amount} ${collection.currencyCode}.` : 'The bill was collected successfully.');

            this.reload();
        } catch (error) {
            console.error(error);

            this.notificationService.error(failureTitle, failureMessage);
        } finally {
            this.collectingBillId = null;
        }
    }

    /*
     * WhatsApp invoice sharing
     */

    openWhatsAppDialog(bill: BillSummary): void {
        this.selectedWhatsAppBill = bill;
        this.whatsAppPhoneTouched = false;

        this.whatsAppSubscriberCode = null;
        this.whatsAppSubscriberCodeLoadFailed = false;
        this.loadingWhatsAppSubscriberCode = false;

        this.initializeWhatsAppPhone(bill.subscriberPhoneNumber);

        this.whatsAppDialogVisible = true;

        this.loadWhatsAppSubscriberCode(bill);
    }

    resetWhatsAppDialog(): void {
        this.whatsAppSubscriberRequest?.unsubscribe();
        this.whatsAppSubscriberRequest = undefined;

        this.selectedWhatsAppBill = null;
        this.whatsAppPhoneNumber = '';
        this.whatsAppPhoneTouched = false;

        this.whatsAppSubscriberCode = null;
        this.whatsAppSubscriberCodeLoadFailed = false;
        this.loadingWhatsAppSubscriberCode = false;
    }

    sendBillToWhatsApp(): void {
        this.whatsAppPhoneTouched = true;

        const bill = this.selectedWhatsAppBill;
        const subscriberBillCode = this.whatsAppSubscriberCode;
        const phoneNumber = this.getWhatsAppPhoneNumber();

        if (!bill || !subscriberBillCode || !phoneNumber) {
            return;
        }

        const message = this.buildWhatsAppMessage(bill, subscriberBillCode);

        const whatsAppUrl = `https://wa.me/${phoneNumber}` + `?text=${encodeURIComponent(message)}`;

        const whatsAppWindow = window.open(whatsAppUrl, '_blank');

        if (whatsAppWindow) {
            whatsAppWindow.opener = null;
        } else {
            window.location.href = whatsAppUrl;
        }

        this.whatsAppDialogVisible = false;
    }

    private buildWhatsAppMessage(bill: BillSummary, subscriberBillCode: string): string {
        const subscriberName = [bill.subscriberFirstName, bill.subscriberLastName].filter(Boolean).join(' ');

        const greeting = subscriberName ? `Hello ${subscriberName},` : 'Hello,';

        const reference = bill.billReference || bill.id;

        const month = String(bill.billMonth).padStart(2, '0');

        const invoiceUrl = this.buildPublicBillUrl(bill, subscriberBillCode);

        return `${greeting}\n\n` + `Your invoice ${reference} for ` + `${bill.billYear}/${month} is ready.\n\n` + `Open or download your invoice here:\n` + `${invoiceUrl}\n\n` + `Thank you.`;
    }

    private buildPublicBillUrl(bill: BillSummary, subscriberBillCode: string): string {
        const apiBaseUrl = environment.apiUrl.replace(/\/+$/, '');

        const url = new URL(`${apiBaseUrl}/Public/GetBillReportByCode`);

        url.searchParams.set('subscriberBillCode', subscriberBillCode);

        url.searchParams.set('billId', String(bill.id));

        return url.toString();
    }

    private loadWhatsAppSubscriberCode(bill: BillSummary): void {
        const cachedCode = this.subscriberCodeCache.get(bill.subscriberId);

        if (cachedCode) {
            this.whatsAppSubscriberCode = cachedCode;
            return;
        }

        this.whatsAppSubscriberRequest?.unsubscribe();

        this.loadingWhatsAppSubscriberCode = true;
        this.whatsAppSubscriberCodeLoadFailed = false;

        this.whatsAppSubscriberRequest = this.billCollectorService
            .getSubs({
                pageNumber: 1,
                pageSize: 1,
                subscriberId: bill.subscriberId
            })
            .pipe(
                finalize(() => {
                    this.loadingWhatsAppSubscriberCode = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    if (this.selectedWhatsAppBill?.id !== bill.id) {
                        return;
                    }

                    const subscriber = response?.page?.items?.[0];

                    const subscriberBillCode = subscriber?.subscriberBillCode?.trim();

                    if (!subscriberBillCode) {
                        this.whatsAppSubscriberCodeLoadFailed = true;

                        this.notificationService.warn('Code Not Found', 'The subscriber bill code could not be found.');

                        return;
                    }

                    this.whatsAppSubscriberCode = subscriberBillCode;

                    this.subscriberCodeCache.set(bill.subscriberId, subscriberBillCode);
                },
                error: (error) => {
                    console.error(error);

                    if (this.selectedWhatsAppBill?.id !== bill.id) {
                        return;
                    }

                    this.whatsAppSubscriberCodeLoadFailed = true;

                    this.notificationService.error('Subscriber Failed', 'Failed to retrieve the subscriber information.');
                }
            });
    }

    private getCountryFlag(countryCode: string): string {
        return countryCode
            .toUpperCase()
            .split('')
            .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
            .join('');
    }

    private initializeWhatsAppPhone(phoneNumber: string | null | undefined): void {
        const defaultCountry = this.phoneCountries.find((country) => country.iso2 === 'LB') ?? this.phoneCountries[0]!;

        const rawValue = phoneNumber?.trim() ?? '';

        if (!rawValue) {
            this.selectedPhoneCountry = defaultCountry;
            this.whatsAppPhoneNumber = '';
            return;
        }

        let normalizedValue = rawValue;

        if (normalizedValue.startsWith('00')) {
            normalizedValue = `+${normalizedValue.substring(2)}`;
        }

        const digits = normalizedValue.replace(/\D/g, '');

        if (!normalizedValue.startsWith('+') && digits.startsWith('961')) {
            normalizedValue = `+${digits}`;
        }

        const parsedPhone = normalizedValue.startsWith('+') ? parsePhoneNumberFromString(normalizedValue) : parsePhoneNumberFromString(normalizedValue, 'LB');

        const countryCode = parsedPhone?.country ?? 'LB';

        this.selectedPhoneCountry = this.phoneCountries.find((country) => country.iso2 === countryCode) ?? defaultCountry;

        const formattedNationalNumber = parsedPhone?.formatNational()?.trim();

        if (formattedNationalNumber) {
            this.whatsAppPhoneNumber = formattedNationalNumber;

            return;
        }

        let nationalDigits = digits;

        const dialCode = this.selectedPhoneCountry.dialCode;

        if (nationalDigits.startsWith(dialCode)) {
            nationalDigits = nationalDigits.substring(dialCode.length);
        }

        this.whatsAppPhoneNumber = new AsYouType(this.selectedPhoneCountry.iso2).input(nationalDigits);
    }

    private getParsedWhatsAppPhone() {
        const value = this.whatsAppPhoneNumber.trim();

        if (!value) {
            return undefined;
        }

        return parsePhoneNumberFromString(value, this.selectedPhoneCountry.iso2);
    }

    get isWhatsAppPhoneValid(): boolean {
        return this.getParsedWhatsAppPhone()?.isValid() ?? false;
    }

    private getWhatsAppPhoneNumber(): string | null {
        const parsedPhone = this.getParsedWhatsAppPhone();

        if (!parsedPhone?.isValid()) {
            return null;
        }

        /*
         * WhatsApp expects the E.164 number without "+".
         */
        return parsedPhone.number.substring(1);
    }

    onWhatsAppPhoneNumberChange(value: string | null | undefined): void {
        const digits = (value ?? '').replace(/\D/g, '');

        if (!digits) {
            this.whatsAppPhoneNumber = '';
            return;
        }

        this.whatsAppPhoneNumber = new AsYouType(this.selectedPhoneCountry.iso2).input(digits);
    }

    onWhatsAppCountryChanged(): void {
        const digits = this.whatsAppPhoneNumber.replace(/\D/g, '');

        this.whatsAppPhoneNumber = digits ? new AsYouType(this.selectedPhoneCountry.iso2).input(digits) : '';

        this.whatsAppPhoneTouched = false;
    }
}
