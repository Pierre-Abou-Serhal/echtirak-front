import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { Observable } from 'rxjs';
import { GetDashboardQueryParams, ReactivateGeneratorOwnerRequest, UpdateGeneratorOwnerRequest } from '@/core/services/api/request';
import { DeactivateGeneratorOwnerRequestResponse, GetDashboardResponse, GetGeneratorOwnersResponse, ReactivateGeneratorOwnerRequestResponse, UpdateGeneratorOwnerResponse } from '@/core/services/api/response';

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
    public deactivateGeneratorOwner(request: DeactivateGeneratorOwnerRequest): Observable<DeactivateGeneratorOwnerRequestResponse> {
        return this.apiService.post<DeactivateGeneratorOwnerRequestResponse>('/Admin/GeneratorOwner/Deactivate', request);
    }
}
