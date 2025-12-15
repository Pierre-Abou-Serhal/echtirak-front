import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { GetSubscribersQueryParams, UpsertKVAReadingRequest } from '@/core/services/api/request';
import { Observable } from 'rxjs';
import { GetKvaReadingPerBillCollectorResponse, GetSubscribersResponse, UpsertKVAReadingResponse } from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class BillCollectorService {
    private apiService: ApiService = inject(ApiService);

    public getSubs(queryParams: GetSubscribersQueryParams): Observable<GetSubscribersResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSubscribersResponse>('/BillCollector/getSubs', { params: params });
    }

    public getKvaReadingPerBilCollector(): Observable<GetKvaReadingPerBillCollectorResponse> {
        return this.apiService.get<GetKvaReadingPerBillCollectorResponse>('/BillCollector/getKvaReadingperBilCollector');
    }

    public upsertKVAReading(req: UpsertKVAReadingRequest): Observable<UpsertKVAReadingResponse> {
        const form = new FormData();

        form.append('Id', String(req.id));
        form.append('SubscriberId', String(req.subscriberId));
        form.append('KvaReading', String(req.kvaReading));
        form.append('Status', req.status);
        if (req.imageFile) {
            form.append('ImageFile', req.imageFile, req.imageFile.name);
        }

        return this.apiService.post<UpsertKVAReadingResponse>('/BillCollector/upsertKVAReading', form);
    }

    public getKvaReadingImage(recordId: number): Observable<Blob> {
        const path = `/BillCollector/kva-reading-image/${recordId}`;
        return this.apiService.getBlob(path);
    }
}
