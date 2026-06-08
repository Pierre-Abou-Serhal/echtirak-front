import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';

import { DashboardV2CitySummary } from '@/core/services/api/response';
import { formatMoney, formatNumber, formatPercent } from '../../utils/dashboard-v2-formatters';
import { exportRowsToCsv } from '../../utils/dashboard-v2-table';

@Component({
    selector: 'app-dashboard-v2-address-breakdown-panel',
    standalone: true,
    imports: [CommonModule, ButtonModule, Card, InputText, Skeleton, TableModule],
    templateUrl: './dashboard-v2-address-breakdown-panel.component.html',
    styleUrl: './dashboard-v2-address-breakdown-panel.component.scss'
})
export class DashboardV2AddressBreakdownPanelComponent {
    @Input() data: DashboardV2CitySummary[] = [];
    @Input() currencyCode = 'USD';
    @Input() loading = false;

    expandedRows: Record<string, boolean> = {};

    readonly formatMoney = formatMoney;
    readonly formatNumber = formatNumber;
    readonly formatPercent = formatPercent;

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportCitiesToCsv(): void {
        exportRowsToCsv(
            this.data.map((city) => ({
                city: city.city,
                subscribersCount: city.subscribersCount,
                activeSubscribers: city.activeSubscribers,
                consumption: city.consumption,
                billsCount: city.billsCount,
                paidBills: city.paidBills,
                pendingBills: city.pendingBills,
                overdueBills: city.overdueBills,
                invoicedAmount: city.invoicedAmount,
                collectedAmount: city.collectedAmount,
                outstandingAmount: city.outstandingAmount,
                overdueAmount: city.overdueAmount,
                collectionRate: city.collectionRate
            })),
            'dashboard-area-breakdown-cities.csv'
        );
    }

    exportStreetsToCsv(city: DashboardV2CitySummary): void {
        exportRowsToCsv(
            (city.streets ?? []).map((street) => ({
                city: city.city,
                street: street.street,
                subscribersCount: street.subscribersCount,
                activeSubscribers: street.activeSubscribers,
                consumption: street.consumption,
                billsCount: street.billsCount,
                paidBills: street.paidBills,
                pendingBills: street.pendingBills,
                overdueBills: street.overdueBills,
                invoicedAmount: street.invoicedAmount,
                collectedAmount: street.collectedAmount,
                outstandingAmount: street.outstandingAmount,
                overdueAmount: street.overdueAmount,
                collectionRate: street.collectionRate
            })),
            `dashboard-area-breakdown-${city.city || 'streets'}.csv`
        );
    }
}
