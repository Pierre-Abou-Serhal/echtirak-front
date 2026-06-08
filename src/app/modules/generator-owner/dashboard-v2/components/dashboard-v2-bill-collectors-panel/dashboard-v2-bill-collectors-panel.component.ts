import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';

import { DashboardV2BillCollectorBreakdown } from '@/core/services/api/response';
import { formatMoney, formatNumber } from '../../utils/dashboard-v2-formatters';
import { exportRowsToCsv } from '../../utils/dashboard-v2-table';

@Component({
    selector: 'app-dashboard-v2-bill-collectors-panel',
    standalone: true,
    imports: [CommonModule, Button, Card, InputText, Skeleton, TableModule],
    templateUrl: './dashboard-v2-bill-collectors-panel.component.html',
    styleUrl: './dashboard-v2-bill-collectors-panel.component.scss'
})
export class DashboardV2BillCollectorsPanelComponent {
    @Input() data: DashboardV2BillCollectorBreakdown[] = [];
    @Input() currencyCode = 'USD';
    @Input() loading = false;
    @Input() preview = false;

    readonly formatMoney = formatMoney;
    readonly formatNumber = formatNumber;

    get rows(): DashboardV2BillCollectorBreakdown[] {
        return this.preview ? this.data.slice(0, 5) : this.data;
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportToCsv(): void {
        exportRowsToCsv(
            this.rows.map((collector) => ({
                collectorName: collector.collectorName,
                pendingApprovalsCount: collector.pendingApprovalsCount,
                pendingApprovalAmount: collector.pendingApprovalAmount,
                approvedCount: collector.approvedCount,
                rejectedCount: collector.rejectedCount,
                averageCollectionAmount: collector.averageCollectionAmount
            })),
            'dashboard-bill-collectors.csv'
        );
    }
}
