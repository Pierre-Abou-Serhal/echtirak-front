import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Consumption } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { formatMoney, formatNumber } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-consumption-panel',
    standalone: true,
    imports: [CommonModule, Card, Message, Skeleton],
    templateUrl: './dashboard-v2-consumption-panel.component.html',
    styleUrl: './dashboard-v2-consumption-panel.component.scss'
})
export class DashboardV2ConsumptionPanelComponent {
    @Input() data?: DashboardV2Consumption;
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    get metrics(): DashboardV2Metric[] {
        return [
            { label: 'Total KWH', value: formatNumber(this.data?.totalKwh), icon: 'pi pi-bolt', severity: 'info' },
            { label: 'Average KWH / Subscriber', value: formatNumber(this.data?.averageKwhPerSubscriber), icon: 'pi pi-chart-line', severity: 'secondary' },
            // { label: 'Total Fixed KWH', value: formatNumber(this.data?.totalFixedKwh), icon: 'pi pi-lock', severity: 'info' },
            // { label: 'Total Metered KWH', value: formatNumber(this.data?.totalMeteredKwh), icon: 'pi pi-gauge', severity: 'info' },
            // { label: 'Combined KWH', value: formatNumber(this.data?.combinedKwh), icon: 'pi pi-sliders-h', severity: 'success' },
            { label: 'Estimated Cost', value: formatMoney(this.data?.estimatedConsumptionCost, this.currencyCode), icon: 'pi pi-dollar', severity: 'warn' }
        ];
    }
}
