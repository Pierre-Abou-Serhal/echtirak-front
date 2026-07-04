import { DatePipe, DecimalPipe, formatDate, NgClass } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, firstValueFrom, tap } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';

import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import { Currency, Expense, ExpenseType, FinanceDayDetailSummary, FinanceDaySummary, FinanceTransaction, FinanceTransactionType } from '@/core/models/model';
import { GetExpensesQueryParams, UpsertExpenseRequest, UpsertExpenseTypeRequest } from '@/core/services/api/request';
import { GetCurrenciesResponse, GetExpenseTypesResponse, GetExpensesResponse, GetFinanceDayDetailResponse, GetFinanceDaysResponse } from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';

interface ExpenseFilters {
    dateFrom: Date | null;
    dateTo: Date | null;
    expenseTypeId: number | null;
    currencyCode: string | null;
}

interface FinanceFilters {
    dateFrom: Date | null;
    dateTo: Date | null;
    trxType: FinanceTransactionType | null;
    currencyCode: string;
}

@Component({
    selector: 'app-expenses-finances',
    standalone: true,
    imports: [DatePipe, DecimalPipe, FormsModule, ReactiveFormsModule, NgClass, Button, ConfirmDialogModule, DatePicker, Dialog, InputNumber, InputText, Select, TableModule, Tag, Textarea, Tabs, TabList, Tab, TabPanels, TabPanel],
    templateUrl: './expenses-finances.component.html',
    styleUrl: './expenses-finances.component.scss',
    providers: [ConfirmationService]
})
export class ExpensesFinancesComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly fb = inject(FormBuilder);

    readonly defaultCurrencyCode = 'USD';

    activeTab = 'expenses';

    currencies: SelectOptionStrValue[] = [{ label: this.defaultCurrencyCode, value: this.defaultCurrencyCode }];
    isCurrenciesLoading = false;

    expenseTypes: ExpenseType[] = [];
    isExpenseTypesLoading = false;
    isExpenseTypeDialogOpen = false;
    isExpenseTypeSaving = false;
    deletingExpenseTypeId: number | null = null;
    selectedExpenseTypeId = 0;

    expenseTypeForm: FormGroup = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
        description: [null, [Validators.maxLength(500)]]
    });

    expenseFilters: ExpenseFilters = {
        dateFrom: null,
        dateTo: null,
        expenseTypeId: null,
        currencyCode: null
    };

    expenses: Expense[] = [];
    selectedExpenses: Expense[] = [];
    isExpensesLoading = false;
    private isExpensesLoadingMore = false;
    expenseRowsPerPageOptions = [10, 20, 50, 100];
    expenseFirst = 0;
    expenseRows = 10;
    private expenseApiPageSize = 100;
    private currentExpenseApiPage = -1;
    private hasMoreExpensesFromServer = true;
    expenseTotalRecords = 0;

    isExpenseDialogOpen = false;
    isExpenseSaving = false;
    deletingExpenseId: number | null = null;
    selectedExpenseId = 0;

    expenseForm: FormGroup = this.fb.group({
        expenseTypeId: [null, Validators.required],
        expenseDate: [new Date(), Validators.required],
        amount: [null, [Validators.required, Validators.min(0.0001)]],
        currencyCode: [this.defaultCurrencyCode, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        amountLBP: [null, [Validators.min(0)]],
        exchangeRate: [null, [Validators.min(0)]],
        notes: [null, [Validators.maxLength(500)]]
    });

    financeFilters: FinanceFilters = {
        dateFrom: null,
        dateTo: null,
        trxType: null,
        currencyCode: this.defaultCurrencyCode
    };

    transactionTypeOptions: SelectOptionStrValue[] = [
        { label: 'Credit', value: 'CREDIT' },
        { label: 'Debit', value: 'DEBIT' }
    ];

    financeDays: FinanceDaySummary[] = [];
    isFinanceDaysLoading = false;
    financeResponseCurrencyCode = this.defaultCurrencyCode;

    selectedFinanceDay: FinanceDaySummary | null = null;
    isDayDetailDialogOpen = false;
    isDayDetailLoading = false;
    isDayDetailLoadingMore = false;
    dayDetailTransactions: FinanceTransaction[] = [];
    dayDetailSummary: FinanceDayDetailSummary | null = null;
    dayDetailRowsPerPageOptions = [10, 20, 50, 100];
    dayDetailFirst = 0;
    dayDetailRows = 10;
    private dayDetailApiPageSize = 100;
    private currentDayDetailApiPage = -1;
    dayDetailTotalRecords = 0;
    private hasMoreDayDetailFromServer = true;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    ngOnInit(): void {
        this.applyDefaultFilterDates();
        this.loadCurrencies();
        this.loadExpenseTypes();
        this.loadInitialExpenses();
        this.loadFinanceDays();
    }

    get expenseTypeOptions(): SelectOptionNumValue[] {
        return this.expenseTypes.map((type) => ({
            label: type.name,
            value: type.id
        }));
    }

    get expensesLoading(): boolean {
        return this.isExpensesLoading || this.isExpensesLoadingMore;
    }

    get dayDetailLoading(): boolean {
        return this.isDayDetailLoading || this.isDayDetailLoadingMore;
    }

    get financeTotalCredit(): number {
        return this.financeDays.reduce((sum, day) => sum + Number(day.totalCredit ?? 0), 0);
    }

    get financeTotalDebit(): number {
        return this.financeDays.reduce((sum, day) => sum + Number(day.totalDebit ?? 0), 0);
    }

    get financeNetAmount(): number {
        return this.financeTotalCredit - this.financeTotalDebit;
    }

    get dayDetailHeader(): string {
        if (!this.selectedFinanceDay) return 'Finance Day Detail';

        return `Finance Detail - ${this.toActivityDatePath(this.selectedFinanceDay.activityDate)}`;
    }

    loadCurrencies(): void {
        this.isCurrenciesLoading = true;

        this.generatorOwnerService
            .getCurrencies()
            .pipe(finalize(() => (this.isCurrenciesLoading = false)))
            .subscribe({
                next: (response: GetCurrenciesResponse) => {
                    const currencies = (response.currencies ?? []).map((currency: Currency) => ({
                        label: currency.code,
                        value: currency.code
                    }));

                    this.currencies = currencies.length > 0 ? currencies : this.currencies;
                    this.ensureSelectedCurrencies();
                },
                error: (err) => {
                    console.log(err);
                    this.ensureSelectedCurrencies();
                }
            });
    }

    loadExpenseTypes(): void {
        this.isExpenseTypesLoading = true;

        this.generatorOwnerService
            .getExpenseTypes()
            .pipe(finalize(() => (this.isExpenseTypesLoading = false)))
            .subscribe({
                next: (response: GetExpenseTypesResponse) => {
                    this.expenseTypes = response.expenseTypes ?? [];
                },
                error: (err) => {
                    console.log(err);
                    this.expenseTypes = [];
                    this.notificationService.warn('Failure', 'Failed to load expense types.');
                }
            });
    }

    openNewExpenseType(): void {
        this.selectedExpenseTypeId = 0;
        this.expenseTypeForm.reset({
            name: null,
            description: null
        });
        this.isExpenseTypeDialogOpen = true;
    }

    editExpenseType(expenseType: ExpenseType): void {
        this.selectedExpenseTypeId = expenseType.id;
        this.expenseTypeForm.reset({
            name: expenseType.name,
            description: expenseType.description ?? null
        });
        this.isExpenseTypeDialogOpen = true;
    }

    hideExpenseTypeDialog(): void {
        this.isExpenseTypeDialogOpen = false;
    }

    async saveExpenseType(): Promise<void> {
        this.isExpenseTypeSaving = true;
        this.expenseTypeForm.markAllAsTouched();

        if (!this.expenseTypeForm.valid) {
            this.isExpenseTypeSaving = false;
            return;
        }

        const raw = this.expenseTypeForm.getRawValue();
        const request: UpsertExpenseTypeRequest = {
            id: this.selectedExpenseTypeId > 0 ? this.selectedExpenseTypeId : 0,
            name: String(raw.name ?? '').trim(),
            description: this.toOptionalString(raw.description)
        };

        try {
            await firstValueFrom(this.generatorOwnerService.upsertExpenseType(request));

            this.notificationService.success('Successful', this.selectedExpenseTypeId > 0 ? 'Expense type updated.' : 'Expense type added.');
            this.isExpenseTypeDialogOpen = false;
            this.loadExpenseTypes();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to save expense type.');
        } finally {
            this.isExpenseTypeSaving = false;
        }
    }

    confirmDeleteExpenseType(expenseType: ExpenseType): void {
        this.confirmationService.confirm({
            header: 'Delete Expense Type',
            message: `Are you sure you want to delete "${expenseType.name}"? Historical expenses will keep this type name.`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                void this.deleteExpenseType(expenseType.id);
            }
        });
    }

    private async deleteExpenseType(expenseTypeId: number): Promise<void> {
        this.deletingExpenseTypeId = expenseTypeId;

        try {
            await firstValueFrom(this.generatorOwnerService.deleteExpenseType(expenseTypeId));

            this.notificationService.success('Successful', 'Expense type deleted.');

            if (this.expenseFilters.expenseTypeId === expenseTypeId) {
                this.expenseFilters.expenseTypeId = null;
                this.loadInitialExpenses();
            }

            if (this.expenseForm.get('expenseTypeId')?.value === expenseTypeId) {
                this.expenseForm.patchValue({ expenseTypeId: null });
            }

            this.loadExpenseTypes();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to delete expense type.');
        } finally {
            this.deletingExpenseTypeId = null;
        }
    }

    applyExpenseFilters(): void {
        if (this.expenseDateRangeInvalid()) {
            this.notificationService.warn('Validation', 'Expense From Date cannot be after To Date.');
            return;
        }

        this.loadInitialExpenses();
    }

    resetExpenseFilters(): void {
        const range = this.currentMonthRange();
        this.expenseFilters = {
            dateFrom: range.from,
            dateTo: range.to,
            expenseTypeId: null,
            currencyCode: null
        };

        this.loadInitialExpenses();
    }

    private loadInitialExpenses(): void {
        this.resetExpenseDataState();
        this.isExpensesLoading = true;

        this.fetchExpensesPage(1)
            .pipe(finalize(() => (this.isExpensesLoading = false)))
            .subscribe({
                next: () => this.ensureExpensesDataFor(this.expenseFirst + this.expenseRows),
                error: (err) => {
                    console.log(err);
                    this.expenses = [];
                    this.expenseTotalRecords = 0;
                    this.hasMoreExpensesFromServer = false;
                    this.notificationService.warn('Failure', 'Failed to load expenses.');
                }
            });
    }

    private fetchExpensesPage(pageNumber: number) {
        this.isExpensesLoadingMore = true;

        return this.generatorOwnerService.getExpenses(this.buildExpensesQuery(pageNumber)).pipe(
            tap((response: GetExpensesResponse) => {
                const page = response.page;

                if (!page) {
                    this.hasMoreExpensesFromServer = false;
                    return;
                }

                const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                this.expenses = [...this.expenses, ...items];
                this.currentExpenseApiPage = apiPageNumber;

                if (pageSize && pageSize > 0) {
                    this.expenseApiPageSize = pageSize;
                }

                this.expenseTotalRecords = totalCount;
                this.hasMoreExpensesFromServer = hasNext;
            }),
            finalize(() => (this.isExpensesLoadingMore = false))
        );
    }

    private ensureExpensesDataFor(targetIndex: number): void {
        if (targetIndex < this.expenses.length) return;
        if (!this.hasMoreExpensesFromServer || this.isExpensesLoadingMore) return;

        const nextPageNumber = this.currentExpenseApiPage < 0 ? 0 : this.currentExpenseApiPage + 1;

        this.fetchExpensesPage(nextPageNumber).subscribe({
            next: () => {
                if (targetIndex >= this.expenses.length && this.hasMoreExpensesFromServer) {
                    this.ensureExpensesDataFor(targetIndex);
                }
            },
            error: (err) => {
                console.log(err);
                this.hasMoreExpensesFromServer = false;
            }
        });
    }

    onExpensePage(event: { first?: number; rows?: number }): void {
        const oldRows = this.expenseRows;

        this.expenseFirst = event.first ?? this.expenseFirst;
        this.expenseRows = event.rows ?? this.expenseRows;

        if (event.rows != null && event.rows !== oldRows) {
            this.expenseFirst = 0;
        }

        this.ensureExpensesDataFor(this.expenseFirst + this.expenseRows);
    }

    nextExpensePage(): void {
        if (this.isExpenseLastPage()) return;

        this.expenseFirst += this.expenseRows;
        this.ensureExpensesDataFor(this.expenseFirst + this.expenseRows);
    }

    prevExpensePage(): void {
        this.expenseFirst = Math.max(0, this.expenseFirst - this.expenseRows);
    }

    resetExpensePage(): void {
        this.expenseFirst = 0;
    }

    isExpenseLastPage(): boolean {
        const atEndOfLoadedData = this.expenseFirst + this.expenseRows >= this.expenses.length;

        return atEndOfLoadedData && !this.hasMoreExpensesFromServer;
    }

    isExpenseFirstPage(): boolean {
        return this.expenseFirst === 0;
    }

    private buildExpensesQuery(pageNumber: number): GetExpensesQueryParams {
        const queryParams: GetExpensesQueryParams = {
            pageNumber,
            pageSize: this.expenseApiPageSize,
            dateFrom: this.toApiDate(this.expenseFilters.dateFrom),
            dateTo: this.toApiDate(this.expenseFilters.dateTo),
            expenseTypeId: this.expenseFilters.expenseTypeId ?? undefined,
            currencyCode: this.expenseFilters.currencyCode ?? undefined
        };

        return queryParams;
    }

    openNewExpense(): void {
        if (this.expenseTypes.length === 0) {
            this.notificationService.warn('Expense Types Required', 'Create an expense type before recording expenses.');
            return;
        }

        this.selectedExpenseId = 0;
        this.expenseForm.reset({
            expenseTypeId: this.expenseTypes[0]?.id ?? null,
            expenseDate: new Date(),
            amount: null,
            currencyCode: this.financeFilters.currencyCode || this.defaultCurrencyCode,
            amountLBP: null,
            exchangeRate: null,
            notes: null
        });
        this.isExpenseDialogOpen = true;
    }

    editExpense(expense: Expense): void {
        this.selectedExpenseId = expense.id;
        this.expenseForm.reset({
            expenseTypeId: expense.expenseTypeId,
            expenseDate: this.toDate(expense.expenseDate),
            amount: expense.amount,
            currencyCode: expense.currencyCode,
            amountLBP: expense.amountLBP ?? null,
            exchangeRate: expense.exchangeRate ?? null,
            notes: expense.notes ?? null
        });
        this.isExpenseDialogOpen = true;
    }

    hideExpenseDialog(): void {
        this.isExpenseDialogOpen = false;
    }

    async saveExpense(): Promise<void> {
        this.isExpenseSaving = true;
        this.expenseForm.markAllAsTouched();

        if (!this.expenseForm.valid) {
            this.isExpenseSaving = false;
            return;
        }

        if (this.hasAmountLbpWithoutExchangeRate()) {
            this.notificationService.warn('Validation', 'Exchange rate is required when LBP amount is provided.');
            this.isExpenseSaving = false;
            return;
        }

        const raw = this.expenseForm.getRawValue();
        const amountLBP = Number(raw.amountLBP ?? 0);
        const hasAmountLBP = amountLBP > 0;

        const request: UpsertExpenseRequest = {
            id: this.selectedExpenseId > 0 ? this.selectedExpenseId : 0,
            expenseTypeId: Number(raw.expenseTypeId),
            expenseDate: formatDate(raw.expenseDate, 'yyyy-MM-dd', this.locale),
            amount: Number(raw.amount),
            currencyCode: String(raw.currencyCode ?? '')
                .trim()
                .toUpperCase(),
            amountLBP: hasAmountLBP ? amountLBP : undefined,
            exchangeRate: hasAmountLBP ? Number(raw.exchangeRate) : undefined,
            notes: this.toOptionalString(raw.notes)
        };

        try {
            await firstValueFrom(this.generatorOwnerService.upsertExpense(request));

            this.notificationService.success('Successful', this.selectedExpenseId > 0 ? 'Expense updated.' : 'Expense recorded.');
            this.isExpenseDialogOpen = false;
            this.loadInitialExpenses();
            this.loadFinanceDays();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to save expense.');
        } finally {
            this.isExpenseSaving = false;
        }
    }

    confirmDeleteExpense(expense: Expense): void {
        this.confirmationService.confirm({
            header: 'Delete Expense',
            message: `Are you sure you want to delete "${expense.expenseTypeName}" from ${this.toActivityDatePath(expense.expenseDate)}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                void this.deleteExpense(expense.id);
            }
        });
    }

    private async deleteExpense(expenseId: number): Promise<void> {
        this.deletingExpenseId = expenseId;

        try {
            await firstValueFrom(this.generatorOwnerService.deleteExpense(expenseId));

            this.notificationService.success('Successful', 'Expense deleted.');
            this.loadInitialExpenses();
            this.loadFinanceDays();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to delete expense.');
        } finally {
            this.deletingExpenseId = null;
        }
    }

    loadFinanceDays(): void {
        if (this.financeDateRangeInvalid()) {
            this.notificationService.warn('Validation', 'Finance From Date cannot be after To Date.');
            return;
        }

        this.isFinanceDaysLoading = true;

        this.generatorOwnerService
            .getFinanceDays({
                dateFrom: this.toApiDate(this.financeFilters.dateFrom),
                dateTo: this.toApiDate(this.financeFilters.dateTo),
                trxType: this.financeFilters.trxType ?? undefined,
                currencyCode: this.financeFilters.currencyCode || this.defaultCurrencyCode
            })
            .pipe(finalize(() => (this.isFinanceDaysLoading = false)))
            .subscribe({
                next: (response: GetFinanceDaysResponse) => {
                    this.financeDays = response.days ?? [];
                    this.financeResponseCurrencyCode = response.currencyCode || this.financeFilters.currencyCode || this.defaultCurrencyCode;
                },
                error: (err) => {
                    console.log(err);
                    this.financeDays = [];
                    this.notificationService.warn('Failure', 'Failed to load finance days.');
                }
            });
    }

    resetFinanceFilters(): void {
        const range = this.currentMonthRange();
        this.financeFilters = {
            dateFrom: range.from,
            dateTo: range.to,
            trxType: null,
            currencyCode: this.defaultCurrencyCode
        };

        this.loadFinanceDays();
    }

    openFinanceDay(day: FinanceDaySummary): void {
        this.selectedFinanceDay = day;
        this.resetFinanceDayDetailState();
        this.isDayDetailDialogOpen = true;

        this.loadInitialFinanceDayDetail();
    }

    closeFinanceDayDetail(): void {
        this.isDayDetailDialogOpen = false;
        this.selectedFinanceDay = null;
    }

    private loadInitialFinanceDayDetail(): void {
        if (!this.selectedFinanceDay) return;

        this.isDayDetailLoading = true;

        this.fetchFinanceDayDetailPage(1)
            .pipe(finalize(() => (this.isDayDetailLoading = false)))
            .subscribe({
                next: () => this.ensureDayDetailDataFor(this.dayDetailFirst + this.dayDetailRows),
                error: (err) => {
                    console.log(err);
                    this.resetFinanceDayDetailState();
                    this.notificationService.warn('Failure', 'Failed to load finance day details.');
                }
            });
    }

    private fetchFinanceDayDetailPage(pageNumber: number) {
        if (!this.selectedFinanceDay) {
            throw new Error('Finance day detail requested without a selected day.');
        }

        this.isDayDetailLoadingMore = true;

        const activityDate = this.toActivityDatePath(this.selectedFinanceDay.activityDate);

        return this.generatorOwnerService
            .getFinanceDayDetail(activityDate, {
                trxType: this.financeFilters.trxType ?? undefined,
                currencyCode: this.financeFilters.currencyCode || this.defaultCurrencyCode,
                pageNumber,
                pageSize: this.dayDetailApiPageSize
            })
            .pipe(
                tap((response: GetFinanceDayDetailResponse) => {
                    const page = response.page;

                    if (!page) {
                        this.hasMoreDayDetailFromServer = false;
                        return;
                    }

                    const { items = [], pageNumber: apiPageNumber, pageSize, totalCount, hasNext } = page;

                    this.dayDetailSummary = response.summary ?? this.dayDetailSummary;
                    this.dayDetailTransactions = [...this.dayDetailTransactions, ...items];
                    this.currentDayDetailApiPage = apiPageNumber;

                    if (pageSize && pageSize > 0) {
                        this.dayDetailApiPageSize = pageSize;
                    }

                    this.dayDetailTotalRecords = totalCount;
                    this.hasMoreDayDetailFromServer = hasNext;
                }),
                finalize(() => (this.isDayDetailLoadingMore = false))
            );
    }

    private ensureDayDetailDataFor(targetIndex: number): void {
        if (targetIndex <= this.dayDetailTransactions.length) return;
        if (!this.hasMoreDayDetailFromServer || this.isDayDetailLoadingMore) return;

        const nextPageNumber = this.currentDayDetailApiPage < 1 ? 1 : this.currentDayDetailApiPage + 1;

        this.fetchFinanceDayDetailPage(nextPageNumber).subscribe({
            next: () => {
                if (targetIndex > this.dayDetailTransactions.length && this.hasMoreDayDetailFromServer) {
                    this.ensureDayDetailDataFor(targetIndex);
                }
            },
            error: (err) => {
                console.log(err);
                this.hasMoreDayDetailFromServer = false;
            }
        });
    }

    onDayDetailPage(event: { first?: number; rows?: number }): void {
        const oldRows = this.dayDetailRows;

        this.dayDetailFirst = event.first ?? this.dayDetailFirst;
        this.dayDetailRows = event.rows ?? this.dayDetailRows;

        if (event.rows != null && event.rows !== oldRows) {
            this.dayDetailFirst = 0;
        }

        this.ensureDayDetailDataFor(this.dayDetailFirst + this.dayDetailRows);
    }

    nextDayDetailPage(): void {
        if (this.isDayDetailLastPage()) return;

        this.dayDetailFirst += this.dayDetailRows;
        this.ensureDayDetailDataFor(this.dayDetailFirst + this.dayDetailRows);
    }

    prevDayDetailPage(): void {
        this.dayDetailFirst = Math.max(0, this.dayDetailFirst - this.dayDetailRows);
    }

    resetDayDetailPage(): void {
        this.dayDetailFirst = 0;
    }

    isDayDetailLastPage(): boolean {
        if (!this.dayDetailTotalRecords) return true;

        return this.dayDetailFirst + this.dayDetailRows >= this.dayDetailTotalRecords;
    }

    isDayDetailFirstPage(): boolean {
        return this.dayDetailFirst === 0;
    }

    expenseDateRangeInvalid(): boolean {
        return this.dateRangeInvalid(this.expenseFilters.dateFrom, this.expenseFilters.dateTo);
    }

    financeDateRangeInvalid(): boolean {
        return this.dateRangeInvalid(this.financeFilters.dateFrom, this.financeFilters.dateTo);
    }

    isInvalid(form: FormGroup, controlName: string, saving: boolean): boolean {
        const control = form.get(controlName);
        return !!(control?.invalid && (control.touched || saving));
    }

    hasAmountLbpWithoutExchangeRate(): boolean {
        const amountLBP = Number(this.expenseForm.get('amountLBP')?.value ?? 0);
        const exchangeRate = Number(this.expenseForm.get('exchangeRate')?.value ?? 0);

        return amountLBP > 0 && exchangeRate <= 0;
    }

    getTrxSeverity(type: FinanceTransactionType | string) {
        switch (type) {
            case 'CREDIT':
                return 'success';

            case 'DEBIT':
                return 'danger';

            default:
                return 'secondary';
        }
    }

    getNetAmountClass(amount: number): string {
        if (amount > 0) return 'text-green-600 dark:text-green-300';
        if (amount < 0) return 'text-red-600 dark:text-red-300';
        return 'text-color-secondary';
    }

    getTransactionAmountClass(transaction: FinanceTransaction): string {
        return transaction.trxType === 'CREDIT' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300';
    }

    private applyDefaultFilterDates(): void {
        const range = this.currentMonthRange();

        this.expenseFilters.dateFrom = range.from;
        this.expenseFilters.dateTo = range.to;
        this.financeFilters.dateFrom = new Date(range.from);
        this.financeFilters.dateTo = new Date(range.to);
    }

    private resetExpenseDataState(): void {
        this.expenses = [];
        this.currentExpenseApiPage = -1;
        this.hasMoreExpensesFromServer = true;
        this.expenseTotalRecords = 0;
        this.expenseFirst = 0;
        this.selectedExpenses = [];
    }

    private resetFinanceDayDetailState(): void {
        this.dayDetailTransactions = [];
        this.dayDetailSummary = null;
        this.currentDayDetailApiPage = -1;
        this.hasMoreDayDetailFromServer = true;
        this.dayDetailTotalRecords = 0;
        this.dayDetailFirst = 0;
    }

    private ensureSelectedCurrencies(): void {
        const hasDefault = this.currencies.some((currency) => currency.value === this.defaultCurrencyCode);
        const fallback = hasDefault ? this.defaultCurrencyCode : (this.currencies[0]?.value ?? this.defaultCurrencyCode);

        if (!this.financeFilters.currencyCode) {
            this.financeFilters.currencyCode = fallback;
        }

        if (!this.expenseForm.get('currencyCode')?.value) {
            this.expenseForm.patchValue({ currencyCode: fallback });
        }
    }

    private toApiDate(date: Date | null): string | undefined {
        if (!date) return undefined;

        return formatDate(date, 'yyyy-MM-dd', this.locale);
    }

    private toActivityDatePath(value: string): string {
        return formatDate(value, 'yyyy-MM-dd', this.locale);
    }

    private toDate(value: string): Date {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return new Date();
        }

        return date;
    }

    private toOptionalString(value: unknown): string | null {
        const text = String(value ?? '').trim();

        return text.length > 0 ? text : null;
    }

    private dateRangeInvalid(from: Date | null, to: Date | null): boolean {
        if (!from || !to) return false;

        return from > to;
    }

    private currentMonthRange(): { from: Date; to: Date } {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return { from, to };
    }

    get visibleDayDetailTransactions(): FinanceTransaction[] {
        return this.dayDetailTransactions.slice(this.dayDetailFirst, this.dayDetailFirst + this.dayDetailRows);
    }
}
