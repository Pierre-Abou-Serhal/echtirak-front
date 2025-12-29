import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-bill-edit-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputNumberModule, TextareaModule, InputText],
    templateUrl: './bill-edit-modal.component.html',
    styleUrl: './bill-edit-modal.component.scss'
})
export class BillEditModalComponent implements OnChanges {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() bill: any | null = null;

    @Output() save = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    editableBill: any | null = null;
    submitted = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['bill'] || changes['visible']) {
            if (this.visible && this.bill) {
                this.submitted = false;
                this.editableBill = this.clone(this.bill);

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

        // Normalize notes
        this.editableBill.notes = (this.editableBill.notes ?? '').toString();

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
}
