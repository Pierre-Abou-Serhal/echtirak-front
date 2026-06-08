import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Accounting } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { clampPercent, formatMoney, formatPercent } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-accounting-panel',
    standalone: true,
    imports: [CommonModule, Card, Message, ProgressBar, Skeleton],
    templateUrl: './dashboard-v2-accounting-panel.component.html',
    styleUrl: './dashboard-v2-accounting-panel.component.scss'
})
export class DashboardV2AccountingPanelComponent {
    @Input() data?: DashboardV2Accounting;
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    readonly clampPercent = clampPercent;

    get metrics(): DashboardV2Metric[] {
        return [
            { label: 'Invoiced Amount', value: formatMoney(this.data?.invoicedAmount, this.currencyCode), severity: 'info' },
            { label: 'Collected Amount', value: formatMoney(this.data?.collectedAmount, this.currencyCode), severity: 'success' },
            { label: 'Outstanding Amount', value: formatMoney(this.data?.outstandingAmount, this.currencyCode), severity: 'warn' },
            { label: 'Overdue Amount', value: formatMoney(this.data?.overdueAmount, this.currencyCode), severity: 'danger' },
            { label: 'Collected By GO', value: formatMoney(this.data?.collectedByGoAmount, this.currencyCode), severity: 'success' },
            { label: 'Collected Via BC', value: formatMoney(this.data?.collectedViaBcAmount, this.currencyCode), severity: 'info' },
            { label: 'Pending With Collectors', value: formatMoney(this.data?.pendingWithCollectorsAmount, this.currencyCode), severity: 'warn' },
            { label: 'Collection Rate', value: formatPercent(this.data?.collectionRate), severity: 'info' }
        ];
    }
}
