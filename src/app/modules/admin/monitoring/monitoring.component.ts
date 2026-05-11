import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe, formatDate, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, interval, Subject, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Button } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { Skeleton } from 'primeng/skeleton';

import { AdminService } from '@/core/services/admin.service';
import { NotificationService } from '@/core/services/notification.service';

import {
    ForceLogoutMonitoringSessionResponse,
    GetMonitoringActiveSessionsResponse,
    GetMonitoringActivityDetailResponse,
    GetMonitoringMapResponse,
    GetMonitoringSessionActivityResponse,
    GetMonitoringSessionDetailResponse,
    GetMonitoringStatsResponse,
    GetMonitoringUserSessionsResponse,
    GetMonitoringUsersResponse,
    MonitoringActivityDetailRow,
    MonitoringMapBucket,
    MonitoringSession,
    MonitoringSessionActivity,
    MonitoringSessionDetail,
    MonitoringStats,
    MonitoringUserSession
} from '@/core/services/api/response';
import { SelectOptionNumValue } from '@/core/dtos/dto';

@Component({
    selector: 'app-monitoring',
    standalone: true,
    imports: [FormsModule, NgClass, Button, TableModule, Tag, InputText, InputNumber, Select, DatePicker, Dialog, Textarea, Skeleton, DatePipe],
    templateUrl: './monitoring.component.html',
    styleUrl: './monitoring.component.scss'
})
export class MonitoringComponent implements OnInit, OnDestroy {
    private readonly adminService = inject(AdminService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    stats?: MonitoringStats;
    mapBuckets: MonitoringMapBucket[] = [];

    sessions: MonitoringSession[] = [];
    totalSessions = 0;
    sessionFirst = 0;
    sessionRows = 20;
    sessionRowsOptions = [10, 20, 50, 100];

    selectedActiveSession: MonitoringSession | null = null;
    selectedActiveSessionId: number | null = null;

    selectedHistorySession: MonitoringUserSession | null = null;
    selectedHistorySessionId: number | null = null;

    selectedSession?: MonitoringSessionDetail;
    selectedSessionActivity: MonitoringSessionActivity[] = [];
    filteredSessionActivity: MonitoringSessionActivity[] = [];

    activitySearch = '';
    private activitySearch$ = new Subject<string>();
    private activityOptionsChange$ = new Subject<void>();

    activityFirst = 0;
    activityRows = 10;
    activityRowsOptions = [10, 20, 50];

    activitySkeletonRows: MonitoringSessionActivity[] = Array.from({ length: 5 }).map((_, index) => ({
        requestId: `skeleton-${index}`,
        lastTime: '',
        endpointName: null,
        httpMethod: null,
        requestPath: null,
        screenName: null,
        lastStatusCode: null,
        rowCount: 0
    }));

    activityDetailRows: MonitoringActivityDetailRow[] = [];
    activityDetailOpen = false;
    activityDetailLoading = false;
    selectedRequestId: string | null = null;
    loadingActivityRequestId: string | null = null;

    payloadOpen = false;
    payloadTitle = '';
    payloadContent = '';

    loadingStats = false;
    loadingSessions = false;
    loadingMap = false;
    loadingSessionDetail = false;
    loadingActivity = false;

    autoRefresh = true;
    refreshEverySeconds = 30;
    private refreshSubscription?: Subscription;

    roleFilter: string | null = null;
    statusFilter: string | null = null;
    countryFilter = '';
    cityFilter = '';
    searchFilter = '';

    sortBy = 'lastSeenAt';
    sortDir: 'asc' | 'desc' = 'desc';

    roleOptions = [
        { label: 'All roles', value: null },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Generator Owner', value: 'GENERATOR_OWNER' },
        { label: 'Bill Collector', value: 'BILL_COLLECTOR' }
    ];

    statusOptions = [
        { label: 'All statuses', value: null },
        { label: 'Online', value: 'Online' },
        { label: 'Idle', value: 'Idle' }
    ];

    activityDirection: 'request' | 'response' | 'both' = 'both';
    activityLimit = 30;

    historyUserId: number | null = null;
    historyFrom: Date | null = null;
    historyTo: Date | null = null;
    historyRows: MonitoringUserSession[] = [];
    historyTotal = 0;
    historyFirst = 0;
    historyPageSize = 10;
    historySortBy = 'signedInAt';
    historySortDir: 'asc' | 'desc' = 'desc';
    loadingHistory = false;

    forceLogoutOpen = false;
    forceLogoutReason = '';
    forceLogoutLoading = false;

    readonly sessionDetailSkeletonRows = [1, 2, 3, 4, 5, 6, 7, 8];

    monitoringUsersOptions: SelectOptionNumValue[] = [];
    isMonitoringUsersLoading = false;

    ngOnInit(): void {
        this.loadMonitoringUsers();

        this.activitySearch$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.activitySearch = value;
            this.applyActivityFilter();
        });

        this.activityOptionsChange$.pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.loadSessionActivity();
        });

        this.refreshAll();
        this.configureAutoRefresh();
    }

    ngOnDestroy(): void {
        this.refreshSubscription?.unsubscribe();
    }

    refreshAll(): void {
        this.loadStats();
        this.loadActiveSessions();
        this.loadMap();

        if (this.selectedSession) {
            this.loadSelectedSession(this.selectedSession.sessionId, false);
        }
    }

    onAutoRefreshChange(): void {
        this.configureAutoRefresh();
    }

    onRefreshSecondsChange(value: number | null): void {
        if (!value || value < 1) {
            this.refreshEverySeconds = 1;
        } else {
            this.refreshEverySeconds = Math.round(value);
        }

        this.configureAutoRefresh();
    }

    private configureAutoRefresh(): void {
        this.refreshSubscription?.unsubscribe();

        if (!this.autoRefresh) return;

        const seconds = Math.max(1, this.refreshEverySeconds || 1);

        this.refreshSubscription = interval(seconds * 1000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.refreshAll());
    }

    loadStats(): void {
        this.loadingStats = true;

        this.adminService
            .getMonitoringStats()
            .pipe(finalize(() => (this.loadingStats = false)))
            .subscribe({
                next: (response: GetMonitoringStatsResponse) => {
                    this.stats = response.stats;
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.warn('Failure', 'Failed to load monitoring stats.');
                }
            });
    }

    loadMap(): void {
        this.loadingMap = true;

        this.adminService
            .getMonitoringMap()
            .pipe(finalize(() => (this.loadingMap = false)))
            .subscribe({
                next: (response: GetMonitoringMapResponse) => {
                    this.mapBuckets = response.buckets ?? [];
                },
                error: (err) => {
                    console.error(err);
                    this.mapBuckets = [];
                }
            });
    }

    loadActiveSessions(event?: TableLazyLoadEvent): void {
        if (event) {
            this.sessionFirst = event.first ?? 0;
            this.sessionRows = event.rows ?? this.sessionRows;

            if (event.sortField) {
                this.sortBy = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            }

            if (event.sortOrder === 1 || event.sortOrder === -1) {
                this.sortDir = event.sortOrder === 1 ? 'asc' : 'desc';
            }
        }

        const page = Math.floor(this.sessionFirst / this.sessionRows) + 1;

        this.loadingSessions = true;

        this.adminService
            .getMonitoringActiveSessions({
                page,
                pageSize: this.sessionRows,
                role: this.roleFilter ?? undefined,
                status: this.statusFilter ?? undefined,
                country: this.countryFilter || undefined,
                city: this.cityFilter || undefined,
                search: this.searchFilter || undefined,
                sortBy: this.sortBy,
                sortDir: this.sortDir
            })
            .pipe(finalize(() => (this.loadingSessions = false)))
            .subscribe({
                next: (response: GetMonitoringActiveSessionsResponse) => {
                    const pageData = response.page;

                    this.sessions = pageData?.items ?? [];
                    this.totalSessions = pageData?.totalCount ?? 0;

                    if (this.selectedActiveSessionId) {
                        this.selectedActiveSession = this.sessions.find((session) => session.sessionId === this.selectedActiveSessionId) ?? null;
                    }
                },
                error: (err) => {
                    console.error(err);

                    this.sessions = [];
                    this.totalSessions = 0;

                    this.notificationService.warn('Failure', 'Failed to load active sessions.');
                }
            });
    }

    applySessionFilters(): void {
        this.sessionFirst = 0;
        this.loadActiveSessions();
    }

    clearSessionFilters(): void {
        this.roleFilter = null;
        this.statusFilter = null;
        this.countryFilter = '';
        this.cityFilter = '';
        this.searchFilter = '';
        this.sessionFirst = 0;

        this.loadActiveSessions();
    }

    selectSession(event: any): void {
        const row = event?.data as MonitoringSession | undefined;

        if (!row) return;

        this.selectedActiveSession = row;
        this.selectedActiveSessionId = row.sessionId;

        this.selectedHistorySessionId = row.sessionId;
        this.selectedHistorySession = this.historyRows.find((history) => history.sessionId === row.sessionId) ?? null;

        this.clearSelectedSessionData();

        this.loadSelectedSession(row.sessionId, true);

        this.historyUserId = row.userId;
        this.historyFirst = 0;
        this.loadUserHistory();
    }

    selectHistorySession(event: any): void {
        const row = event?.data as MonitoringUserSession | undefined;

        if (!row) return;

        this.selectedHistorySession = row;
        this.selectedHistorySessionId = row.sessionId;

        this.selectedActiveSession = this.sessions.find((session) => session.sessionId === row.sessionId) ?? null;

        this.selectedActiveSessionId = row.sessionId;

        this.historyUserId = row.userId;

        this.clearSelectedSessionData();

        this.loadSelectedSession(row.sessionId, true);
    }

    private clearSelectedSessionData(): void {
        this.selectedSession = undefined;
        this.selectedSessionActivity = [];
        this.filteredSessionActivity = [];
        this.activityDetailRows = [];
        this.activityFirst = 0;
        this.activitySearch = '';
    }

    private loadSelectedSession(sessionId: number, showLoading: boolean): void {
        if (showLoading) {
            this.loadingSessionDetail = true;
        }

        this.adminService
            .getMonitoringSessionDetail(sessionId)
            .pipe(finalize(() => (this.loadingSessionDetail = false)))
            .subscribe({
                next: (response: GetMonitoringSessionDetailResponse) => {
                    if (this.selectedActiveSessionId !== sessionId && this.selectedHistorySessionId !== sessionId) return;

                    this.selectedSession = response.session;
                    this.selectedActiveSessionId = response.session.sessionId;
                    this.selectedHistorySessionId = response.session.sessionId;

                    this.loadSessionActivity();
                },
                error: (err) => {
                    console.error(err);

                    this.selectedSession = undefined;
                    this.selectedSessionActivity = [];
                    this.filteredSessionActivity = [];

                    this.notificationService.warn('Failure', 'Failed to load session details.');
                }
            });
    }

    loadSessionActivity(): void {
        if (!this.selectedSession) return;

        this.loadingActivity = true;

        this.adminService
            .getMonitoringSessionActivity(this.selectedSession.sessionId, {
                limit: this.activityLimit,
                direction: this.activityDirection
            })
            .pipe(finalize(() => (this.loadingActivity = false)))
            .subscribe({
                next: (response: GetMonitoringSessionActivityResponse) => {
                    this.selectedSessionActivity = response.items ?? [];
                    this.applyActivityFilter();
                },
                error: (err) => {
                    console.error(err);

                    this.selectedSessionActivity = [];
                    this.filteredSessionActivity = [];
                }
            });
    }

    onActivitySearch(value: string): void {
        this.activitySearch$.next((value ?? '').trim());
    }

    onActivityOptionsChange(): void {
        this.activityFirst = 0;
        this.activityOptionsChange$.next();
    }

    onActivityLimitChange(value: number | null): void {
        if (!value || value < 1) {
            this.activityLimit = 1;
        } else if (value > 200) {
            this.activityLimit = 200;
        } else {
            this.activityLimit = Math.round(value);
        }

        this.onActivityOptionsChange();
    }

    onActivityPage(event: any): void {
        this.activityFirst = event?.first ?? 0;
        this.activityRows = event?.rows ?? this.activityRows;
    }

    private applyActivityFilter(): void {
        const q = this.activitySearch.toLowerCase();

        if (!q) {
            this.filteredSessionActivity = [...this.selectedSessionActivity];
            this.activityFirst = 0;
            return;
        }

        this.filteredSessionActivity = this.selectedSessionActivity.filter((activity) => {
            const haystack = [activity.requestId, activity.lastTime, activity.endpointName, activity.httpMethod, activity.requestPath, activity.screenName, activity.lastStatusCode, activity.rowCount].join(' ').toLowerCase();

            return haystack.includes(q);
        });

        this.activityFirst = 0;
    }

    openActivityDetail(activity: MonitoringSessionActivity): void {
        if (!this.selectedSession) return;

        this.selectedRequestId = activity.requestId;
        this.loadingActivityRequestId = activity.requestId;

        this.activityDetailOpen = true;
        this.activityDetailLoading = true;
        this.activityDetailRows = [];

        this.adminService
            .getMonitoringActivityDetail(this.selectedSession.sessionId, activity.requestId)
            .pipe(
                finalize(() => {
                    this.activityDetailLoading = false;
                    this.loadingActivityRequestId = null;
                })
            )
            .subscribe({
                next: (response: GetMonitoringActivityDetailResponse) => {
                    this.activityDetailRows = response.items ?? [];
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.warn('Failure', 'Failed to load activity detail.');
                }
            });
    }

    get activityTableValue(): MonitoringSessionActivity[] {
        return this.loadingActivity || this.loadingSessionDetail ? this.activitySkeletonRows : this.filteredSessionActivity;
    }

    loadUserHistory(event?: TableLazyLoadEvent, showWarning = false): void {
        if (!this.historyUserId) {
            if (showWarning) {
                this.notificationService.warn('Missing User', 'Please select a session or enter a user ID.');
            }

            return;
        }

        if (event) {
            this.historyFirst = event.first ?? 0;
            this.historyPageSize = event.rows ?? this.historyPageSize;

            if (event.sortField) {
                this.historySortBy = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
            }

            if (event.sortOrder === 1 || event.sortOrder === -1) {
                this.historySortDir = event.sortOrder === 1 ? 'asc' : 'desc';
            }
        }

        const page = Math.floor(this.historyFirst / this.historyPageSize) + 1;

        this.loadingHistory = true;

        this.adminService
            .getMonitoringUserSessions({
                userId: this.historyUserId,
                from: this.toApiDate(this.historyFrom),
                to: this.toApiDate(this.historyTo),
                page,
                pageSize: this.historyPageSize,
                sortBy: this.historySortBy,
                sortDir: this.historySortDir
            })
            .pipe(finalize(() => (this.loadingHistory = false)))
            .subscribe({
                next: (response: GetMonitoringUserSessionsResponse) => {
                    const pageData = response.page;

                    this.historyRows = pageData?.items ?? [];
                    this.historyTotal = pageData?.totalCount ?? 0;

                    if (this.selectedHistorySessionId) {
                        this.selectedHistorySession = this.historyRows.find((row) => row.sessionId === this.selectedHistorySessionId) ?? null;
                    }
                },
                error: (err) => {
                    console.error(err);

                    this.historyRows = [];
                    this.historyTotal = 0;

                    this.notificationService.warn('Failure', 'Failed to load user session history.');
                }
            });
    }

    openForceLogout(): void {
        if (!this.selectedSession || this.loadingSessionDetail) return;

        this.forceLogoutReason = '';
        this.forceLogoutOpen = true;
    }

    forceLogoutSelectedSession(): void {
        if (!this.selectedSession) return;

        const reason = this.forceLogoutReason.trim();

        if (!reason) {
            this.notificationService.warn('Missing Reason', 'Please enter a reason for force logout.');
            return;
        }

        this.forceLogoutLoading = true;

        this.adminService
            .forceLogoutMonitoringSession(this.selectedSession.sessionId, { reason })
            .pipe(finalize(() => (this.forceLogoutLoading = false)))
            .subscribe({
                next: (response: ForceLogoutMonitoringSessionResponse) => {
                    this.forceLogoutOpen = false;

                    this.notificationService.success('Session Closed', `Force logout completed. Rows affected: ${response.result?.rowsAffected ?? 0}.`);

                    this.refreshAll();
                },
                error: (err) => {
                    console.error(err);
                    this.notificationService.warn('Failure', 'Failed to force logout session.');
                }
            });
    }

    openPayload(title: string, value: string | null | undefined): void {
        this.payloadTitle = title;
        this.payloadContent = this.formatPayload(value);
        this.payloadOpen = true;
    }

    private formatPayload(value: string | null | undefined): string {
        if (!value) return '(empty)';

        try {
            return JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            return value;
        }
    }

    private toApiDate(date: Date | null): string | undefined {
        if (!date) return undefined;

        return formatDate(date, 'yyyy-MM-dd', 'en-US');
    }

    get roleEntries(): { key: string; value: number }[] {
        return Object.entries(this.stats?.byRole ?? {}).map(([key, value]) => ({
            key,
            value
        }));
    }

    get countryEntries(): { key: string; value: number }[] {
        return Object.entries(this.stats?.byCountry ?? {}).map(([key, value]) => ({
            key,
            value
        }));
    }

    get maxRoleCount(): number {
        return Math.max(1, ...this.roleEntries.map((x) => x.value));
    }

    get maxCountryCount(): number {
        return Math.max(1, ...this.countryEntries.map((x) => x.value));
    }

    get anyLoading(): boolean {
        return this.loadingStats || this.loadingSessions || this.loadingMap;
    }

    getStatusSeverity(status: string | null | undefined) {
        switch (status) {
            case 'Online':
                return 'success';

            case 'Idle':
                return 'warn';

            case 'Offline':
                return 'secondary';

            default:
                return 'secondary';
        }
    }

    getHttpSeverity(statusCode: number | null | undefined) {
        if (!statusCode) return 'secondary';
        if (statusCode >= 200 && statusCode < 300) return 'success';
        if (statusCode >= 400 && statusCode < 500) return 'warn';
        if (statusCode >= 500) return 'danger';

        return 'secondary';
    }

    getMethodSeverity(method: string | null | undefined) {
        switch (method) {
            case 'GET':
                return 'success';

            case 'POST':
                return 'info';

            case 'PUT':
            case 'PATCH':
                return 'warn';

            case 'DELETE':
                return 'danger';

            default:
                return 'secondary';
        }
    }

    formatLocation(country?: string | null, city?: string | null): string {
        const parts = [city, country].filter(Boolean);

        return parts.length ? parts.join(', ') : '—';
    }

    formatDuration(seconds: number | null | undefined): string {
        if (seconds === null || seconds === undefined) return '—';

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;

        return `${s}s`;
    }

    isSelectedSession(sessionId: number): boolean {
        return this.selectedActiveSessionId === sessionId;
    }

    isSelectedHistorySession(sessionId: number): boolean {
        return this.selectedHistorySessionId === sessionId;
    }

    // TODO: To change to load all users instead of generator owners
    private loadMonitoringUsers(): void {
        this.isMonitoringUsersLoading = true;

        this.adminService
            .getMonitoringUsers()
            .pipe(finalize(() => (this.isMonitoringUsersLoading = false)))
            .subscribe({
                next: (response: GetMonitoringUsersResponse) => {
                    this.monitoringUsersOptions = (response.users ?? [])
                        .map((user) => {
                            return {
                                value: user.id,
                                label: `${user.username} - ${user.displayName}`
                            };
                        })
                        .sort((a, b) => a.label.localeCompare(b.label));
                },
                error: (err) => {
                    console.error(err);
                    this.monitoringUsersOptions = [];
                    this.notificationService.warn('Failure', 'Failed to load generator owners.');
                }
            });
    }
}
