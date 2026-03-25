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
    id?: number | null; // existing row id (if your backend uses it)
    extraFeeId?: number | null; // ✅ master extra fee id (from /ExtraFees)
    extraFeeName?: string | null; // display name (derived from catalog)
    amount?: number | null; // USD
    amountLBP?: string | null; // LBP (string as in your interface)
    _key: string; // local unique key for @for tracking
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

    // Extra fees behavior switches (set by parent)
    @Input() extraFeesEditable = false; // preview => true, list => false
    @Input() requireExtraFeeAmounts = false; // preview => true, list => false

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    editableBill: any | null = null;
    submitted = false;
    billPeriod: Date | null = null;

    // Extra fee catalog
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
        if (changes['bill'] || changes['visible']) {
            if (this.visible && this.bill) {
                this.submitted = false;
                this.editableBill = this.clone(this.bill);

                // period
                this.billPeriod = this.toBillPeriodDate(this.editableBill.billYear, this.editableBill.billMonth);

                // notes safe
                if (this.editableBill.notes == null) this.editableBill.notes = '';

                // ensure extraFees array exists
                if (!Array.isArray(this.editableBill.extraFees)) {
                    this.editableBill.extraFees = this.extraFeesEditable ? [] : (this.editableBill.extraFees ?? []);
                }

                // normalize extraFees rows + add stable _key
                this.editableBill.extraFees = (this.editableBill.extraFees as any[]).map((f, idx) => {
                    // Prefer stable key from existing row id; fallback to generated key
                    const keyFromRowId = f?.id != null && String(f.id).trim() !== '' ? `row_${String(f.id)}` : null;

                    // Try to infer extraFeeId from the incoming object:
                    // - best: f.extraFeeId
                    // - fallback: if the incoming object is actually the master fee, it may have id but no extraFeeId
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

    // =============================
    // Dialog controls
    // =============================
    close(): void {
        this.visibleChange.emit(false);
        this.cancel.emit();
    }

    submit(): void {
        this.submitted = true;
        if (!this.editableBill) return;

        // Bill period required
        const ym = getBillYearMonth(this.billPeriod);
        if (!ym) return;

        // normalize fields
        this.editableBill.notes = (this.editableBill.notes ?? '').toString();
        this.editableBill.billYear = ym.billYear;
        this.editableBill.billMonth = ym.billMonth;

        // overwrite billDate (your current behavior)
        this.editableBill.billDate = formatDate(new Date(), 'yyyy-MM-dd', this.locale);

        // validate other bill fields
        if (this.isCurrentKvaInvalid() || this.isAmountInvalid()) return;

        // normalize extraFees rows
        if (Array.isArray(this.editableBill.extraFees)) {
            this.editableBill.extraFees = (this.editableBill.extraFees as EditableExtraFee[])
                // trim names if present
                .map((f) => ({
                    ...f,
                    extraFeeName: (f.extraFeeName ?? '').toString().trim()
                }))
                // remove completely empty rows (user added then left blank)
                .filter((f) => !(f.extraFeeId == null && this.toNumberOrNull(f.amount) == null));
        }

        // validate extra fees only when editable
        if (this.extraFeesEditable && !this.validateExtraFees()) return;

        // Persist computed amountLBP into row before emitting (if exchangeRate exists)
        if (this.extraFeesEditable && Array.isArray(this.editableBill.extraFees)) {
            const rate = this.toNumberOrNull(this.editableBill.exchangeRate);
            if (rate != null) {
                for (const f of this.editableBill.extraFees as EditableExtraFee[]) {
                    const usd = this.toNumberOrNull(f.amount);
                    // store as string (your interface amountLBP?: string)
                    f.amountLBP = usd == null ? null : String(Math.round(usd * rate));
                }
            }
        }

        // Ensure extraFeeName is set from catalog for selected ids (good for UI + backend logs)
        this.hydrateExtraFeesFromCatalog();

        // Strip _key before emitting (backend doesn’t want it)
        if (Array.isArray(this.editableBill.extraFees)) {
            this.editableBill.extraFees = (this.editableBill.extraFees as EditableExtraFee[]).map(({ _key, ...rest }) => rest);
        }

        this.save.emit(this.editableBill);
        this.visibleChange.emit(false);
    }

    // =============================
    // Bill validation (your existing logic)
    // =============================
    isCurrentKvaInvalid(): boolean {
        if (!this.editableBill) return false;

        const prev = this.toNumberOrNull(this.editableBill.previousKva);
        const curr = this.toNumberOrNull(this.editableBill.currentKva);

        // keep your behavior: if missing => invalid
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
            if (f?.id != null) byId.set(f.id, f);
        }

        for (const row of this.editableBill.extraFees as EditableExtraFee[]) {
            // If row has extraFeeId -> set name from catalog
            if (row.extraFeeId != null) {
                const found = byId.get(row.extraFeeId);
                if (found) row.extraFeeName = (found.name ?? found.extraFeeName ?? row.extraFeeName ?? '').toString();
            } else if (row.extraFeeName) {
                // If row only has name -> try to match to get id
                const match = this.availableExtraFees.find((x) => (x.name ?? x.extraFeeName ?? '').toLowerCase() === row.extraFeeName!.toLowerCase());
                if (match?.id != null) row.extraFeeId = match.id;
            }
        }
    }

    // Prevent selecting the same fee twice: filter options per row
    getExtraFeeOptionsForRow(row: EditableExtraFee) {
        const used = new Set<number>(
            (this.editableBill?.extraFees ?? [])
                .filter((x: EditableExtraFee) => x._key !== row._key)
                .map((x: EditableExtraFee) => x.extraFeeId)
                .filter((id: any) => id != null) as number[]
        );

        return this.extraFeeOptions.filter((opt) => !used.has(opt.value) || opt.value === row.extraFeeId);
    }

    onExtraFeeSelected(row: EditableExtraFee, selectedId: number | null) {
        row.extraFeeId = selectedId ?? null;

        const found = this.availableExtraFees.find((x) => x.id === row.extraFeeId);
        row.extraFeeName = (found?.name ?? found?.extraFeeName ?? null)?.toString() ?? null;
    }

    addExtraFee(): void {
        if (!this.editableBill) return;
        if (!Array.isArray(this.editableBill.extraFees)) this.editableBill.extraFees = [];

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
        // mandatory => must be provided; allow 0 as valid
        return amt == null || amt <= 0;
    }

    // LBP display: computed if rate exists, else fallback to stored amountLBP
    calcExtraFeeLbp(row: EditableExtraFee): number | null {
        if (!this.editableBill) return null;

        const rate = this.toNumberOrNull(this.editableBill.exchangeRate);
        const usd = this.toNumberOrNull(row?.amount);
        const stored = this.toNumberOrNull(row?.amountLBP);

        if (rate != null && usd != null) return usd * rate;
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

        // fee selection required if there is any row
        if (list.some((f) => this.isExtraFeeSelectionInvalid(f))) return false;

        // amounts required only if requireExtraFeeAmounts=true
        if (this.requireExtraFeeAmounts && list.some((f) => this.isExtraFeeAmountInvalid(f))) return false;

        return true;
    }

    // =============================
    // Utilities
    // =============================
    private toNumberOrNull(v: any): number | null {
        if (v === null || v === undefined || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }

    private clone<T>(obj: T): T {
        if (typeof structuredClone === 'function') return structuredClone(obj);
        return JSON.parse(JSON.stringify(obj));
    }

    private toBillPeriodDate(year: any, month: any): Date | null {
        const y = Number(year);
        const m = Number(month); // 1..12 expected
        if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
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
