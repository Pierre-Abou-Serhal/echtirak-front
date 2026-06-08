import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Card } from 'primeng/card';
import { UIChart } from 'primeng/chart';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Subscribers } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { formatNumber } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-subscribers-panel',
    standalone: true,
    imports: [CommonModule, Card, UIChart, Message, Skeleton],
    templateUrl: './dashboard-v2-subscribers-panel.component.html',
    styleUrl: './dashboard-v2-subscribers-panel.component.scss'
})
export class DashboardV2SubscribersPanelComponent implements OnChanges {
    @Input() data?: DashboardV2Subscribers;
    @Input() loading = false;

    metrics: DashboardV2Metric[] = [];

    activeChartData: any;
    smsChartData: any;
    billingChartData: any;

    readonly chartOptions: any = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.buildMetrics();
            this.buildCharts();
        }
    }

    private buildMetrics(): void {
        this.metrics = [
            { label: 'Active', value: formatNumber(this.data?.active), severity: 'success' },
            { label: 'Inactive', value: formatNumber(this.data?.inactive), severity: 'secondary' },
            { label: 'SMS Enabled', value: formatNumber(this.data?.smsEnabled), severity: 'info' },
            { label: 'SMS Disabled', value: formatNumber(this.data?.smsDisabled), severity: 'warn' },
            { label: 'Fixed Billing', value: formatNumber(this.data?.fixedBillingCount), severity: 'info' },
            { label: 'Metered Billing', value: formatNumber(this.data?.meteredBillingCount), severity: 'info' }
        ];
    }

    private buildCharts(): void {
        this.activeChartData = {
            labels: ['Active', 'Inactive'],
            datasets: [
                {
                    data: [this.data?.active ?? 0, this.data?.inactive ?? 0]
                }
            ]
        };

        this.smsChartData = {
            labels: ['SMS Enabled', 'SMS Disabled'],
            datasets: [
                {
                    data: [this.data?.smsEnabled ?? 0, this.data?.smsDisabled ?? 0]
                }
            ]
        };

        this.billingChartData = {
            labels: ['Fixed', 'Metered'],
            datasets: [
                {
                    data: [this.data?.fixedBillingCount ?? 0, this.data?.meteredBillingCount ?? 0]
                }
            ]
        };
    }

    hasActiveChartData(): boolean {
        return (this.data?.active ?? 0) + (this.data?.inactive ?? 0) > 0;
    }

    hasSmsChartData(): boolean {
        return (this.data?.smsEnabled ?? 0) + (this.data?.smsDisabled ?? 0) > 0;
    }

    hasBillingChartData(): boolean {
        return (this.data?.fixedBillingCount ?? 0) + (this.data?.meteredBillingCount ?? 0) > 0;
    }
}
