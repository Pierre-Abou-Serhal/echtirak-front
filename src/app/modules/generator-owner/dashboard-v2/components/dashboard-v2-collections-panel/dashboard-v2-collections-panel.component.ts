import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { Skeleton } from 'primeng/skeleton';

import { DashboardV2Collections } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { clampPercent, formatNumber, formatPercent } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-collections-panel',
    standalone: true,
    imports: [CommonModule, Card, Message, ProgressBar, Skeleton],
    templateUrl: './dashboard-v2-collections-panel.component.html',
    styleUrl: './dashboard-v2-collections-panel.component.scss'
})
export class DashboardV2CollectionsPanelComponent {
    @Input() data?: DashboardV2Collections;
    @Input() loading = false;

    readonly clampPercent = clampPercent;
    readonly formatPercent = formatPercent;

    get metrics(): DashboardV2Metric[] {
        return [
            { label: 'Pending Approvals', value: formatNumber(this.data?.pendingApprovalsCount), severity: 'warn' },
            { label: 'Approved', value: formatNumber(this.data?.approvedCount), severity: 'success' },
            { label: 'Rejected', value: formatNumber(this.data?.rejectedCount), severity: 'danger' },
            { label: 'Collected By GO', value: formatNumber(this.data?.collectedByGoCount), severity: 'info' },
            { label: 'Collected Via BC', value: formatNumber(this.data?.collectedViaBcCount), severity: 'info' }
        ];
    }
}
