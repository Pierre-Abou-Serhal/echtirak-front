import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, inject, DestroyRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

import { ExtraFee } from '@/core/models/model';
import { getBillYearMonth } from '@/core/utils/utils';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';
import { UserContextService } from '@/core/services/user-context.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type EditableExtraFee = {
    id?: number | null;
    extraFeeId?: number | null;
    extraFeeName?: string | null;
    amount?: number | null;
    amountLBP?: string | null;
    _key: string;
};

@Component({
    selector: 'app-bill-edit-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputNumberModule, TextareaModule, InputText, DatePicker, Select],
    templateUrl: './bill-edit-modal.component.html',
    styleUrl: './bill-edit-modal.component.scss'
})
export class BillEditModalComponent implements OnInit, OnChanges {
    private readonly destroyRef = inject(DestroyRef);
    private readonly userContext = inject(UserContextService);

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() bill: any | null = null;
    @Input() isBillPeriodDisabled = false;

    @Input() extraFeesEditable = false;
    @Input() requireExtraFeeAmounts = false;

    @Input() readOnly = false;

    /**
     * Enable this only when the edit modal is opened from BillsPreviewComponent
     * inside Custom Bill Generation.
     */
    @Input() customKwhReadingMode = false;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    editableBill: any | null = null;
    submitted = false;
    billPeriod: Date | null = null;

    /**
     * UI-only field used only for Custom Bill Generation + Metered bills.
     */
    customCurrentKvaReading: number | null = null;

    /**
     * Stable base reading used in Custom Bill Generation.
     */
    customKwhBasePreviousKva: number | null = null;

    availableExtraFees: ExtraFee[] = [];
    extraFeeOptions: { label: string; value: number }[] = [];
    isExtraFeesLoading = false;

    private extraFeeKeySeq = 0;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    ngOnInit(): void {
        this.userContext.generatorOwnerExtraFees$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fees) => {
            this.availableExtraFees = fees;

            this.extraFeeOptions = fees
                .filter((x) => x?.id != null && (x.isActive ?? true))
                .map((x) => ({
                    value: x.id!,
                    label: (x.name ?? x.extraFeeName ?? `Fee #${x.id}`).toString()
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            this.hydrateExtraFeesFromCatalog();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['bill'] || changes['visible'] || changes['customKwhReadingMode']) {
            if (this.visible && this.bill) {
                this.submitted = false;
                this.editableBill = this.clone(this.bill);

                this.billPeriod = this.toBillPeriodDate(this.editableBill.billYear, this.editableBill.billMonth);

                this.initializeCustomKwhReadingState();

                if (this.editableBill.notes == null) {
                    this.editableBill.notes = '';
                }

                if (!Array.isArray(this.editableBill.extraFees)) {
                    this.editableBill.extraFees = this.extraFeesEditable ? [] : (this.editableBill.extraFees ?? []);
                }

                this.editableBill.extraFees = (this.editableBill.extraFees as any[]).map((f, idx) => {
                    const keyFromRowId = f?.id != null && String(f.id).trim() !== '' ? `row_${String(f.id)}` : null;

                    const inferredExtraFeeId = f?.extraFeeId ?? null;

                    return {
                        id: f?.id ?? null,
                        extraFeeId: inferredExtraFeeId,
                        extraFeeName: f?.extraFeeName ?? f?.name ?? null,
                        amount: this.toNumberOrNull(f?.amount),
                        amountLBP: f?.amountLBP ?? null,
                        _key: keyFromRowId ?? `idx_${idx}_${this.newExtraFeeKey()}`
                    } as EditableExtraFee;
                });

                this.hydrateExtraFeesFromCatalog();
            }
        }
    }

    close(): void {
        this.visibleChange.emit(false);
        this.cancel.emit();
    }

    submit(): void {
        if (this.readOnly) {
            this.close();
            return;
        }

        this.submitted = true;

        if (!this.editableBill) return;

        const ym = getBillYearMonth(this.billPeriod);
        if (!ym) return;

        this.editableBill.notes = (this.editableBill.notes ?? '').toString();
        this.editableBill.billYear = ym.billYear;
        this.editableBill.billMonth = ym.billMonth;
        this.editableBill.billDate = formatDate(new Date(), 'yyyy-MM-dd', this.locale);

        if (this.shouldUseCustomKwhReading) {
            if (this.isCustomCurrentKvaReadingInvalid()) return;
            this.applyCustomKwhReadingToEditableBill();
        } else {
            this.recalculateMeteredBillAmount();
        }

        if (this.isCurrentKvaInvalid() || this.isAmountInvalid()) return;

        if (Array.isArray(this.editableBill.extraFees)) {
            this.editableBill.extraFees = (this.editableBill.extraFees as EditableExtraFee[])
                .map((f) => ({
                    ...f,
                    extraFeeName: (f.extraFeeName ?? '').toString().trim()
                }))
                .filter((f) => !(f.extraFeeId == null && this.toNumberOrNull(f.amount) == null));
        }

        if (this.extraFeesEditable && !this.validateExtraFees()) return;

        if (this.extraFeesEditable && Array.isArray(this.editableBill.extraFees)) {
            const rate = this.toNumberOrNull(this.editableBill.exchangeRate);

            if (rate != null) {
                for (const f of this.editableBill.extraFees as EditableExtraFee[]) {
                    const usd = this.toNumberOrNull(f.amount);
                    f.amountLBP = usd == null ? null : String(Math.round(usd * rate));
                }
            }
        }

        this.hydrateExtraFeesFromCatalog();

        if (Array.isArray(this.editableBill.extraFees)) {
            this.editableBill.extraFees = (this.editableBill.extraFees as EditableExtraFee[]).map(({ _key, ...rest }) => rest);
        }

        this.save.emit(this.editableBill);
        this.visibleChange.emit(false);
    }

    get shouldUseCustomKwhReading(): boolean {
        return this.customKwhReadingMode && this.isMeteredBillingModel;
    }

    get isMeteredBillingModel(): boolean {
        if (!this.editableBill) return false;

        const billingModel = (this.editableBill.billingModel ?? '').toString().trim().toUpperCase();

        if (billingModel) {
            return billingModel.includes('METERED');
        }

        const amountPerKva = this.toNumberOrNull(this.editableBill.amountPerKva);

        return amountPerKva != null && amountPerKva > 0;
    }

    isCurrentKvaInvalid(): boolean {
        if (!this.editableBill) return false;

        if (this.shouldUseCustomKwhReading) {
            return this.isCustomCurrentKvaReadingInvalid();
        }

        /**
         * In Custom Bill Generation, fixed bills do not require KWH readings.
         */
        if (this.customKwhReadingMode && !this.isMeteredBillingModel) {
            return false;
        }

        const prev = this.toNumberOrNull(this.editableBill.previousKva);
        const curr = this.toNumberOrNull(this.editableBill.currentKva);

        if (prev == null || curr == null) return true;

        return curr < prev;
    }

    isAmountInvalid(): boolean {
        if (!this.editableBill) return false;

        const amt = this.toNumberOrNull(this.editableBill.amount);

        return amt == null || amt < 0;
    }

    private hydrateExtraFeesFromCatalog(): void {
        if (!this.editableBill?.extraFees?.length) return;
        if (!this.availableExtraFees?.length) return;

        const byId = new Map<number, ExtraFee>();

        for (const f of this.availableExtraFees) {
            if (f?.id != null) {
                byId.set(f.id, f);
            }
        }

        for (const row of this.editableBill.extraFees as EditableExtraFee[]) {
            if (row.extraFeeId != null) {
                const found = byId.get(row.extraFeeId);

                if (found) {
                    row.extraFeeName = (found.name ?? found.extraFeeName ?? row.extraFeeName ?? '').toString();
                }
            } else if (row.extraFeeName) {
                const match = this.availableExtraFees.find((x) => (x.name ?? x.extraFeeName ?? '').toLowerCase() === row.extraFeeName!.toLowerCase());

                if (match?.id != null) {
                    row.extraFeeId = match.id;
                }
            }
        }
    }

    getExtraFeeOptionsForRow(row: EditableExtraFee) {
        const used = new Set<number>(
            (this.editableBill?.extraFees ?? [])
                .filter((x: EditableExtraFee) => x._key !== row._key)
                .map((x: EditableExtraFee) => x.extraFeeId)
                .filter((id: any) => id != null) as number[]
        );

        return this.extraFeeOptions.filter((opt) => !used.has(opt.value) || opt.value === row.extraFeeId);
    }

    onExtraFeeSelected(row: EditableExtraFee, selectedId: number | null): void {
        row.extraFeeId = selectedId ?? null;

        const found = this.availableExtraFees.find((x) => x.id === row.extraFeeId);

        row.extraFeeName = (found?.name ?? found?.extraFeeName ?? null)?.toString() ?? null;
    }

    addExtraFee(): void {
        if (!this.editableBill) return;

        if (!Array.isArray(this.editableBill.extraFees)) {
            this.editableBill.extraFees = [];
        }

        const row: EditableExtraFee = {
            id: null,
            extraFeeId: null,
            extraFeeName: null,
            amount: null,
            amountLBP: null,
            _key: this.newExtraFeeKey()
        };

        this.editableBill.extraFees.push(row);
    }

    removeExtraFee(key: string): void {
        if (!this.editableBill?.extraFees) return;

        this.editableBill.extraFees = (this.editableBill.extraFees as EditableExtraFee[]).filter((x) => x._key !== key);
    }

    isExtraFeeSelectionInvalid(row: EditableExtraFee): boolean {
        return row.extraFeeId == null;
    }

    isExtraFeeAmountInvalid(row: EditableExtraFee): boolean {
        const amt = this.toNumberOrNull(row?.amount);

        return amt == null || amt <= 0;
    }

    calcExtraFeeLbp(row: EditableExtraFee): number | null {
        if (!this.editableBill) return null;

        const rate = this.toNumberOrNull(this.editableBill.exchangeRate);
        const usd = this.toNumberOrNull(row?.amount);
        const stored = this.toNumberOrNull(row?.amountLBP);

        if (rate != null && usd != null) {
            return usd * rate;
        }

        return stored;
    }

    getExtraFeesTotalUsd(bill: any): number {
        return (bill?.extraFees ?? []).reduce((sum: number, f: any) => sum + (Number(f?.amount) || 0), 0);
    }

    getExtraFeesTotalLbp(bill: any): number {
        return (bill?.extraFees ?? []).reduce((sum: number, f: any) => sum + (this.calcExtraFeeLbp(f) ?? 0), 0);
    }

    private validateExtraFees(): boolean {
        const list: EditableExtraFee[] = this.editableBill?.extraFees ?? [];

        if (list.length === 0) return true;

        if (list.some((f) => this.isExtraFeeSelectionInvalid(f))) {
            return false;
        }

        if (this.requireExtraFeeAmounts && list.some((f) => this.isExtraFeeAmountInvalid(f))) {
            return false;
        }

        return true;
    }

    onCurrentKvaChanged(): void {
        if (this.readOnly) return;

        this.recalculateMeteredBillAmount();
    }

    onCustomCurrentKvaReadingChanged(): void {
        if (this.readOnly || !this.shouldUseCustomKwhReading) return;

        this.recalculateMeteredBillAmountFromCustomReading();
    }

    isCustomCurrentKvaReadingInvalid(): boolean {
        if (!this.shouldUseCustomKwhReading) return false;

        const basePreviousKva = this.getCustomKwhBasePreviousKva();
        const currentKvaReading = this.toNumberOrNull(this.customCurrentKvaReading);

        if (basePreviousKva == null || currentKvaReading == null) {
            return true;
        }

        return currentKvaReading < basePreviousKva;
    }

    private initializeCustomKwhReadingState(): void {
        if (!this.editableBill) {
            this.customCurrentKvaReading = null;
            this.customKwhBasePreviousKva = null;
            return;
        }

        if (!this.shouldUseCustomKwhReading) {
            this.customCurrentKvaReading = null;
            this.customKwhBasePreviousKva = null;
            return;
        }

        this.customKwhBasePreviousKva = this.toNumberOrNull(this.editableBill.customKwhBasePreviousKva) ?? this.toNumberOrNull(this.editableBill.currentKva) ?? this.toNumberOrNull(this.editableBill.previousKva);

        this.customCurrentKvaReading = this.toNumberOrNull(this.editableBill.customCurrentKvaReading) ?? (this.editableBill.customKwhReadingProvided ? this.toNumberOrNull(this.editableBill.currentKva) : null);

        this.recalculateMeteredBillAmountFromCustomReading();
    }

    private getCustomKwhBasePreviousKva(): number | null {
        return this.customKwhBasePreviousKva ?? this.toNumberOrNull(this.editableBill?.currentKva);
    }

    private applyCustomKwhReadingToEditableBill(): void {
        if (!this.editableBill || !this.shouldUseCustomKwhReading) return;

        const basePreviousKva = this.getCustomKwhBasePreviousKva();
        const currentKvaReading = this.toNumberOrNull(this.customCurrentKvaReading);

        if (basePreviousKva == null || currentKvaReading == null) return;

        this.editableBill.customKwhBasePreviousKva = basePreviousKva;
        this.editableBill.customCurrentKvaReading = currentKvaReading;
        this.editableBill.customKwhReadingProvided = true;

        this.editableBill.previousKva = basePreviousKva;
        this.editableBill.currentKva = currentKvaReading;

        this.recalculateMeteredBillAmount();
    }

    private recalculateMeteredBillAmountFromCustomReading(): void {
        if (!this.editableBill || !this.shouldUseCustomKwhReading) return;

        const basePreviousKva = this.getCustomKwhBasePreviousKva();
        const currentKvaReading = this.toNumberOrNull(this.customCurrentKvaReading);

        if (basePreviousKva == null || currentKvaReading == null || currentKvaReading < basePreviousKva) {
            return;
        }

        this.recalculateMeteredBillAmount(basePreviousKva, currentKvaReading);
    }

    private recalculateMeteredBillAmount(previousKvaOverride?: number, currentKvaOverride?: number): void {
        if (!this.editableBill) return;

        const previousKva = previousKvaOverride ?? this.toNumberOrNull(this.editableBill.previousKva);

        const currentKva = currentKvaOverride ?? this.toNumberOrNull(this.editableBill.currentKva);

        const amountPerKva = this.toNumberOrNull(this.editableBill.amountPerKva);
        const subscriptionFeeFixed = this.toNumberOrNull(this.editableBill.subscriptionFeeFixed) ?? 0;

        if (amountPerKva == null || amountPerKva <= 0) {
            return;
        }

        if (previousKva == null || currentKva == null) {
            return;
        }

        if (currentKva < previousKva) {
            return;
        }

        const consumedKva = currentKva - previousKva;
        const kvaFee = consumedKva * amountPerKva;
        const totalAmount = kvaFee + subscriptionFeeFixed;

        this.editableBill.kvaFee = this.roundToFourDecimals(kvaFee);
        this.editableBill.amount = this.roundToFourDecimals(totalAmount);
    }

    private roundToFourDecimals(value: number): number {
        return Math.round((value + Number.EPSILON) * 10000) / 10000;
    }

    private toNumberOrNull(v: any): number | null {
        if (v === null || v === undefined || v === '') return null;

        const n = Number(v);

        return Number.isFinite(n) ? n : null;
    }

    private clone<T>(obj: T): T {
        if (typeof structuredClone === 'function') {
            return structuredClone(obj);
        }

        return JSON.parse(JSON.stringify(obj));
    }

    private toBillPeriodDate(year: any, month: any): Date | null {
        const y = Number(year);
        const m = Number(month);

        if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
            return null;
        }

        return new Date(y, m - 1, 1);
    }

    private newExtraFeeKey(): string {
        this.extraFeeKeySeq += 1;

        return `xef_${Date.now()}_${this.extraFeeKeySeq}`;
    }

    getOverlayOptions(): OverlayOptions {
        return {
            listener: (event: Event, options?: OverlayListenerOptions) => {
                if (options?.type === 'scroll') {
                    return false;
                }

                return options?.valid;
            }
        };
    }
}
