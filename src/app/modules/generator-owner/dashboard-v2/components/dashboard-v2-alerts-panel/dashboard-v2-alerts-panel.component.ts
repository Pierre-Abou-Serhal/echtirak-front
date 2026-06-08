import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { DashboardV2Alert } from '@/core/services/api/response';
import { formatNumber, getAlertSeverity } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-alerts-panel',
    standalone: true,
    imports: [CommonModule, Card, Message, Skeleton, Tag],
    templateUrl: './dashboard-v2-alerts-panel.component.html',
    styleUrl: './dashboard-v2-alerts-panel.component.scss'
})
export class DashboardV2AlertsPanelComponent {
    @Input() alerts: DashboardV2Alert[] = [];
    @Input() loading = false;
    @Input() preview = false;

    readonly formatNumber = formatNumber;
    readonly getAlertSeverity = getAlertSeverity;

    get rows(): DashboardV2Alert[] {
        return this.preview ? this.alerts.slice(0, 5) : this.alerts;
    }
}
