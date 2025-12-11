import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { GetBillsByCodeQueryParams } from '@/core/services/api/request';
import { Observable } from 'rxjs';
import { GetBillsByCodeResponse } from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class PublicService {
    private apiService: ApiService = inject(ApiService);

    public getBillsByCode(queryParams: GetBillsByCodeQueryParams): Observable<GetBillsByCodeResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetBillsByCodeResponse>('/Public/GetBillsByCode', { params: params });
    }
}
