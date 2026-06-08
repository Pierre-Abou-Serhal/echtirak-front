import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Overview } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { clampPercent, formatMoney, formatNumber, formatPercent } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-overview-panel',
    standalone: true,
    imports: [CommonModule, Card, Message, ProgressBar, Skeleton],
    templateUrl: './dashboard-v2-overview-panel.component.html',
    styleUrl: './dashboard-v2-overview-panel.component.scss'
})
export class DashboardV2OverviewPanelComponent {
    @Input() data?: DashboardV2Overview;
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    readonly clampPercent = clampPercent;

    get metrics(): DashboardV2Metric[] {
        return [
            { label: 'Total Subscribers', value: formatNumber(this.data?.totalSubscribers), icon: 'pi pi-users' },
            { label: 'Active Subscribers', value: formatNumber(this.data?.activeSubscribers), icon: 'pi pi-user-plus', severity: 'success' },
            { label: 'Inactive Subscribers', value: formatNumber(this.data?.inactiveSubscribers), icon: 'pi pi-user-minus', severity: 'secondary' },
            { label: 'New Subscribers', value: formatNumber(this.data?.newSubscribersInRange), icon: 'pi pi-sparkles', severity: 'info' },
            { label: 'Total Generators', value: formatNumber(this.data?.totalGenerators), icon: 'pi pi-bolt' },
            { label: 'Total Bills', value: formatNumber(this.data?.totalBills), icon: 'pi pi-file' },
            { label: 'Paid Bills', value: formatNumber(this.data?.paidBills), icon: 'pi pi-check-circle', severity: 'success' },
            { label: 'Pending Bills', value: formatNumber(this.data?.pendingBills), icon: 'pi pi-clock', severity: 'warn' },
            { label: 'Overdue Bills', value: formatNumber(this.data?.overdueBills), icon: 'pi pi-exclamation-triangle', severity: 'danger' },
            { label: 'Invoiced Amount', value: formatMoney(this.data?.invoicedAmount, this.currencyCode), icon: 'pi pi-receipt' },
            { label: 'Collected Amount', value: formatMoney(this.data?.collectedAmount, this.currencyCode), icon: 'pi pi-wallet', severity: 'success' },
            { label: 'Outstanding Amount', value: formatMoney(this.data?.outstandingAmount, this.currencyCode), icon: 'pi pi-hourglass', severity: 'warn' },
            { label: 'Collection Rate', value: formatPercent(this.data?.collectionRate), icon: 'pi pi-percentage', severity: 'info' },
            { label: 'Average Bill', value: formatMoney(this.data?.averageBillAmount, this.currencyCode), icon: 'pi pi-calculator' }
        ];
    }
}
