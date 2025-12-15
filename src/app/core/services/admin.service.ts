import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { Observable } from 'rxjs';
import { GetDashboardQueryParams } from '@/core/services/api/request';
import { GetDashboardResponse, GetGeneratorOwnersResponse } from '@/core/services/api/response';

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
}
