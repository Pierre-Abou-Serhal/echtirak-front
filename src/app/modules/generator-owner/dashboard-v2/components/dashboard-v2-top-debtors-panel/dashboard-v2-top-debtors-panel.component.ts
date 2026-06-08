import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

import { LbPhonePipe } from '@/core/pipes/pipes';
import { DashboardV2TopDebtorsResponse } from '@/core/services/api/response';
import { formatMoney, formatNumber, getRiskLabel, getRiskSeverity } from '../../utils/dashboard-v2-formatters';
import { exportRowsToCsv } from '../../utils/dashboard-v2-table';

@Component({
    selector: 'app-dashboard-v2-top-debtors-panel',
    standalone: true,
    imports: [CommonModule, Button, Card, InputText, Message, Skeleton, TableModule, Tag, LbPhonePipe],
    templateUrl: './dashboard-v2-top-debtors-panel.component.html',
    styleUrl: './dashboard-v2-top-debtors-panel.component.scss'
})
export class DashboardV2TopDebtorsPanelComponent {
    @Input() data?: DashboardV2TopDebtorsResponse;
    @Input() currencyCode = 'USD';
    @Input() loading = false;
    @Input() preview = false;
    @Output() pageChange = new EventEmitter<{ pageNumber: number; pageSize: number }>();

    searchTerm = '';

    readonly formatMoney = formatMoney;
    readonly formatNumber = formatNumber;
    readonly getRiskLabel = getRiskLabel;
    readonly getRiskSeverity = getRiskSeverity;

    get sourceRows() {
        const items = this.data?.items ?? [];

        return this.preview ? items.slice(0, 5) : items;
    }

    get rows() {
        const query = this.searchTerm.trim().toLowerCase();

        if (!query) return this.sourceRows;

        return this.sourceRows.filter((debtor) =>
            [debtor.name, debtor.phone, debtor.address, debtor.generator, debtor.outstandingAmount, debtor.pendingBillsCount, debtor.overdueBillsCount, debtor.daysOverdue, getRiskLabel(debtor.daysOverdue)].some((value) =>
                `${value ?? ''}`.toLowerCase().includes(query)
            )
        );
    }

    get first(): number {
        const pageNumber = this.data?.pageNumber ?? 1;
        const pageSize = this.data?.pageSize ?? 25;

        return Math.max(0, pageNumber - 1) * pageSize;
    }

    handlePage(event: any): void {
        this.pageChange.emit({
            pageNumber: Math.floor((event.first ?? 0) / (event.rows ?? 25)) + 1,
            pageSize: event.rows ?? 25
        });
    }

    onSearch(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement).value ?? '';
    }

    exportToCsv(): void {
        exportRowsToCsv(
            this.rows.map((debtor) => ({
                name: debtor.name,
                phone: debtor.phone,
                outstandingAmount: debtor.outstandingAmount,
                pendingBillsCount: debtor.pendingBillsCount,
                overdueBillsCount: debtor.overdueBillsCount,
                daysOverdue: debtor.daysOverdue,
                risk: getRiskLabel(debtor.daysOverdue),
                address: debtor.address,
                generator: debtor.generator
            })),
            'dashboard-top-debtors.csv'
        );
    }
}
