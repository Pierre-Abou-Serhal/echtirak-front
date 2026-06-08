import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Card } from 'primeng/card';
import { UIChart } from 'primeng/chart';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Bills } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { formatMoney, formatNumber } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-bills-panel',
    standalone: true,
    imports: [CommonModule, Card, UIChart, Message, Skeleton],
    templateUrl: './dashboard-v2-bills-panel.component.html',
    styleUrl: './dashboard-v2-bills-panel.component.scss'
})
export class DashboardV2BillsPanelComponent implements OnChanges {
    @Input() data?: DashboardV2Bills;
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    metrics: DashboardV2Metric[] = [];

    billTypeChartData: any;
    statusChartData: any;

    readonly chartOptions: any = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['currencyCode']) {
            this.buildMetrics();
            this.buildCharts();
        }
    }

    private buildMetrics(): void {
        this.metrics = [
            { label: 'Cancelled Bills', value: formatNumber(this.data?.cancelledBills), severity: 'secondary' },
            { label: 'Invoiced Amount', value: formatMoney(this.data?.invoicedAmount, this.currencyCode), severity: 'info' },
            { label: 'Paid Amount', value: formatMoney(this.data?.paidAmount, this.currencyCode), severity: 'success' },
            { label: 'Pending Amount', value: formatMoney(this.data?.pendingAmount, this.currencyCode), severity: 'warn' },
            { label: 'Overdue Amount', value: formatMoney(this.data?.overdueAmount, this.currencyCode), severity: 'danger' },
            { label: 'Total Extra Fees', value: formatMoney(this.data?.totalExtraFeesAmount, this.currencyCode), severity: 'info' },
            { label: 'Average Extra Fees', value: formatMoney(this.data?.averageExtraFeesAmount, this.currencyCode), severity: 'secondary' },
            { label: 'Average Bill', value: formatMoney(this.data?.averageBillAmount, this.currencyCode), severity: 'secondary' },
            {
                label: 'Fixed Bills',
                value: `${formatNumber(this.data?.fixed?.count)} / ${formatMoney(this.data?.fixed?.amount, this.currencyCode)}`,
                severity: 'info'
            },
            {
                label: 'Metered Bills',
                value: `${formatNumber(this.data?.metered?.count)} / ${formatMoney(this.data?.metered?.amount, this.currencyCode)}`,
                severity: 'info'
            }
        ];
    }

    private buildCharts(): void {
        this.billTypeChartData = {
            labels: ['Fixed', 'Metered'],
            datasets: [
                {
                    data: [this.data?.fixed?.count ?? 0, this.data?.metered?.count ?? 0]
                }
            ]
        };

        this.statusChartData = {
            labels: ['Paid', 'Pending', 'Overdue'],
            datasets: [
                {
                    data: [this.data?.paidAmount ?? 0, this.data?.pendingAmount ?? 0, this.data?.overdueAmount ?? 0]
                }
            ]
        };
    }
}
