import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { DashboardV2Alert } from '@/core/services/api/response';
import { getAlertSeverity } from '../../utils/dashboard-v2-formatters';

@Component({
    selector: 'app-dashboard-v2-alerts-banner',
    standalone: true,
    imports: [CommonModule, Button, Card, Tag],
    templateUrl: './dashboard-v2-alerts-banner.component.html',
    styleUrl: './dashboard-v2-alerts-banner.component.scss'
})
export class DashboardV2AlertsBannerComponent {
    @Input() alerts: DashboardV2Alert[] = [];
    @Output() openAlerts = new EventEmitter<void>();

    readonly getAlertSeverity = getAlertSeverity;

    get urgentCount(): number {
        return this.alerts.filter((alert) => this.getAlertSeverity(alert.severity) === 'danger').length;
    }

    get visibleAlerts(): DashboardV2Alert[] {
        return this.alerts.slice(0, 3);
    }

    get hasHighSeverity(): boolean {
        return this.urgentCount > 0;
    }
}
