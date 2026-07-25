import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { BillCollectorBillingPeriod, BillCollectorBillingPeriodService } from '@/core/services/bill-collector-billing-period.service';

@Component({
    selector: 'app-billing-period-dialog',
    standalone: true,
    imports: [FormsModule, Button, DatePicker],
    templateUrl: './billing-period-dialog.component.html'
})
export class BillingPeriodDialogComponent {
    private readonly dialogRef = inject(DynamicDialogRef);

    readonly billingPeriodService = inject(BillCollectorBillingPeriodService);

    selectedDate: Date;

    constructor() {
        const storedDate = this.billingPeriodService.date();
        const initialDate = storedDate ?? new Date();

        this.selectedDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
    }

    get selectedPeriodLabel(): string {
        const year = this.selectedDate.getFullYear();

        const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');

        return `${year}/${month}`;
    }

    get isSelectedPeriodCurrentMonth(): boolean {
        const today = new Date();

        return this.selectedDate.getFullYear() === today.getFullYear() && this.selectedDate.getMonth() === today.getMonth();
    }

    save(): void {
        if (!this.selectedDate) return;

        const period: BillCollectorBillingPeriod = this.billingPeriodService.setFromDate(this.selectedDate);

        this.dialogRef.close(period);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}
