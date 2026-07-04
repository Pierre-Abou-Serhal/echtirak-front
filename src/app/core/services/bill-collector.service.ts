import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { BulkKvaReadingRequest, GetBillCollectionsQueryParam, GetSubscribersQueryParams, ScanBillBarcodeRequest, UpdateSubscriberBuildingBoxOrderRequest, UpsertKVAReadingRequest } from '@/core/services/api/request';
import { Observable } from 'rxjs';
import {
    BCGetBillCollectionsResponse,
    BulkKvaReadingResponse,
    GetKvaReadingPerBillCollectorResponse,
    GetSubscribersByBuildingBoxTokenResponse,
    GetSubscribersResponse,
    ScanBillBarcodeResponse,
    UpdateSubscriberBuildingBoxOrderResponse,
    UpsertKVAReadingResponse
} from '@/core/services/api/response';

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

    public ScanBillBarcode(req: ScanBillBarcodeRequest): Observable<ScanBillBarcodeResponse> {
        return this.apiService.post<ScanBillBarcodeResponse>(`/BillCollector/scan-bill-barcode`, req);
    }

    public getBillCollections(queryParams: GetBillCollectionsQueryParam): Observable<BCGetBillCollectionsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<BCGetBillCollectionsResponse>(`/BillCollector/BillCollections`, {
            params: params
        });
    }

    // Building Boxes
    public getSubscribersByBuildingBoxToken(token: string): Observable<GetSubscribersByBuildingBoxTokenResponse> {
        return this.apiService.get<GetSubscribersByBuildingBoxTokenResponse>(`/BillCollector/building-boxes/${token}/subscribers`);
    }

    public updateSubscriberBuildingBoxOrder(token: string, request: UpdateSubscriberBuildingBoxOrderRequest): Observable<UpdateSubscriberBuildingBoxOrderResponse> {
        return this.apiService.put<UpdateSubscriberBuildingBoxOrderResponse>(`/BillCollector/building-boxes/${token}/subscriber-order`, request);
    }

    public bulkKvaReadings(token: string, request: BulkKvaReadingRequest): Observable<BulkKvaReadingResponse> {
        const form = new FormData();

        form.append('boxImage', String(request.boxImage));

        if (request.boxImage && request.boxImageFile) {
            form.append('boxImageFile', request.boxImageFile, request.boxImageFile.name);
        }

        request.kvaReadings.forEach((reading, index) => {
            form.append(`KvaReading[${index}].SubscriberId`, String(reading.subscriberId));
            form.append(`KvaReading[${index}].Reading`, String(reading.reading));

            if (!request.boxImage && reading.picture) {
                form.append(`KvaReading[${index}].Picture`, reading.picture, reading.picture.name);
            }
        });

        return this.apiService.post<BulkKvaReadingResponse>(`/BillCollector/building-boxes/${token}/kva-readings/bulk`, form);
    }
}
