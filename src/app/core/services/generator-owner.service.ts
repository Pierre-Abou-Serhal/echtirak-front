import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import {
    GetSubscribersQueryParams,
    UpsertGeneratorRequest,
    UpsertSubscriberRequest
} from '@/core/services/api/request';
import { Observable } from 'rxjs';
import {
    GetGeneratorsResponse,
    GetSubscribersResponse,
    UpsertSubscriberResponse,
    UpsertGeneratorResponse
} from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class GeneratorOwnerService {
    private apiService: ApiService = inject(ApiService);

    public getSubscribers(queryParams: GetSubscribersQueryParams): Observable<GetSubscribersResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSubscribersResponse>('/GeneratorOwner/GetSubscribers', {params: params});
    }

    public upsertSubscriber(request: UpsertSubscriberRequest): Observable<UpsertSubscriberResponse> {
        return this.apiService.post<UpsertSubscriberResponse>('/GeneratorOwner/UpsertSubscriber', request);
    }

    public getGenerators():Observable<GetGeneratorsResponse> {
        return this.apiService.get<GetGeneratorsResponse>('/GeneratorOwner/Generator');
    }

    public upsertGenerator(request: UpsertGeneratorRequest): Observable<UpsertGeneratorResponse> {
        return this.apiService.post<UpsertGeneratorResponse>('/GeneratorOwner/Generator', request);
    }
}
