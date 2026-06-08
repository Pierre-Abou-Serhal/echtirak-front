import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';

import { DashboardV2Generator } from '@/core/services/api/response';
import { formatMoney, formatNumber, formatPercent } from '../../utils/dashboard-v2-formatters';
import { exportRowsToCsv } from '../../utils/dashboard-v2-table';

@Component({
    selector: 'app-dashboard-v2-generators-panel',
    standalone: true,
    imports: [CommonModule, Button, Card, InputText, Skeleton, TableModule],
    templateUrl: './dashboard-v2-generators-panel.component.html',
    styleUrl: './dashboard-v2-generators-panel.component.scss'
})
export class DashboardV2GeneratorsPanelComponent {
    @Input() data: DashboardV2Generator[] = [];
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    readonly formatMoney = formatMoney;
    readonly formatNumber = formatNumber;
    readonly formatPercent = formatPercent;

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportToCsv(): void {
        exportRowsToCsv(
            this.data.map((generator) => ({
                generatorCode: generator.generatorCode,
                generatorName: generator.generatorName,
                subscribersCount: generator.subscribersCount,
                activeSubscribers: generator.activeSubscribers,
                consumption: generator.consumption,
                billsCount: generator.billsCount,
                paidBills: generator.paidBills,
                pendingBills: generator.pendingBills,
                overdueBills: generator.overdueBills,
                invoicedAmount: generator.invoicedAmount,
                collectedAmount: generator.collectedAmount,
                outstandingAmount: generator.outstandingAmount,
                overdueAmount: generator.overdueAmount,
                collectionRate: generator.collectionRate,
                averageBillAmount: generator.averageBillAmount
            })),
            'dashboard-generators.csv'
        );
    }
}
