import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { getBillYearMonth } from '@/core/utils/utils';

@Component({
    selector: 'app-bill-edit-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputNumberModule, TextareaModule, InputText, DatePicker],
    templateUrl: './bill-edit-modal.component.html',
    styleUrl: './bill-edit-modal.component.scss'
})
export class BillEditModalComponent implements OnChanges {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() bill: any | null = null;

    @Input() isBillPeriodDisabled: boolean = false;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    editableBill: any | null = null;
    submitted = false;

    billPeriod: Date | null = null;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['bill'] || changes['visible']) {
            if (this.visible && this.bill) {
                this.submitted = false;
                this.editableBill = this.clone(this.bill);

                this.billPeriod = this.toBillPeriodDate(this.editableBill.billYear, this.editableBill.billMonth);

                // Ensure notes is not null/undefined for binding
                if (this.editableBill.notes == null) this.editableBill.notes = '';
            }
        }
    }

    close(): void {
        this.visibleChange.emit(false);
        this.cancel.emit();
    }

    submit(): void {
        this.submitted = true;

        if (!this.editableBill) return;

        // Require bill period
        const ym = getBillYearMonth(this.billPeriod);

        if (!ym) return;

        // Normalize notes
        this.editableBill.notes = (this.editableBill.notes ?? '').toString();

        // Bill year + Month
        this.editableBill.billYear = ym.billYear;
        this.editableBill.billMonth = ym.billMonth;

        // Bill Date will be overwritten by today's date
        this.editableBill.billDate = formatDate(new Date(), 'yyyy-MM-dd', this.locale);

        if (this.isCurrentKvaInvalid() || this.isAmountInvalid()) {
            return; // keep dialog open
        }

        this.save.emit(this.editableBill);
        this.visibleChange.emit(false);
    }

    isCurrentKvaInvalid(): boolean {
        if (!this.editableBill) return false;

        const prev = this.toNumberOrNull(this.editableBill.previousKva);
        const curr = this.toNumberOrNull(this.editableBill.currentKva);

        // If either is missing, we won't compare; you can make curr required if you want.
        if (prev == null || curr == null) return true;

        return curr < prev;
    }

    isAmountInvalid(): boolean {
        if (!this.editableBill) return false;

        const amt = this.toNumberOrNull(this.editableBill.amount);
        return amt == null || amt < 0;
    }

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
        return new Date(y, m - 1, 1); // first day of that month
    }

}
