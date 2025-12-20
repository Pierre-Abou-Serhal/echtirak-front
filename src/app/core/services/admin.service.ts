import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { Observable } from 'rxjs';
import { GetAdminAnnouncementsQueryParams, GetDashboardQueryParams, GetSmsTemplatesQueryParams, PublishAnnouncementRequest, ReactivateGeneratorOwnerRequest, UpdateGeneratorOwnerRequest, UpsertAnnouncementRequest,
    UpsertSmsTemplateRequest
} from '@/core/services/api/request';
import {
    DeactivateGeneratorOwnerResponse,
    GetAdminAnnouncementsResponse,
    GetDashboardResponse,
    GetGeneratorOwnersResponse,
    GetSmsTemplatesResponse,
    PublishAnnouncementResponse,
    ReactivateGeneratorOwnerRequestResponse,
    UpdateGeneratorOwnerResponse,
    UpsertAnnouncementResponse,
    UpsertSmsTemplateResponse
} from '@/core/services/api/response';

class DeactivateGeneratorOwnerRequest {}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiService: ApiService = inject(ApiService);

    public getDashboard(queryParams: GetDashboardQueryParams): Observable<GetDashboardResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetDashboardResponse>('/Admin/Dashboard', { params: params });
    }

    // TODO: Need to fetch all GO data that will be updated using POST
    public getGeneratorOwners(): Observable<GetGeneratorOwnersResponse> {
        return this.apiService.get<GetGeneratorOwnersResponse>('/Admin/GeneratorOwner');
    }

    // TODO: Implement once ready
    public updateGeneratorOwner(request: UpdateGeneratorOwnerRequest): Observable<UpdateGeneratorOwnerResponse> {
        return this.apiService.post<UpdateGeneratorOwnerResponse>('/Admin/GeneratorOwner', request);
    }

    // TODO: Implement once ready
    public reactivateGeneratorOwner(request: ReactivateGeneratorOwnerRequest): Observable<ReactivateGeneratorOwnerRequestResponse> {
        return this.apiService.post<ReactivateGeneratorOwnerRequestResponse>('/Admin/GeneratorOwner/Reactivate', request);
    }

    // TODO: Implement once ready
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
}
