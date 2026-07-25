import { Component, inject, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { BillRow, SelectOptionNumValue, SelectOptionStrValue, SmsCampaignCreateBill } from '@/core/dtos/dto';
import { BillStatus, SmsTemplateRole } from '@/core/enums/enum';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { CreateSmsCampaignResponse, GetBillsForSmsResponse, GetSmsTemplatesResponse, WalletForecastResponse } from '@/core/services/api/response';
import { Forecast, SmsTemplate } from '@/core/models/model';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { NotificationService } from '@/core/services/notification.service';
import { WalletService } from '@/core/services/wallet.service';
import { GetBillsForSmsQueryParams, WalletForecastRequest } from '@/core/services/api/request';
import { Tooltip } from 'primeng/tooltip';
import { LbPhonePipe } from '@/core/pipes/pipes';

@Component({
    selector: 'app-sms-campaign-create-bills-component',
    imports: [Button, Select, FormsModule, IconField, InputIcon, InputText, ButtonDirective, DatePipe, DecimalPipe, TableModule, Tag, NgClass, DatePicker, Dialog, CurrencyPipe, Tooltip, LbPhonePipe],
    templateUrl: './sms-campaign-create-bills.component.html',
    styleUrl: './sms-campaign-create-bills.component.scss'
})
export class SmsCampaignCreateBillsComponent implements OnInit {
    private readonly generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    private readonly walletService: WalletService = inject(WalletService);
    private readonly notificationService = inject(NotificationService);

    smsCampaignCreateBill: SmsCampaignCreateBill;

    smsTemplateRoles: SelectOptionStrValue[] = [
        { value: SmsTemplateRole.BILL_ISSUANCE, label: 'Bill Issuance' },
        { value: SmsTemplateRole.OVERDUE_BILL, label: 'Bill Overdue' },
        { value: SmsTemplateRole.BILL_PAID, label: 'Bill Paid' }
    ];

    smsTemplatesDropDown: SelectOptionNumValue[] = [];
    templates: SmsTemplate[] = [];

    isSmsTemplateLoading: boolean = false;

    bills: BillRow[] = [];
    selectedBills: BillRow[] = [];
    isBillsLoading: boolean = false;

    isCreatingSmsCampaign: Boolean = false;

    // Bills table variables
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;
    expandedRows: Record<string, boolean> = {};

    keyword = '';
    billPeriod: Date | null = null;

    paidBillPeriod: Date | null = null;

    // Preview SMS Template variables
    showTemplatePreviewDialog = false;
    previewTemplate: SmsTemplate | null = null;
    previewLang: string = 'en';

    // Wallet Forecast variables
    displayWarning: boolean = false;
    displayConfirmation: boolean = false;
    forecastWallet: Forecast | null = null;

    submitted = false;

    // Extra Options
    extraFeesExpanded: Record<number, boolean> = {};

    constructor() {
        this.smsCampaignCreateBill = {};
        this.paidBillPeriod = this.createCurrentMonth();
    }

    ngOnInit(): void {}

    onBillTypeChange(): void {
        const role = this.smsCampaignCreateBill.role;

        this.selectedBills = [];
        this.bills = [];
        this.expandedRows = {};
        this.first = 0;

        // Clear the local table filter when changing role.
        this.billPeriod = null;

        if (!role) {
            this.smsTemplatesDropDown = [];
            this.templates = [];
            return;
        }

        /*
         * BILL_PAID always requires a server billing period.
         * Default to the current month if one has not been selected.
         */
        if (this.isPaidBillType && !this.paidBillPeriod) {
            this.paidBillPeriod = this.createCurrentMonth();
        }

        this.loadTemplates();
        this.loadBills();
    }

    loadTemplates(): void {
        this.isSmsTemplateLoading = true;

        this.generatorOwnerService.getSmsTemplate({ roleCode: this.smsCampaignCreateBill.role }).subscribe({
            next: (response: GetSmsTemplatesResponse) => {
                this.templates = response.templates;

                this.smsTemplatesDropDown = response.templates.map((template: SmsTemplate) => ({
                    value: template.id,
                    label: template.name
                }));

                this.smsCampaignCreateBill.templateId = undefined;
                this.previewTemplate = null;

                this.isSmsTemplateLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.smsTemplatesDropDown = [];
                this.isSmsTemplateLoading = false;
            }
        });
    }

    loadBills(): void {
        const role = this.smsCampaignCreateBill.role;

        if (!role) {
            this.bills = [];
            this.selectedBills = [];
            return;
        }

        if (this.isPaidBillType && !this.paidBillPeriod) {
            this.bills = [];
            this.selectedBills = [];
            return;
        }

        const queryParams: GetBillsForSmsQueryParams = {
            role
        };

        if (this.isPaidBillType && this.paidBillPeriod) {
            queryParams.billYear = String(this.paidBillPeriod.getFullYear());

            queryParams.billMonth = String(this.paidBillPeriod.getMonth() + 1).padStart(2, '0');
        }

        /*
         * Prevent bills selected for an earlier role or period
         * from remaining selected.
         */
        this.selectedBills = [];
        this.expandedRows = {};
        this.extraFeesExpanded = {};
        this.first = 0;

        this.isBillsLoading = true;

        this.generatorOwnerService.getBillsForSms(queryParams).subscribe({
            next: (response: GetBillsForSmsResponse) => {
                this.bills = (response.bills ?? []).map((bill) => ({
                    ...bill,
                    billPeriodKey: `${bill.billYear}-` + `${String(bill.billMonth).padStart(2, '0')}`
                }));

                this.isBillsLoading = false;
            },
            error: (error) => {
                console.error(error);

                this.bills = [];
                this.selectedBills = [];
                this.isBillsLoading = false;

                this.notificationService.error('Loading Failed', this.isPaidBillType ? `Failed to load paid bills for ${this.paidBillPeriodLabel}.` : 'Failed to load bills.');
            }
        });
    }

    isSmsCampaignValid(): boolean {
        const { role, templateId, campaignName } = this.smsCampaignCreateBill;

        const hasRole = typeof role === 'string' && role.trim().length > 0;

        const hasTemplate = typeof templateId === 'number' && templateId > 0;

        const hasName = typeof campaignName === 'string' && campaignName.trim().length > 0;

        const hasBills = this.selectedBills.length > 0;

        const hasRequiredPeriod = !this.isPaidBillType || this.paidBillPeriod !== null;

        return hasRole && hasTemplate && hasName && hasBills && hasRequiredPeriod;
    }

    onCreateClick(): void {
        this.submitted = true;

        const roleValid = !!this.smsCampaignCreateBill.role?.trim();

        const nameValid = !!this.smsCampaignCreateBill.campaignName?.trim();

        const templateValid = !!this.smsCampaignCreateBill.templateId && this.smsCampaignCreateBill.templateId > 0;

        const paidPeriodValid = !this.isPaidBillType || this.paidBillPeriod !== null;

        if (!roleValid || !nameValid || !templateValid || !paidPeriodValid) {
            return;
        }

        if (!this.selectedBills?.length) {
            this.notificationService.warn('Warning', 'Please select at least one bill');

            return;
        }

        this.forecastSmsCampaign();
    }

    forecastSmsCampaign() {
        if (!this.isSmsCampaignValid()) {
            return;
        }

        const { templateId } = this.smsCampaignCreateBill;

        this.isCreatingSmsCampaign = true;

        let request: WalletForecastRequest = {
            templateId: templateId,
            billIds: this.selectedBills.map((bill: BillRow) => bill.id)
        };

        this.walletService.walletForecast(request).subscribe({
            next: (response: WalletForecastResponse) => {
                this.forecastWallet = response.forecast;

                if (response.forecast.isAffordable) {
                    // Creating the campaign --> enough balance
                    this.displayConfirmation = true;
                } else {
                    // Block the creation --> Show warning message
                    this.displayWarning = true;
                    this.isCreatingSmsCampaign = false;
                }
            },
            error: (err) => {
                console.log(err);
                this.isCreatingSmsCampaign = false;
            }
        });
    }

    createSmsCampaign(): void {
        const { templateId, campaignName } = this.smsCampaignCreateBill;

        this.generatorOwnerService
            .createSmsCampaign({
                templateId: templateId!,
                campaignName: campaignName!,
                billIds: this.selectedBills.map((bill: BillRow) => bill.id)
            })
            .subscribe({
                next: (response: CreateSmsCampaignResponse) => {
                    this.onCreateSmsCampaignSuccess();
                    this.isCreatingSmsCampaign = false;
                    this.closeConfirmation();
                },
                error: (err) => {
                    console.log(err);
                    this.isCreatingSmsCampaign = false;
                }
            });
    }

    // Bills table helpers
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

    clear(table: Table) {
        table.clear();
        this.keyword = '';
        this.billPeriod = null;
        this.selectedBills = [];
        this.first = 0;
        this.applyCombinedFilters(table);
    }

    next() {
        this.first = this.first + this.rows;
    }
    prev() {
        this.first = this.first - this.rows;
    }
    reset() {
        this.first = 0;
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLastPage(): boolean {
        return this.bills ? this.first + this.rows >= this.bills.length : true;
    }

    isFirstPage(): boolean {
        return this.bills ? this.first === 0 : true;
    }

    // --- row expansion
    onRowExpand(event: any) {
        const id = event.data?.id;
        if (id != null) this.expandedRows[String(id)] = true;
    }

    onRowCollapse(event: any) {
        const id = event.data?.id;
        if (id != null) {
            delete this.expandedRows[String(id)];
            delete this.extraFeesExpanded[id];
        }
    }

    expandAll() {
        this.expandedRows = Object.fromEntries(this.bills.filter((b) => b?.id != null).map((b) => [String(b.id), true]));
    }

    collapseAll() {
        this.expandedRows = {};
    }

    onKeywordChange(table: Table, value: string) {
        this.keyword = value ?? '';
        this.first = 0; // optional: reset pagination
        this.applyCombinedFilters(table);
    }

    onBillPeriodChange(table: Table) {
        this.first = 0; // optional: reset pagination
        this.applyCombinedFilters(table);
    }

    private applyCombinedFilters(table: Table) {
        const kw = (this.keyword ?? '').trim();
        table.filterGlobal(kw, 'contains');

        if (!this.billPeriod) {
            table.filter(null, 'billPeriodKey', 'equals'); // clear
            return;
        }

        const year = this.billPeriod.getFullYear();
        const month = this.billPeriod.getMonth() + 1;
        const key = `${year}-${String(month).padStart(2, '0')}`;

        table.filter(key, 'billPeriodKey', 'equals');
    }

    // Sms Template Preview Helpers
    openTemplatePreview() {
        const templateId = this.smsCampaignCreateBill.templateId;

        if (!templateId) return;

        this.previewTemplate = this.templates.find((t) => t.id === templateId) ?? null;
        this.previewLang = 'en'; // default
        this.showTemplatePreviewDialog = !!this.previewTemplate;
    }

    onTemplateChange() {
        const templateId = this.smsCampaignCreateBill.templateId;
        this.previewTemplate = this.templates.find((t) => t.id === templateId) ?? null;
        this.previewLang = 'en';
    }

    onCreateSmsCampaignSuccess(): void {
        this.notificationService.success('Success', 'SMS Campaign successfully created');

        this.submitted = false;

        // 1- Clear filters
        this.keyword = '';
        this.billPeriod = null;
        this.selectedBills = [];
        this.first = 0;

        // 2- Clear SMS Campaign name
        this.smsCampaignCreateBill.campaignName = undefined;

        // 3- Clear Bills and reload
        this.bills = [];
        this.loadBills();
    }

    // Wallet Forecast helpers
    closeWarning() {
        this.isCreatingSmsCampaign = false;
        this.displayWarning = false;
    }

    closeConfirmation() {
        this.isCreatingSmsCampaign = false;
        this.displayConfirmation = false;
    }

    // Extra Fees:
    toggleExtraFees(billId: number) {
        this.extraFeesExpanded[billId] = !this.extraFeesExpanded[billId];
    }

    isExtraFeesExpanded(billId: number): boolean {
        return this.extraFeesExpanded[billId];
    }

    getExtraFeesTotalUsd(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    }

    getExtraFeesTotalLbp(bill: BillRow): number {
        return (bill.extraFees ?? []).reduce((sum, f) => sum + (Number(f.amountLBP) || 0), 0);
    }

    getBillTotalAmount(bill: BillRow): number {
        const billAmount = Number(bill.amount) || 0;

        const extraFeesTotal = bill.currencyCode === 'LBP' ? this.getExtraFeesTotalLbp(bill) : this.getExtraFeesTotalUsd(bill);

        return billAmount + extraFeesTotal;
    }

    get isPaidBillType(): boolean {
        return this.smsCampaignCreateBill.role === SmsTemplateRole.BILL_PAID;
    }

    get paidBillPeriodLabel(): string {
        if (!this.paidBillPeriod) {
            return 'Not selected';
        }

        const year = this.paidBillPeriod.getFullYear();
        const month = String(this.paidBillPeriod.getMonth() + 1).padStart(2, '0');

        return `${year}/${month}`;
    }

    get isCurrentPaidBillPeriod(): boolean {
        if (!this.paidBillPeriod) {
            return false;
        }

        const current = new Date();

        return this.paidBillPeriod.getFullYear() === current.getFullYear() && this.paidBillPeriod.getMonth() === current.getMonth();
    }

    private createCurrentMonth(): Date {
        const current = new Date();

        return new Date(current.getFullYear(), current.getMonth(), 1);
    }

    onPaidBillPeriodChange(): void {
        if (!this.isPaidBillType || !this.paidBillPeriod) {
            return;
        }

        this.loadBills();
    }

    useCurrentPaidBillPeriod(): void {
        this.paidBillPeriod = this.createCurrentMonth();

        if (this.isPaidBillType) {
            this.loadBills();
        }
    }
}
