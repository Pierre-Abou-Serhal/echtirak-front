import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, firstValueFrom, Subscription } from 'rxjs';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { BillSummary } from '@/core/dtos/dto';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { GetBillCollectorBillsQueryParams } from '@/core/services/api/request';
import { GetBillCollectorBillsResponse } from '@/core/services/api/response';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { NotificationService } from '@/core/services/notification.service';
import { BillCollectionStatus, BillStatus } from '@/core/enums/enum';
import { Dialog } from 'primeng/dialog';
import { environment } from '../../../../environments/environment';
import { AsYouType, CountryCode, getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { Select } from 'primeng/select';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface PhoneCountry {
    iso2: CountryCode;
    name: string;
    dialCode: string;
    flag: string;
    searchText: string;
}

@Component({
    selector: 'app-bills',
    standalone: true,
    imports: [FormsModule, DatePipe, DecimalPipe, Button, DatePicker, IconField, InputIcon, InputText, Skeleton, Tag, LbPhonePipe, Dialog, Select],
    templateUrl: './bills.component.html'
})
export class BillsComponent implements OnInit, OnDestroy {
    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    billPeriod: Date | null = new Date();

    bills: BillSummary[] = [];
    filteredBills: BillSummary[] = [];

    keyword = '';
    loading = false;
    loadFailed = false;

    printingBillId: number | null = null;

    sharingBillId: number | null = null;

    whatsAppDialogVisible = false;
    selectedWhatsAppBill: BillSummary | null = null;
    whatsAppPhoneNumber = '';
    whatsAppPhoneTouched = false;

    loadingWhatsAppSubscriberCode = false;
    whatsAppSubscriberCode: string | null = null;
    whatsAppSubscriberCodeLoadFailed = false;

    private whatsAppSubscriberRequest?: Subscription;
    private readonly subscriberCodeCache = new Map<number, string>();

    /**
     * Contains the IDs of bills whose extra-fee section is expanded.
     */
    expandedExtraFeeBillIds = new Set<number>();

    readonly skeletonItems = [1, 2, 3];
    readonly loadMoreStep = 20;

    visibleCount = this.loadMoreStep;

    private billsRequest?: Subscription;

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

    collectDialogVisible = false;
    selectedBillForCollection: BillSummary | null = null;
    collectingBillId: number | null = null;

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.billsRequest?.unsubscribe();
        this.whatsAppSubscriberRequest?.unsubscribe();
    }

    get periodLabel(): string {
        if (!this.billPeriod) {
            return 'All periods';
        }

        const year = this.billPeriod.getFullYear();
        const month = String(this.billPeriod.getMonth() + 1).padStart(2, '0');

        return `${year}/${month}`;
    }

    get isCurrentMonthSelected(): boolean {
        if (!this.billPeriod) {
            return false;
        }

        const today = new Date();

        return this.billPeriod.getFullYear() === today.getFullYear() && this.billPeriod.getMonth() === today.getMonth();
    }

    get visibleBills(): BillSummary[] {
        return this.filteredBills.slice(0, this.visibleCount);
    }

    get hasMoreBills(): boolean {
        return this.visibleCount < this.filteredBills.length;
    }

    reload(): void {
        this.billsRequest?.unsubscribe();

        this.loading = true;
        this.loadFailed = false;

        const queryParams: GetBillCollectorBillsQueryParams = this.billPeriod
            ? {
                  billYear: String(this.billPeriod.getFullYear()),
                  billMonth: String(this.billPeriod.getMonth() + 1).padStart(2, '0')
              }
            : {};

        this.billsRequest = this.billCollectorService
            .getBills(queryParams)
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GetBillCollectorBillsResponse) => {
                    this.bills = response?.bills ?? [];
                    this.applyFilter();
                },
                error: (error) => {
                    console.error(error);

                    this.bills = [];
                    this.filteredBills = [];
                    this.visibleCount = this.loadMoreStep;
                    this.loadFailed = true;

                    this.notificationService.error('Loading Failed', 'Failed to load the bills.');
                }
            });
    }

    onPeriodSelected(): void {
        this.keyword = '';
        this.reload();
    }

    showCurrentMonth(): void {
        const today = new Date();

        this.billPeriod = new Date(today.getFullYear(), today.getMonth(), 1);

        this.keyword = '';
        this.reload();
    }

    showAllBills(): void {
        this.billPeriod = null;
        this.keyword = '';
        this.reload();
    }

    onSearch(value: string): void {
        this.keyword = value ?? '';
        this.applyFilter();
    }

    clearSearch(): void {
        this.keyword = '';
        this.applyFilter();
    }

    loadMore(): void {
        this.visibleCount += this.loadMoreStep;
    }

    toggleExtraFees(billId: number): void {
        if (this.expandedExtraFeeBillIds.has(billId)) {
            this.expandedExtraFeeBillIds.delete(billId);
        } else {
            this.expandedExtraFeeBillIds.add(billId);
        }
    }

    isExtraFeesExpanded(billId: number): boolean {
        return this.expandedExtraFeeBillIds.has(billId);
    }

    getExtraFeesTotal(bill: BillSummary): number {
        const providedTotal = Number(bill.extraFeesTotal);

        if (Number.isFinite(providedTotal) && providedTotal > 0) {
            return providedTotal;
        }

        return (bill.extraFees ?? []).reduce((total, fee) => total + Number(fee.amount ?? 0), 0);
    }

    getExtraFeesTotalLbp(bill: BillSummary): string | null {
        if (bill.extraFeesTotalLBP?.trim()) {
            return bill.extraFeesTotalLBP;
        }

        const total = (bill.extraFees ?? []).reduce((sum, fee) => sum + this.parseFormattedAmount(fee.amountLBP), 0);

        if (total <= 0) {
            return null;
        }

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 4
        }).format(total);
    }

    getExtraFeeName(fee: BillSummary['extraFees'][number]): string {
        return fee.extraFeeName || fee.name || 'Extra fee';
    }

    private parseFormattedAmount(value: string | number | null | undefined): number {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        if (!value) {
            return 0;
        }

        const parsed = Number(value.replaceAll(',', '').trim());

        return Number.isFinite(parsed) ? parsed : 0;
    }

    private applyFilter(): void {
        const query = this.keyword.trim().toLocaleLowerCase();

        this.visibleCount = this.loadMoreStep;

        if (!query) {
            this.filteredBills = [...this.bills];
            return;
        }

        this.filteredBills = this.bills.filter((bill) => {
            const searchableText = [
                bill.id,
                bill.billReference,
                bill.subscriberId,
                bill.subscriberFirstName,
                bill.subscriberLastName,
                bill.subscriberPhoneNumber,
                bill.generatorCode,
                bill.statusCode,
                bill.statusDescription,
                bill.collectionStatus,
                bill.barcodeValue,
                bill.billingModel,
                bill.billingModelName
            ]
                .map((value) => String(value ?? ''))
                .join(' ')
                .toLocaleLowerCase();

            return searchableText.includes(query);
        });
    }

    openBillPdf(bill: BillSummary): void {
        if (this.printingBillId !== null) {
            return;
        }

        /*
         * Opening the tab immediately prevents mobile browsers
         * from treating it as an unsolicited popup.
         */
        const reportWindow = window.open('about:blank', '_blank');

        if (!reportWindow) {
            this.notificationService.warn('Popup Blocked', 'Please allow popups to open the bill PDF.');
            return;
        }

        reportWindow.opener = null;
        reportWindow.document.title = 'Preparing Bill';

        reportWindow.document.body.innerHTML = `
            <div style="
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                font-family: Arial, sans-serif;
                text-align: center;
            ">
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

                    this.notificationService.error('Report Failed', 'Failed to open the bill PDF.');
                }
            });
    }

    isPrintingBill(billId: number): boolean {
        return this.printingBillId === billId;
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

    formatStatus(status: string | null | undefined): string {
        if (!status) {
            return 'Unknown';
        }

        return status
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    }

    openWhatsAppDialog(bill: BillSummary): void {
        this.selectedWhatsAppBill = bill;
        this.whatsAppPhoneTouched = false;
        this.whatsAppSubscriberCode = null;
        this.whatsAppSubscriberCodeLoadFailed = false;

        /*
         * Initialize the country and phone before PrimeNG
         * creates and displays the dialog controls.
         */
        this.initializeWhatsAppPhone(bill.subscriberPhoneNumber);

        this.whatsAppDialogVisible = true;

        this.loadWhatsAppSubscriberCode(bill);
    }

    resetWhatsAppDialog(): void {
        this.selectedWhatsAppBill = null;
        this.whatsAppPhoneNumber = '';
        this.whatsAppPhoneTouched = false;
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

    isSharingBill(billId: number): boolean {
        return this.sharingBillId === billId;
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
                    /*
                     * Ensure this response still belongs to the bill
                     * currently selected in the dialog.
                     */
                    if (this.selectedWhatsAppBill?.id !== bill.id) {
                        return;
                    }

                    const subscribers = response?.page?.items ?? [];

                    const subscriber = subscribers[0];
                    console.log(subscriber);

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

        /*
         * The application currently defaults to Lebanon.
         * Handle a Lebanese number stored without "+".
         */
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

        /*
         * Fallback when the stored value cannot be fully parsed.
         */
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
         * parsedPhone.number is E.164, such as +9613123456.
         * WhatsApp requires the digits without "+".
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

    canCollectBill(bill: BillSummary): boolean {
        return bill.statusCode === BillStatus.PENDING && bill.collectionStatus === BillCollectionStatus.NOT_COLLECTED;
    }

    openCollectDialog(bill: BillSummary): void {
        if (this.collectingBillId !== null) {
            return;
        }

        this.selectedBillForCollection = bill;
        this.collectDialogVisible = true;
    }

    resetCollectDialog(): void {
        this.selectedBillForCollection = null;
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
         * Preserve the selected bill before closing the dialog,
         * because onHide resets selectedBillForCollection.
         */
        this.collectDialogVisible = false;
        this.collectingBillId = bill.id;

        try {
            const response = await firstValueFrom(
                this.billCollectorService
                    .ScanBillBarcode({
                        billId: bill.id
                    })
                    .pipe(takeUntilDestroyed(this.destroyRef))
            );

            const collection = response?.item;

            this.notificationService.success('Bill Collected', collection ? `Bill #${collection.billReference} was collected successfully. Amount: ${collection.amount} ${collection.currencyCode}.` : 'The bill was collected successfully.');

            /*
             * Refresh the cards and collection statuses.
             */
            this.reload();
        } catch (error) {
            console.error(error);

            this.notificationService.error('Collection Failed', 'The bill could not be collected. Please try again.');
        } finally {
            this.collectingBillId = null;
            this.selectedBillForCollection = null;
        }
    }

    protected readonly BillStatus = BillStatus;
}
