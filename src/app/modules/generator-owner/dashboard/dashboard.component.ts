import { Component, effect, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetGeneratorOwnerDashboardResponse } from '@/core/services/api/response';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, ButtonModule, ChartModule, SkeletonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    public dashboardResponse: Signal<GetGeneratorOwnerDashboardResponse | undefined> =
        toSignal(this.generatorOwnerService.getDashboard());

    public recentActivityChartData: any;
    public recentActivityChartOptions: any;

    public billsChartData: any;
    public billsChartOptions: any;

    public revenueChartData: any;
    public revenueChartOptions: any;

    constructor() {
        this.initChartOptions();

        effect(() => {
            const dashboard = this.dashboardResponse();
            if (dashboard) {
                this.initChartData(dashboard);
            }
        });
    }

    private initChartData(dashboard: GetGeneratorOwnerDashboardResponse) {
        const documentStyle = getComputedStyle(document.documentElement);

        // Recent Activity Chart
        this.recentActivityChartData = {
            labels: ['New Subscribers', 'Bills Generated', 'Bills Paid'],
            datasets: [
                {
                    label: 'Last 7 Days Activity',
                    backgroundColor: documentStyle.getPropertyValue('--color-blue-500').trim(),
                    borderColor: documentStyle.getPropertyValue('--color-blue-500').trim(),
                    data: [
                        dashboard.recentActivity.newSubscribersLast7Days,
                        dashboard.recentActivity.billsGeneratedLast7Days,
                        dashboard.recentActivity.billsPaidLast7Days
                    ]
                }
            ]
        };

        // Bills Status Chart
        this.billsChartData = {
            labels: ['Pending', 'Paid', 'Overdue'],
            datasets: [
                {
                    data: [
                        dashboard.bills.pending,
                        dashboard.bills.paid,
                        dashboard.bills.overdue
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--color-yellow-500').trim(),
                        documentStyle.getPropertyValue('--color-green-500').trim(),
                        documentStyle.getPropertyValue('--color-red-500').trim()
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--color-yellow-400').trim(),
                        documentStyle.getPropertyValue('--color-green-400').trim(),
                        documentStyle.getPropertyValue('--color-red-400').trim()
                    ]
                }
            ]
        };

        // Revenue Comparison Chart
        this.revenueChartData = {
            labels: ['Last Month', 'This Month'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [
                        dashboard.bills.lastMonth.revenue,
                        dashboard.bills.thisMonth.revenue
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--color-gray-500').trim(),
                        documentStyle.getPropertyValue('--color-primary-500').trim()
                    ],
                    borderColor: [
                        documentStyle.getPropertyValue('--color-gray-500').trim(),
                        documentStyle.getPropertyValue('--color-primary-500').trim()
                    ],
                    borderWidth: 1
                }
            ]
        };
    }

    private initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary').trim();
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border').trim();

        // Common Options
        const commonOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColorSecondary
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.recentActivityChartOptions = commonOptions;
        this.revenueChartOptions = commonOptions;

        this.billsChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColorSecondary
                    }
                }
            }
        };
    }
}
