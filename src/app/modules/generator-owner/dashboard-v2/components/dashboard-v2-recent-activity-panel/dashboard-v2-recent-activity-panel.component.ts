import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

import { DashboardV2RecentActivity } from '@/core/services/api/response';
import { DashboardV2Metric } from '../../utils/dashboard-v2-labels';
import { formatNumber } from '../../utils/dashboard-v2-formatters';
import { exportRowsToCsv } from '../../utils/dashboard-v2-table';

@Component({
    selector: 'app-dashboard-v2-recent-activity-panel',
    standalone: true,
    imports: [DatePipe, Button, Card, InputText, Message, Skeleton, TableModule, Tag],
    templateUrl: './dashboard-v2-recent-activity-panel.component.html',
    styleUrl: './dashboard-v2-recent-activity-panel.component.scss'
})
export class DashboardV2RecentActivityPanelComponent {
    @Input() data?: DashboardV2RecentActivity;
    @Input() loading = false;
    @Input() preview = false;

    get counters(): DashboardV2Metric[] {
        return [
            { label: 'New Subscribers', value: formatNumber(this.data?.counters?.newSubscribers), severity: 'info' },
            { label: 'Bills Generated', value: formatNumber(this.data?.counters?.billsGenerated), severity: 'secondary' },
            { label: 'Bills Paid', value: formatNumber(this.data?.counters?.billsPaid), severity: 'success' },
            { label: 'Collections Approved', value: formatNumber(this.data?.counters?.collectionsApproved), severity: 'success' },
            { label: 'Collections Rejected', value: formatNumber(this.data?.counters?.collectionsRejected), severity: 'danger' },
            { label: 'Readings Submitted', value: formatNumber(this.data?.counters?.readingsSubmitted), severity: 'info' },
            { label: 'SMS Sent', value: formatNumber(this.data?.counters?.smsSent), severity: 'info' }
        ];
    }

    get feed() {
        const items = this.data?.feed ?? [];

        return this.preview ? items.slice(0, 5) : items;
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportToCsv(): void {
        exportRowsToCsv(
            this.feed.map((item) => ({
                type: item.type,
                refId: item.refId,
                label: item.label,
                occurredAt: item.occurredAt
            })),
            'dashboard-recent-activity.csv'
        );
    }
}
