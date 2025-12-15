import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminService } from '@/core/services/admin.service';
import { GetDashboardQueryParams } from '@/core/services/api/request';
import { GetDashboardResponse } from '@/core/services/api/response';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { UIChart } from 'primeng/chart';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

type Vm = { state: 'loading' } | { state: 'error'; error: string } | { state: 'ready'; data: GetDashboardResponse };

type MetricEntry = {
    key: string;
    label: string;
    value: unknown;
    kind: 'number' | 'date' | 'text' | 'boolean';
};

@Component({
    selector: 'app-dashboard.component',
    standalone: true,
    imports: [CommonModule, Toolbar, ReactiveFormsModule, Button, Card, Skeleton, Message, Divider, Panel, TableModule, UIChart, Select, ToggleSwitch, Tag, Tabs, TabPanels, TabList, Tab, TabPanel],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    private adminService = inject(AdminService);
    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);

    // Filters (period is intentionally "string" because your API expects string)
    readonly periodOptions = [
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'This Week', value: 'thisWeek' },
        { label: 'Today', value: 'today' },
        { label: 'All Time', value: 'allTime' }
    ];

    readonly trendMetricOptions = [
        { label: 'Revenue', value: 'revenue' },
        { label: 'New GOs', value: 'newGos' },
        { label: 'New Subscribers', value: 'newSubscribers' },
        { label: 'SMS Sent', value: 'smsSent' },
        { label: 'Bills Generated', value: 'billsGenerated' },
        { label: 'Bills Paid', value: 'billsPaid' }
    ];

    form = this.fb.nonNullable.group({
        period: this.periodOptions[0].value,
        includeTrends: true,
        includeForecasts: true,
        trendMetric: this.trendMetricOptions[0].value
    });

    private readonly refresh$ = new BehaviorSubject<void>(undefined);

    readonly vm$: Observable<Vm> = combineLatest([
        this.form.valueChanges.pipe(
            startWith(this.form.getRawValue()),
            debounceTime(200),
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        ),
        this.refresh$
    ]).pipe(
        switchMap(([v]) => {
            const qp: GetDashboardQueryParams = {
                period: v.period,
                includeTrends: v.includeTrends,
                includeForecasts: v.includeForecasts
            };

            return this.adminService.getDashboard(qp).pipe(
                map((data) => ({ state: 'ready', data }) as Vm),
                startWith({ state: 'loading' } as Vm),
                catchError((err) => {
                    const msg = err?.error?.message ?? err?.message ?? 'Failed to load dashboard. Please try again.';
                    return of({ state: 'error', error: msg } as Vm);
                })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
    );

    refresh(): void {
        this.refresh$.next();
    }

    // ---------- Presentation helpers ----------

    toMetricEntries<T extends object>(obj: T | null | undefined): MetricEntry[] {
        if (!obj) return [];
        return Object.entries(obj as Record<string, unknown>).map(([key, value]) => {
            const label = this.humanizeKey(key);
            const kind = this.detectKind(key, value);
            return { key, label, value, kind };
        });
    }

    private detectKind(key: string, value: unknown): MetricEntry['kind'] {
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') return 'number';

        // ISO date-ish strings (and explicit known date keys)
        if (typeof value === 'string' && (key.toLowerCase().includes('date') || this.looksIsoDate(value))) {
            return 'date';
        }

        return 'text';
    }

    private looksIsoDate(v: string): boolean {
        // quick safe check for ISO datetime
        return /^\d{4}-\d{2}-\d{2}T/.test(v);
    }

    humanizeKey(key: string): string {
        // camelCase -> "Camel Case", also handle acronyms a bit
        const withSpaces = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }

    // ---------- Trend charts ----------
    buildTrendChart(trends: any[] | null | undefined, metric: string): any {
        const data = trends ?? [];
        const labels = data.map((x) => x.period);

        const values = data.map((x) => {
            const v = x?.[metric];
            return typeof v === 'number' ? v : 0;
        });

        return {
            labels,
            datasets: [
                {
                    label: this.trendMetricOptions.find((o) => o.value === metric)?.label ?? metric,
                    data: values,
                    tension: 0.35
                }
            ]
        };
    }

    chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true }
        },
        scales: {
            x: { ticks: { maxRotation: 0 } }
        }
    };

    // ---------- KPI shortcuts (nice top row) ----------
    kpis(res: GetDashboardResponse) {
        const o = res.dashboard.platformOverview;
        const f = res.dashboard.financialMetrics;
        const g = res.dashboard.growthMetrics;

        return [
            { title: 'Total Generator Owners', value: o.totalGeneratorOwners },
            { title: 'Active Generator Owners', value: o.activeGeneratorOwners },
            { title: 'Total Subscribers', value: o.totalSubscribers },
            { title: 'Active Subscribers', value: o.activeSubscribers },
            { title: 'Wallet Top-Ups (This Month)', value: f.totalWalletTopUpsThisMonth },
            { title: 'Platform Revenue (All Time)', value: f.netPlatformRevenueAllTime },
            { title: 'New Subscribers (This Month)', value: g.newSubscribersThisMonth },
            { title: 'Monthly Recurring Revenue', value: g.monthlyRecurringRevenue }
        ];
    }
}
