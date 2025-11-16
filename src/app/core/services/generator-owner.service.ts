import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { GetSubscribersQueryParams } from '@/core/services/api/request';
import { Observable } from 'rxjs';
import { GetSubscribersResponse } from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class GeneratorOwnerService {
    private apiService: ApiService = inject(ApiService);

    public getSubscribers(queryParams: GetSubscribersQueryParams): Observable<GetSubscribersResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSubscribersResponse>('/GeneratorOwner/GetSubscribers', {params: params});
    }
}
