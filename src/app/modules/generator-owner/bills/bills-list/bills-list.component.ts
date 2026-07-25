import { Component, DestroyRef, Inject, inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, formatDate, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, Subject, Subscription, switchMap, tap } from 'rxjs';
import * as Papa from 'papaparse';

import { Button, ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIcon } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { BillRow, BillSearchFilter, SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { BillAction, BillIssuedSmsStatus, BillStatus, LookupDomain } from '@/core/enums/enum';
import { Bill, Forecast, Generator, Lookup } from '@/core/models/model';
import { UpdateBillRequest, WalletForecastRequest } from '@/core/services/api/request';
import { GetBillsResponse, GetGeneratorsResponse, GetLookupResponse, PayBillsInBulkResponse, UpdateBillResponse, WalletForecastResponse } from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { WalletService } from '@/core/services/wallet.service';
import { mapBillToBillRow } from '@/core/utils/utils';

import { BillEditModalComponent } from '@/modules/generator-owner/bills/bill-edit-modal/bill-edit-modal.component';
import { BulkBillReportModalComponent } from '@/modules/generator-owner/bills/bulk-bill-report-modal/bulk-bill-report-modal.component';

type PaymentMode = 'single' | 'bulk';

@Component({
    selector: 'app-bills-list-component',
    standalone: true,
    imports: [
        FormsModule,
        CurrencyPipe,
        DatePipe,
        DecimalPipe,
        NgClass,
        Button,
        ButtonDirective,
        ConfirmDialogModule,
        ContextMenuModule,
        DatePicker,
        Dialog,
        IconField,
        InputGroup,
        InputGroupAddon,
        InputIcon,
        InputNumber,
        InputText,
        Select,
        TableModule,
        Tag,
        ToggleSwitch,
        Tooltip,
        NgxMaskDirective,
        BillEditModalComponent,
        BulkBillReportModalComponent
    ],
    templateUrl: './bills-list.component.html',
    styleUrl: './bills-list.component.scss',
    providers: [ConfirmationService, provideNgxMask()]
})
export class BillsListComponent implements OnInit, OnDestroy {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    private readonly walletService = inject(WalletService);

    private readonly notificationService = inject(NotificationService);

    private readonly confirmationService = inject(ConfirmationService);

    private readonly destroyRef = inject(DestroyRef);

    bills: BillRow[] = [];
    selectedBills: BillRow[] = [];

    loading = true;
    private loadingMore = false;

    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    private apiPageSize = 100;
    private currentApiPage = -1;
    private hasMoreFromServer = true;

    totalRecords = 0;

    billSearchFilter: BillSearchFilter;
    billStatuses: SelectOptionStrValue[] = [];
    generators: SelectOptionNumValue[] = [];

    isBillStatusesLoading = true;
    isGeneratorsLoading = true;

    private search$ = new Subject<BillSearchFilter>();

    expandedRows: Record<string, boolean> = {};

    editVisible = false;
    billToEdit: BillRow | null = null;

    items: MenuItem[] | undefined;
    selectedBill: BillRow | null = null;

    private actionLoading: Record<string, boolean> = {};

    extraFeesExpanded: Record<number, boolean> = {};

    payBulkBillsLoading = false;
    bulkBillReportVisible = false;

    // Payment dialog
    paymentDialogVisible = false;
    paymentMode: PaymentMode | null = null;
    paymentBills: BillRow[] = [];
    paymentSubmitting = false;

    // Payment confirmation SMS
    sendPaidSms = false;

    // SMS forecast
    forecastingPaidSms = false;
    paidSmsForecastFailed = false;
    paidSmsForecast: Forecast | null = null;

    private paidSmsForecastRequest?: Subscription;

    constructor(
        @Inject(LOCALE_ID)
        private locale: string
    ) {
        this.billSearchFilter = {};
    }

    ngOnInit(): void {
        this.loadBillStatuses();
        this.loadGenerators();
        this.initializeSearch();
        this.initializeContextMenu();

        this.search$.next(this.billSearchFilter);
    }

    ngOnDestroy(): void {
        this.paidSmsForecastRequest?.unsubscribe();
    }

    private loadBillStatuses(): void {
        this.generatorOwnerService
            .getLookup({
                domain: LookupDomain.BILL_STATUS
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: GetLookupResponse) => {
                    this.billStatuses = response.items.map((lookup: Lookup) => ({
                        value: lookup.code,
                        label: lookup.description
                    }));

                    this.isBillStatusesLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.billStatuses = [];
                    this.isBillStatusesLoading = false;
                }
            });
    }

    private loadGenerators(): void {
        this.generatorOwnerService
            .getGenerators()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: GetGeneratorsResponse) => {
                    this.generators = response.generators.map((generator: Generator) => ({
                        value: generator.id,
                        label: generator.code
                    }));

                    this.isGeneratorsLoading = false;
                },
                error: (error) => {
                    console.error(error);

                    this.generators = [];
                    this.isGeneratorsLoading = false;
                }
            });
    }

    private initializeSearch(): void {
        this.search$
            .pipe(
                debounceTime(300),
                tap(() => {
                    this.resetDataState();
                    this.loading = true;
                }),
                switchMap(() =>
                    this.fetchApiPage(1).pipe(
                        finalize(() => {
                            this.loading = false;
                        })
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.ensureDataFor(this.first + this.rows);
                },
                error: () => {
                    this.bills = [];
                    this.totalRecords = 0;
                    this.hasMoreFromServer = false;
                }
            });
    }

    private initializeContextMenu(): void {
        this.items = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                command: () => this.openBillEditModal(this.selectedBill)
            },
            {
                label: 'Pay',
                icon: 'pi pi-fw pi-dollar',
                command: () => this.payBill(this.selectedBill)
            },
            {
                label: 'Cancel',
                icon: 'pi pi-fw pi-times-circle',
                command: () => this.cancelBill(this.selectedBill)
            }
        ];
    }

    private fetchApiPage(pageNumber: number) {
        this.loadingMore = true;

        const { billDateFrom, billDateTo } = this.billSearchFilter;

        return this.generatorOwnerService
            .getBills({
                pageNumber,
                pageSize: this.apiPageSize,

                billDateFrom: billDateFrom ? formatDate(billDateFrom, 'yyyy-MM-dd', this.locale) : undefined,

                billDateTo: billDateTo ? formatDate(billDateTo, 'yyyy-MM-dd', this.locale) : undefined,

                statusCode: this.billSearchFilter.statusCode,

                generatorId: this.billSearchFilter.generatorId,

                subscriberName: this.billSearchFilter.subscriberName,

                subscriberPhoneNumber: this.billSearchFilter.subscriberPhoneNumber,

                billReference: this.billSearchFilter.billReference,

                keyword: this.billSearchFilter.keyword
            })
            .pipe(
                tap((response: GetBillsResponse) => {
                    const page = response?.page;

                    if (!page) {
                        this.hasMoreFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    const mapped = items.map((bill) => mapBillToBillRow(bill));

                    this.bills = [...this.bills, ...mapped];

                    this.currentApiPage = apiPageNumber;

                    if (pageSize && pageSize > 0) {
                        this.apiPageSize = pageSize;
                    }

                    this.totalRecords = totalCount;
                    this.hasMoreFromServer = hasNext;
                }),
                finalize(() => {
                    this.loadingMore = false;
                })
            );
    }

    private ensureDataFor(targetIndex: number): void {
        if (targetIndex < this.bills.length) {
            return;
        }

        if (!this.hasMoreFromServer || this.loadingMore) {
            return;
        }

        const nextPageNumber = this.currentApiPage < 0 ? 0 : this.currentApiPage + 1;

        this.fetchApiPage(nextPageNumber)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    if (targetIndex >= this.bills.length && this.hasMoreFromServer) {
                        this.ensureDataFor(targetIndex);
                    }
                },
                error: () => {
                    this.hasMoreFromServer = false;
                }
            });
    }

    private resetDataState(): void {
        this.bills = [];
        this.currentApiPage = -1;
        this.hasMoreFromServer = true;
        this.totalRecords = 0;
        this.first = 0;
    }

    clear(table: Table): void {
        table.clear();
        this.search$.next(this.billSearchFilter);
    }

    next(): void {
        if (this.isLastPage()) {
            return;
        }

        this.first = this.first + this.rows;

        this.ensureDataFor(this.first + this.rows);
    }

    prev(): void {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset(): void {
        this.first = 0;
    }

    pageChange(event: any): void {
        const oldRows = this.rows;

        this.first = event.first ?? this.first;

        this.rows = event.rows ?? this.rows;

        if (event.rows != null && event.rows !== oldRows) {
            this.first = 0;
        }

        this.ensureDataFor(this.first + this.rows);
    }

    isLastPage(): boolean {
        const atEnd = this.first + this.rows >= this.bills.length;

        return atEnd && !this.hasMoreFromServer;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv(): void {
        if (!this.bills.length) {
            return;
        }

        const listToExport: Bill[] = this.selectedBills.length > 0 ? this.selectedBills : this.bills;

        const csv = Papa.unparse(listToExport);

        const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });

        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = 'bills.csv';
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    }

    getBillSeverity(statusCode: string) {
        switch (statusCode) {
            case BillStatus.PENDING:
                return 'info';

            case BillStatus.PAID:
                return 'success';

            case BillStatus.CANCELLED:
                return 'danger';

            default:
                return null;
        }
    }

    applyFilters(): void {
        this.search$.next(this.billSearchFilter);
    }

    resetFilters(): void {
        this.billSearchFilter = {
            billDateFrom: undefined,
            billDateTo: undefined,
            subscriberName: undefined,
            generatorId: undefined,
            statusCode: undefined,
            keyword: undefined,
            subscriberPhoneNumber: undefined,
            billReference: undefined
        };

        this.applyFilters();
    }

    openBillEditModal(bill: BillRow | null | undefined): void {
        if (!bill) {
            return;
        }

        this.setActionLoading(bill.id, BillAction.EDIT, true);

        this.billToEdit = bill;
        this.editVisible = true;

        this.setActionLoading(bill.id, BillAction.EDIT, false);
    }

    onBillEditSave(updatedBill: BillRow): void {
        this.updateBill(updatedBill, BillAction.EDIT).subscribe({
            next: () => {
                this.notificationService.success('Successful', 'Bill updated successfully');
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onBillEditCancel(): void {}

    updateBill(bill: BillRow, action: BillAction, sendPaidSms = false) {
        this.setActionLoading(bill.id, action, true);

        const request: UpdateBillRequest = {
            billId: bill.id,
            subscriberLastName: bill.subscriberLastName,
            billDate: bill.billDate,
            billYear: bill.billYear,
            billMonth: bill.billMonth,
            amount: bill.amount,
            statusCode: bill.statusCode,
            currencyCode: bill.currencyCode,
            kvaFee: bill.kvaFee,
            notes: bill.notes,
            currentKva: bill.currentKva,
            previousKva: bill.previousKva,
            subscriberFirstName: bill.subscriberFirstName,
            subscriberId: bill.subscriberId,
            subscriptionAmps: bill.subscriptionAmps,
            subscriptionFeeFixed: bill.subscriptionFeeFixed,
            subscriptionFeeVar: bill.subscriptionFeeVar,
            status: bill.statusCode,
            sendPaidSms
        };

        return this.generatorOwnerService.updateBill(request).pipe(
            finalize(() => {
                this.setActionLoading(bill.id, action, false);
            }),
            tap((response: UpdateBillResponse) => {
                const index = this.findIndexById(request.billId);

                if (index !== -1) {
                    this.bills[index] = mapBillToBillRow(response.response.oldBill);
                }

                if (response.response.newBill.id !== response.response.oldBill.id) {
                    const newRow = mapBillToBillRow(response.response.newBill);

                    this.bills.unshift(newRow);
                }

                this.bills = [...this.bills];
            })
        );
    }

    payBill(bill: BillRow | null | undefined): void {
        if (!bill) {
            return;
        }

        this.openPaymentDialog('single', [bill]);
    }

    payBillsInBulk(): void {
        const pendingBills = this.selectedBills.filter((bill) => bill.statusCode === BillStatus.PENDING);

        if (pendingBills.length === 0) {
            this.notificationService.warn('Warning', 'Please select pending bills for bulk payment');

            return;
        }

        this.openPaymentDialog('bulk', pendingBills);
    }

    get paymentBillCount(): number {
        return this.paymentBills.length;
    }

    get paymentDialogTitle(): string {
        return this.paymentMode === 'bulk' ? 'Confirm Bulk Payment' : 'Confirm Payment';
    }

    get paymentActionLabel(): string {
        if (this.forecastingPaidSms) {
            return 'Calculating SMS Cost...';
        }

        if (this.paymentMode === 'bulk') {
            return this.sendPaidSms ? `Pay ${this.paymentBillCount} Bills & Send SMS` : `Pay ${this.paymentBillCount} Bills`;
        }

        return this.sendPaidSms ? 'Pay Bill & Send SMS' : 'Pay Bill';
    }

    get canConfirmPayment(): boolean {
        if (this.paymentSubmitting || this.paymentBills.length === 0) {
            return false;
        }

        if (!this.sendPaidSms) {
            return true;
        }

        return !this.forecastingPaidSms && !this.paidSmsForecastFailed && this.paidSmsForecast?.isAffordable === true;
    }

    private openPaymentDialog(mode: PaymentMode, bills: BillRow[]): void {
        this.clearPaidSmsForecast();

        this.paymentMode = mode;
        this.paymentBills = [...bills];
        this.sendPaidSms = false;

        this.paymentDialogVisible = true;
    }

    closePaymentDialog(): void {
        if (this.paymentSubmitting) {
            return;
        }

        this.resetPaymentDialog();
    }

    onSendPaidSmsChanged(enabled: boolean): void {
        this.sendPaidSms = enabled;

        this.clearPaidSmsForecast();

        if (!enabled) {
            return;
        }

        this.loadPaidSmsForecast();
    }

    loadPaidSmsForecast(): void {
        if (!this.sendPaidSms || this.paymentBills.length === 0) {
            return;
        }

        const request: WalletForecastRequest = {
            billIds: this.paymentBills.map((bill) => bill.id)
        };

        this.paidSmsForecastRequest?.unsubscribe();

        this.forecastingPaidSms = true;
        this.paidSmsForecastFailed = false;
        this.paidSmsForecast = null;

        this.paidSmsForecastRequest = this.walletService
            .walletForecast(request)
            .pipe(
                finalize(() => {
                    this.forecastingPaidSms = false;
                })
            )
            .subscribe({
                next: (response: WalletForecastResponse) => {
                    this.paidSmsForecast = response.forecast;
                },
                error: (error) => {
                    console.error(error);

                    this.paidSmsForecast = null;
                    this.paidSmsForecastFailed = true;
                }
            });
    }

    retryPaidSmsForecast(): void {
        if (this.forecastingPaidSms || !this.sendPaidSms) {
            return;
        }

        this.loadPaidSmsForecast();
    }

    continueWithoutPaidSms(): void {
        this.sendPaidSms = false;
        this.clearPaidSmsForecast();
    }

    confirmPayment(): void {
        if (!this.canConfirmPayment) {
            return;
        }

        if (this.paymentMode === 'single') {
            this.executeSinglePayment(this.paymentBills[0]);

            return;
        }

        if (this.paymentMode === 'bulk') {
            this.executeBulkPayment([...this.paymentBills]);
        }
    }

    private executeSinglePayment(bill: BillRow): void {
        const sendSms = this.sendPaidSms;

        const updated: BillRow = {
            ...bill,
            statusCode: BillStatus.PAID
        };

        this.paymentSubmitting = true;

        this.updateBill(updated, BillAction.PAY, sendSms)
            .pipe(
                finalize(() => {
                    this.paymentSubmitting = false;
                })
            )
            .subscribe({
                next: () => {
                    this.notificationService.success('Successful', sendSms ? 'Bill paid and payment SMS sent successfully.' : 'Bill paid successfully.');

                    this.finishPaymentDialog();
                    this.getReceiptReport(bill);
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    private executeBulkPayment(billsToPay: BillRow[]): void {
        const billIds = billsToPay.map((bill) => bill.id);

        const sendSms = this.sendPaidSms;

        this.paymentSubmitting = true;
        this.payBulkBillsLoading = true;

        this.generatorOwnerService
            .payBillsInBulk({
                billIds,
                sendPaidSms: sendSms
            })
            .pipe(
                finalize(() => {
                    this.paymentSubmitting = false;

                    this.payBulkBillsLoading = false;
                })
            )
            .subscribe({
                next: (response: PayBillsInBulkResponse) => {
                    const paidAt = new Date().toISOString().split('T')[0];

                    billsToPay.forEach((paidBill) => {
                        const index = this.findIndexById(paidBill.id);

                        if (index === -1) {
                            return;
                        }

                        this.bills[index] = {
                            ...this.bills[index],
                            statusCode: BillStatus.PAID,
                            paidAt
                        };
                    });

                    this.bills = [...this.bills];

                    this.selectedBills = [];

                    this.notificationService.success('Successful', sendSms ? `${response.updatedCount} bill(s) paid and payment SMS messages sent successfully.` : `${response.updatedCount} bill(s) paid successfully.`);

                    this.finishPaymentDialog();
                },
                error: (error) => {
                    console.error(error);
                }
            });
    }

    private finishPaymentDialog(): void {
        this.resetPaymentDialog();
    }

    private resetPaymentDialog(): void {
        this.clearPaidSmsForecast();

        this.paymentDialogVisible = false;
        this.paymentMode = null;
        this.paymentBills = [];
        this.sendPaidSms = false;
    }

    private clearPaidSmsForecast(): void {
        this.paidSmsForecastRequest?.unsubscribe();

        this.paidSmsForecastRequest = undefined;

        this.forecastingPaidSms = false;
        this.paidSmsForecastFailed = false;
        this.paidSmsForecast = null;
    }

    cancelBill(bill: BillRow | null | undefined): void {
        if (!bill) {
            return;
        }

        this.confirmationService.confirm({
            message: 'Are you sure you want to cancel this bill?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',

            accept: () => {
                const updated: BillRow = {
                    ...bill,
                    statusCode: BillStatus.CANCELLED
                };

                this.updateBill(updated, BillAction.CANCEL).subscribe({
                    next: () => {
                        this.notificationService.success('Successful', 'Bill cancelled successfully');
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            }
        });
    }

    findIndexById(id: number): number {
        return this.bills.findIndex((bill) => bill.id === id);
    }

    onRowExpand(event: any): void {
        const id = event.data?.id;

        if (id != null) {
            this.expandedRows[id] = true;
        }
    }

    onRowCollapse(event: any): void {
        const id = event.data?.id;

        if (id != null) {
            delete this.expandedRows[id];
            delete this.extraFeesExpanded[id];
        }
    }

    expandAll(): void {
        this.expandedRows = Object.fromEntries(this.bills.filter((bill) => bill?.id != null).map((bill) => [String(bill.id), true]));
    }

    collapseAll(): void {
        this.expandedRows = {};
    }

    openRowMenu(event: MouseEvent, bill: BillRow, menu: ContextMenu): void {
        event.preventDefault();
        event.stopPropagation();

        this.selectedBill = bill;
        this.items = this.buildMenuItems(bill);

        menu.show(event);
    }

    private isPending(bill: Bill | null | undefined): boolean {
        return !!bill && bill.statusCode === BillStatus.PENDING;
    }

    private isPaid(bill: Bill | null | undefined): boolean {
        return !!bill && bill.statusCode === BillStatus.PAID;
    }

    private isCancelled(bill: Bill | null | undefined): boolean {
        return !!bill && bill.statusCode === BillStatus.CANCELLED;
    }

    private buildMenuItems(bill: BillRow): MenuItem[] {
        const id = bill.id;

        return [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                disabled: !this.isPending(bill) || this.isActionLoading(id, BillAction.EDIT),
                data: {
                    severity: 'info',
                    loading: this.isActionLoading(id, BillAction.EDIT)
                },
                command: () => this.openBillEditModal(bill)
            },
            {
                label: 'Pay',
                icon: 'pi pi-dollar',
                disabled: !this.isPending(bill) || this.isActionLoading(id, BillAction.PAY),
                data: {
                    severity: 'primary',
                    loading: this.isActionLoading(id, BillAction.PAY)
                },
                command: () => this.payBill(bill)
            },
            {
                label: 'Cancel',
                icon: 'pi pi-times-circle',
                disabled: !this.isPending(bill) || this.isActionLoading(id, BillAction.CANCEL),
                data: {
                    severity: 'danger',
                    loading: this.isActionLoading(id, BillAction.CANCEL)
                },
                command: () => this.cancelBill(bill)
            },
            {
                label: 'Get Bill Report',
                icon: 'pi pi-print',
                disabled: this.isCancelled(bill) || this.isActionLoading(id, BillAction.GET_BILL_REPORT),
                data: {
                    severity: 'contrast',
                    loading: this.isActionLoading(id, BillAction.GET_BILL_REPORT)
                },
                command: () => this.getBillReport(bill)
            },
            {
                label: 'Get Receipt Report',
                icon: 'pi pi-print',
                disabled: !this.isPaid(bill) || this.isActionLoading(id, BillAction.GET_RECEIPT_REPORT),
                data: {
                    severity: 'contrast',
                    loading: this.isActionLoading(id, BillAction.GET_RECEIPT_REPORT)
                },
                command: () => this.getReceiptReport(bill)
            }
        ];
    }

    private actionKey(id: number, action: BillAction): string {
        return `${id}:${action}`;
    }

    isActionLoading(id: number, action: BillAction): boolean {
        return !!this.actionLoading[this.actionKey(id, action)];
    }

    setActionLoading(id: number, action: BillAction, value: boolean): void {
        this.actionLoading[this.actionKey(id, action)] = value;

        if (this.selectedBill?.id === id) {
            this.items = this.buildMenuItems(this.selectedBill);
        }
    }

    onMenuItemClick(item: MenuItem, event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        item.command?.({
            originalEvent: event,
            item
        });
    }

    toggleExtraFees(billId: number): void {
        this.extraFeesExpanded[billId] = !this.extraFeesExpanded[billId];
    }

    isExtraFeesExpanded(billId: number): boolean {
        return !!this.extraFeesExpanded[billId];
    }

    getExtraFeesTotalUsd(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0);
    }

    getExtraFeesTotalLbp(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, fee) => sum + this.parseAmount(fee.amountLBP), 0);
    }

    getBillTotalAmount(bill: BillRow): number {
        const billAmount = Number(bill.amount) || 0;

        const extraFees = bill.currencyCode === 'LBP' ? this.getExtraFeesTotalLbp(bill) : this.getExtraFeesTotalUsd(bill);

        return billAmount + extraFees;
    }

    private parseAmount(value: string | number | null | undefined): number {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        if (!value) {
            return 0;
        }

        const parsed = Number(value.replaceAll(',', ''));

        return Number.isFinite(parsed) ? parsed : 0;
    }

    openBulkReportBills(): void {
        this.bulkBillReportVisible = true;
    }

    getBillReport(bill: BillRow): void {
        this.notificationService.success('Download Started', 'Your bill report is being downloaded.');

        this.setActionLoading(bill.id, BillAction.GET_BILL_REPORT, true);

        this.generatorOwnerService
            .getBillReport(bill.id)
            .pipe(
                finalize(() => {
                    this.setActionLoading(bill.id, BillAction.GET_BILL_REPORT, false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    this.downloadBlob(response, `Bill-${bill.id}-${bill.subscriberFirstName}-${bill.subscriberLastName}.pdf`);
                },
                error: (error) => {
                    console.error('Report download failed', error);
                }
            });
    }

    getReceiptReport(bill: BillRow): void {
        this.notificationService.success('Download Started', 'Your receipt report is being downloaded.');

        this.setActionLoading(bill.id, BillAction.GET_RECEIPT_REPORT, true);

        this.generatorOwnerService
            .getBillReceipt(bill.id)
            .pipe(
                finalize(() => {
                    this.setActionLoading(bill.id, BillAction.GET_RECEIPT_REPORT, false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    this.downloadBlob(response, `Receipt-${bill.subscriberFirstName}-${bill.subscriberLastName}.pdf`);
                },
                error: (error) => {
                    console.error('Receipt download failed', error);
                }
            });
    }

    private downloadBlob(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement('a');

        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    }

    protected readonly BillStatus = BillStatus;

    protected readonly BillIssuedSmsStatus = BillIssuedSmsStatus;
}
