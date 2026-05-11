import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { Observable } from 'rxjs';
import {
    ForceLogoutMonitoringSessionRequest,
    GetAdminAnnouncementsQueryParams,
    GetDashboardQueryParams,
    GetGoWalletTransactionsQueryParams,
    GetMonitoringActiveSessionsQueryParams,
    GetMonitoringSessionActivityQueryParams,
    GetMonitoringUserSessionsQueryParams,
    GetSmsTemplatesQueryParams,
    PublishAnnouncementRequest,
    ReactivateGeneratorOwnerRequest,
    SetCapOverrideGoWalletRequest,
    TopUpGoWalletRequest,
    UpdateGeneratorOwnerRequest,
    UpsertAnnouncementRequest,
    UpsertSmsTemplateRequest
} from '@/core/services/api/request';
import {
    DeactivateGeneratorOwnerResponse,
    GetAdminAnnouncementsResponse,
    GetDashboardResponse,
    GetGeneratorOwnersResponse,
    GetSmsTemplatesResponse,
    PublishAnnouncementResponse,
    ReactivateGeneratorOwnerResponse,
    UpdateGeneratorOwnerResponse,
    UpsertAnnouncementResponse,
    TopUpGoWalletResponse,
    UpsertSmsTemplateResponse,
    SetCapOverrideGoWalletResponse,
    GetGoWalletTransactionsResponse,
    GetGoStatusResponse,
    GetGoWalletBalanceResponse,
    GetMonitoringStatsResponse,
    GetMonitoringActiveSessionsResponse,
    GetMonitoringUserSessionsResponse,
    GetMonitoringSessionDetailResponse,
    GetMonitoringSessionActivityResponse,
    GetMonitoringActivityDetailResponse,
    GetMonitoringMapResponse,
    ForceLogoutMonitoringSessionResponse,
    GetMonitoringUsersResponse
} from '@/core/services/api/response';

class DeactivateGeneratorOwnerRequest {}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiService: ApiService = inject(ApiService);

    public getDashboard(queryParams: GetDashboardQueryParams): Observable<GetDashboardResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetDashboardResponse>('/Admin/Dashboard', { params: params });
    }

    public getGeneratorOwners(): Observable<GetGeneratorOwnersResponse> {
        return this.apiService.get<GetGeneratorOwnersResponse>('/Admin/GeneratorOwner');
    }

    public updateGeneratorOwner(request: UpdateGeneratorOwnerRequest): Observable<UpdateGeneratorOwnerResponse> {
        return this.apiService.post<UpdateGeneratorOwnerResponse>('/Admin/GeneratorOwner', request);
    }

    public reactivateGeneratorOwner(request: ReactivateGeneratorOwnerRequest): Observable<ReactivateGeneratorOwnerResponse> {
        return this.apiService.post<ReactivateGeneratorOwnerResponse>('/Admin/GeneratorOwner/Reactivate', request);
    }

    public deactivateGeneratorOwner(request: DeactivateGeneratorOwnerRequest): Observable<DeactivateGeneratorOwnerResponse> {
        return this.apiService.post<DeactivateGeneratorOwnerResponse>('/Admin/GeneratorOwner/Deactivate', request);
    }

    public getAnnouncements(queryParams: GetAdminAnnouncementsQueryParams): Observable<GetAdminAnnouncementsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetAdminAnnouncementsResponse>('/Admin/Announcement', { params: params });
    }

    public upsertAnnouncement(request: UpsertAnnouncementRequest): Observable<UpsertAnnouncementResponse> {
        return this.apiService.post<UpsertAnnouncementResponse>('/Admin/Announcement', request);
    }

    public deleteAnnouncement(announcementId: number): Observable<void> {
        return this.apiService.delete<void>(`/Admin/Announcement/${announcementId}`);
    }

    public publishAnnouncement(request: PublishAnnouncementRequest): Observable<PublishAnnouncementResponse> {
        return this.apiService.post<PublishAnnouncementResponse>(`/Admin/Announcement/${request.announcementId}/Publish`, request);
    }

    public getSmsTemplates(queryParams: GetSmsTemplatesQueryParams): Observable<GetSmsTemplatesResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsTemplatesResponse>('/Admin/SmsTemplates', { params: params });
    }

    public upsertSmsTemplate(request: UpsertSmsTemplateRequest): Observable<UpsertSmsTemplateResponse> {
        return this.apiService.post<UpsertSmsTemplateResponse>('/Admin/SmsTemplates', request);
    }

    public deleteSmsTemplate(templateId: number): Observable<void> {
        return this.apiService.delete<void>(`/Admin/SmsTemplates/${templateId}`);
    }

    public topUpGoWallet(request: TopUpGoWalletRequest): Observable<TopUpGoWalletResponse> {
        return this.apiService.post<TopUpGoWalletResponse>('/Admin/Wallet/TopUp', request);
    }

    public setCapOverrideGoWallet(request: SetCapOverrideGoWalletRequest): Observable<SetCapOverrideGoWalletResponse> {
        return this.apiService.post<SetCapOverrideGoWalletResponse>('/Admin/Wallet/SetCapOverride', request);
    }

    public getGoWalletBalance(generatorOwnerUserId: number): Observable<GetGoWalletBalanceResponse> {
        return this.apiService.get<GetGoWalletBalanceResponse>(`/Admin/Wallet/Balance/${generatorOwnerUserId}`);
    }

    public getGoWalletTransactions(queryParams: GetGoWalletTransactionsQueryParams): Observable<GetGoWalletTransactionsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetGoWalletTransactionsResponse>(`/Admin/Wallet/Transactions/${queryParams.generatorOwnerUserId}`, { params: params });
    }

    public getGoStatus(generatorOwnerUserId: number): Observable<GetGoStatusResponse> {
        return this.apiService.get<GetGoStatusResponse>(`/Admin/GeneratorOwner/${generatorOwnerUserId}/Status`);
    }

    public getMonitoringStats(): Observable<GetMonitoringStatsResponse> {
        return this.apiService.get<GetMonitoringStatsResponse>('/Admin/Monitoring/Stats');
    }

    public getMonitoringActiveSessions(queryParams: GetMonitoringActiveSessionsQueryParams): Observable<GetMonitoringActiveSessionsResponse> {
        const params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetMonitoringActiveSessionsResponse>('/Admin/Monitoring/Sessions/Active', { params });
    }

    public getMonitoringUserSessions(queryParams: GetMonitoringUserSessionsQueryParams): Observable<GetMonitoringUserSessionsResponse> {
        const params = this.apiService.buildParams({
            from: queryParams.from,
            to: queryParams.to,
            role: queryParams.role,
            sortBy: queryParams.sortBy,
            sortDir: queryParams.sortDir,
            page: queryParams.page,
            pageSize: queryParams.pageSize
        });

        return this.apiService.get<GetMonitoringUserSessionsResponse>(`/Admin/Monitoring/Users/${queryParams.userId}/Sessions`, { params });
    }

    public getMonitoringSessionDetail(sessionId: number): Observable<GetMonitoringSessionDetailResponse> {
        return this.apiService.get<GetMonitoringSessionDetailResponse>(`/Admin/Monitoring/Sessions/${sessionId}`);
    }

    public getMonitoringSessionActivity(sessionId: number, queryParams: GetMonitoringSessionActivityQueryParams): Observable<GetMonitoringSessionActivityResponse> {
        const params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetMonitoringSessionActivityResponse>(`/Admin/Monitoring/Sessions/${sessionId}/Activity`, { params });
    }

    public getMonitoringActivityDetail(sessionId: number, requestId: string): Observable<GetMonitoringActivityDetailResponse> {
        return this.apiService.get<GetMonitoringActivityDetailResponse>(`/Admin/Monitoring/Sessions/${sessionId}/Activity/${encodeURIComponent(requestId)}`);
    }

    public getMonitoringMap(): Observable<GetMonitoringMapResponse> {
        return this.apiService.get<GetMonitoringMapResponse>('/Admin/Monitoring/Map');
    }

    public forceLogoutMonitoringSession(sessionId: number, request: ForceLogoutMonitoringSessionRequest): Observable<ForceLogoutMonitoringSessionResponse> {
        return this.apiService.post<ForceLogoutMonitoringSessionResponse>(`/Admin/Monitoring/Sessions/${sessionId}/ForceLogout`, request);
    }

    public getMonitoringUsers(): Observable<GetMonitoringUsersResponse> {
        return this.apiService.get<GetMonitoringUsersResponse>('/Admin/Monitoring/Lookup/Users');
    }
}
