import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AdminService } from '@/core/services/admin.service';
import { NotificationService } from '@/core/services/notification.service';

import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Divider } from 'primeng/divider';


import { LookupDomain, PaymentMethod, WalletTransactionType } from '@/core/enums/enum';
import { GetGoStatusResponse, GetGoWalletBalanceResponse, GetGoWalletTransactionsResponse, GetLookupResponse, ReactivateGeneratorOwnerResponse } from '@/core/services/api/response';
import { Lookup, WalletTransaction } from '@/core/models/model';
import { DeactivateGeneratorOwnerRequest, GetGoWalletTransactionsQueryParams, ReactivateGeneratorOwnerRequest, SetCapOverrideGoWalletRequest, TopUpGoWalletRequest } from '@/core/services/api/request';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';

@Component({
    selector: 'app-generator-owner-wallet-management',
    standalone: true,
    imports: [ReactiveFormsModule, DatePicker, InputNumber, InputText, Textarea, Select, ButtonDirective, TableModule, Message, Tag, Divider, CurrencyPipe, DatePipe, DecimalPipe, IconField],
    templateUrl: './generator-owner-wallet-management.component.html',
    styleUrl: './generator-owner-wallet-management.component.scss'
})
export class GeneratorOwnerWalletManagementComponent implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);
    private generatorOwnerService = inject(GeneratorOwnerService);
    private notificationService = inject(NotificationService);

    constructor(@Inject(LOCALE_ID) public locale: string) {}

    /** IMPORTANT:
     * generatorOwnerUserId is what your wallet APIs need.
     * In your code, you're using `AdminGeneratorOwnerProfile.id` everywhere.
     * If your backend expects a different field, pass it from parent accordingly.
     */
    @Input({ required: true }) generatorOwnerUserId!: number;
    @Input() generatorOwnerUsername?: string;

    /** Tell parent to refresh GO list after any wallet/status update */
    @Output() changed = new EventEmitter<void>();

    // ---------- UI state ----------
    isLoadingHeader = false;

    isTopUpSaving = false;
    isCapSaving = false;

    isStatusSaving = false;

    // balance & status
    balance?: GetGoWalletBalanceResponse['balance'];
    status?: GetGoStatusResponse['status'];

    // ---------- Payment method options ----------
    paymentMethodOptions = [
        { value: 'OMT', label: PaymentMethod.OMT },
        { value: 'WHISH', label: PaymentMethod.WHISH },
        { value: 'CASH', label: PaymentMethod.CASH },
        { value: 'BANK_TRANSFER', label: PaymentMethod.BANK_TRANSFER }
    ];

    // ---------- Forms ----------
    topUpForm = this.fb.nonNullable.group({
        amount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
        paymentMethod: this.fb.nonNullable.control('', [Validators.required]),
        referenceNumber: this.fb.nonNullable.control('', [Validators.required]),
        notes: this.fb.nonNullable.control('')
    });

    capForm = this.fb.nonNullable.group({
        overrideCap: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
        reason: this.fb.nonNullable.control('')
    });

    statusForm = this.fb.nonNullable.group({
        reason: this.fb.nonNullable.control('', [Validators.required])
    });

    // ---------- Transactions ----------
    transactions: WalletTransaction[] = [];
    totalTransactions = 0;
    txLoading = false;

    // Filters
    txFilters = this.fb.nonNullable.group({
        fromDate: this.fb.control<Date | null>(null),
        toDate: this.fb.control<Date | null>(null),
        type: this.fb.nonNullable.control<string | null>(null)
    });

    // paging
    pageNumber = 1;
    pageSize = 10;

    walletTransactionTypes: SelectOptionStrValue[] = [];
    isWalletTransactionTypesLoading = false;

    ngOnInit(): void {
        this.setupCapReasonValidator();
        this.loadHeader(); // balance + status
        this.loadWalletTransactionTypes();
        this.loadTransactions({ PageNumber: 1, PageSize: this.pageSize });
    }

    loadWalletTransactionTypes() {
        this.isWalletTransactionTypesLoading = true;

        this.generatorOwnerService.getLookup({ domain: LookupDomain.WALLET_TRANSACTION_TYPE }).subscribe({
            next: (response: GetLookupResponse) => {
                this.walletTransactionTypes = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.description
                }));
                this.isWalletTransactionTypesLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.walletTransactionTypes = [];
                this.isWalletTransactionTypesLoading = false;
                this.fillHarCodedWalletTransactionTypes();
            }
        });
    }

    // TODO: REMOVE ONCE DOMAIN LOOKUP WORKS FOR ADMINS
    private fillHarCodedWalletTransactionTypes() {
        if (this.walletTransactionTypes.length === 0) {
            this.walletTransactionTypes = [
                {
                    value: 'TOPUP',
                    label: WalletTransactionType.TOPUP
                },
                {
                    value: 'MONTHLY_BILLING',
                    label: WalletTransactionType.MONTHLY_BILLING
                },
                {
                    value: 'SMS_CHARGE',
                    label: WalletTransactionType.SMS_CHARGE
                },
                {
                    value: 'MANUAL_ADJUSTMENT',
                    label: WalletTransactionType.MANUAL_ADJUSTMENT
                },
                {
                    value: 'SMS_REFUND',
                    label: WalletTransactionType.SMS_REFUND
                }
            ];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['generatorOwnerUserId'] && !changes['generatorOwnerUserId'].firstChange) {
            this.resetStateForNewOwner();
            this.loadHeader();
            this.loadTransactions({ PageNumber: 1, PageSize: this.pageSize });
        }
    }

    private resetStateForNewOwner() {
        this.balance = undefined;
        this.status = undefined;
        this.transactions = [];
        this.totalTransactions = 0;

        this.topUpForm.reset({ amount: 0, paymentMethod: '', referenceNumber: '', notes: '' });
        this.capForm.reset({ overrideCap: 0, reason: '' });
        this.statusForm.reset({ reason: '' });

        this.txFilters.reset({ fromDate: null, toDate: null, type: null });
        this.pageNumber = 1;
    }

    private setupCapReasonValidator() {
        // reason required only when overrideCap > 0
        this.capForm.controls.overrideCap.valueChanges.subscribe((cap) => {
            const reason = this.capForm.controls.reason;
            reason.clearValidators();

            if ((cap ?? 0) > 0) reason.addValidators([Validators.required]);

            reason.updateValueAndValidity({ emitEvent: false });
        });
    }

    // ---------- Header loading ----------
    loadHeader() {
        if (!this.generatorOwnerUserId) return;

        this.isLoadingHeader = true;

        // load balance + status in parallel (simple approach: two calls)
        this.adminService
            .getGoWalletBalance(this.generatorOwnerUserId)
            .pipe(finalize(() => (this.isLoadingHeader = false)))
            .subscribe({
                next: (res) => (this.balance = res.balance),
                error: (err) => console.log(err)
            });

        this.adminService.getGoStatus(this.generatorOwnerUserId).subscribe({
            next: (res) => (this.status = res.status),
            error: (err) => console.log(err)
        });
    }

    // ---------- Actions ----------
    topUp() {
        if (this.topUpForm.invalid) {
            this.topUpForm.markAllAsTouched();
            return;
        }

        const raw = this.topUpForm.getRawValue();

        const request: TopUpGoWalletRequest = {
            generatorOwnerUserId: this.generatorOwnerUserId,
            amount: raw.amount,
            paymentMethod: raw.paymentMethod,
            referenceNumber: raw.referenceNumber,
            notes: raw.notes
        };

        this.isTopUpSaving = true;
        this.adminService
            .topUpGoWallet(request)
            .pipe(finalize(() => (this.isTopUpSaving = false)))
            .subscribe({
                next: (res) => {
                    this.notificationService.success('Successful', `Wallet topped up. New balance: ${res.topUp.newBalance}`);
                    this.loadHeader();
                    this.changed.emit(); // parent refresh
                },
                error: (err) => console.log(err)
            });
    }

    setCapOverride() {
        if (this.capForm.invalid) {
            this.capForm.markAllAsTouched();
            return;
        }

        const raw = this.capForm.getRawValue();

        const request: SetCapOverrideGoWalletRequest = {
            generatorOwnerUserId: this.generatorOwnerUserId,
            overrideCap: raw.overrideCap,
            reason: raw.reason ?? ''
        };

        this.isCapSaving = true;
        this.adminService
            .setCapOverrideGoWallet(request)
            .pipe(finalize(() => (this.isCapSaving = false)))
            .subscribe({
                next: (res) => {
                    this.notificationService.success('Successful', `Cap override updated. Effective cap: ${res.capOverride.effectiveCap}`);
                    this.loadHeader();
                    this.changed.emit(); // parent refresh
                },
                error: (err) => console.log(err)
            });
    }

    deactivate() {
        if (this.statusForm.invalid) {
            this.statusForm.markAllAsTouched();
            return;
        }

        const req: DeactivateGeneratorOwnerRequest = {
            generatorOwnerUserId: this.generatorOwnerUserId,
            reason: this.statusForm.controls.reason.value
        };

        this.isStatusSaving = true;
        this.adminService
            .deactivateGeneratorOwner(req)
            .pipe(finalize(() => (this.isStatusSaving = false)))
            .subscribe({
                next: () => {
                    this.notificationService.success('Successful', 'Generator Owner deactivated.');
                    this.loadHeader();
                    this.changed.emit();
                },
                error: (err) => console.log(err)
            });
    }

    reactivate() {
        if (this.statusForm.invalid) {
            this.statusForm.markAllAsTouched();
            return;
        }

        const req: ReactivateGeneratorOwnerRequest = {
            generatorOwnerUserId: this.generatorOwnerUserId,
            reason: this.statusForm.controls.reason.value
        };

        this.isStatusSaving = true;
        this.adminService
            .reactivateGeneratorOwner(req)
            .pipe(finalize(() => (this.isStatusSaving = false)))
            .subscribe({
                next: (res: ReactivateGeneratorOwnerResponse) => {
                    this.notificationService.success('Successful', `Reactivated. New balance: ${res.response.newBalance}`);
                    this.loadHeader();
                    this.changed.emit();
                },
                error: (err) => console.log(err)
            });
    }

    // ---------- Transactions ----------
    onTxLazyLoad(event: any) {
        const first = event.first ?? 0;
        const rows = event.rows ?? this.pageSize;

        this.pageSize = rows;
        this.pageNumber = Math.floor(first / rows) + 1;

        this.loadTransactions({ PageNumber: this.pageNumber, PageSize: this.pageSize });
    }

    applyTxFilters() {
        this.pageNumber = 1;
        this.loadTransactions({ PageNumber: 1, PageSize: this.pageSize });
    }

    clearTxFilters() {
        this.txFilters.reset({ fromDate: null, toDate: null, type: null });
        this.pageNumber = 1;
        this.loadTransactions({ PageNumber: 1, PageSize: this.pageSize });
    }

    private loadTransactions(paging: { PageNumber: number; PageSize: number }) {
        if (!this.generatorOwnerUserId) return;

        const f = this.txFilters.getRawValue();

        const qp: GetGoWalletTransactionsQueryParams = {
            generatorOwnerUserId: this.generatorOwnerUserId,
            PageNumber: paging.PageNumber,
            PageSize: paging.PageSize,
            FromDate: f.fromDate ? this.toIsoDate(f.fromDate) : undefined,
            ToDate: f.toDate ? this.toIsoDate(f.toDate) : undefined,
            Type: f.type ?? undefined
        };

        this.txLoading = true;
        this.adminService
            .getGoWalletTransactions(qp)
            .pipe(finalize(() => (this.txLoading = false)))
            .subscribe({
                next: (res: GetGoWalletTransactionsResponse) => {
                    this.transactions = res.page.items as any;
                    this.totalTransactions = res.page.totalCount;
                },
                error: (err) => console.log(err)
            });
    }

    private toIsoDate(d: Date): string {
        // Use date only, if your API expects date-only
        // Otherwise use d.toISOString()
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // helper for invalid
    isInvalid(form: any, control: string) {
        const c = form.controls[control];
        return c.invalid && (c.dirty || c.touched);
    }

    statusSeverity(): 'success' | 'warning' | 'danger' | 'info' {
        const code = this.status?.statusCode?.toLowerCase() ?? '';
        if (code.includes('active')) return 'success';
        if (code.includes('inactive') || code.includes('disabled')) return 'danger';
        if (code.includes('pending')) return 'warning';
        return 'info';
    }
}
