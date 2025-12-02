import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import {
    AcceptBillsRequest,
    CreateSmsCampaignRequest,
    GenerateAllBillsRequest,
    GenerateBillsRequest,
    GetBillsQueryParams,
    GetLookupQueryParams,
    GetSmsCampaignDetailsQueryParams,
    GetSmsCampaignsQueryParams,
    GetSubscribersQrCodePdfRequest,
    GetSubscribersQueryParams,
    GetSubscriptionBillingModelQueryParams,
    UpdateGeneratorOwnerProfileRequest,
    UpsertBillCollectorRequest,
    UpsertGeneratorRequest,
    UpsertSubscriberRequest,
    UpsertSubscriptionBillingModelRequest
} from '@/core/services/api/request';
import { Observable } from 'rxjs';
import {
    GetGeneratorsResponse,
    GetSubscribersResponse,
    UpsertSubscriberResponse,
    UpsertGeneratorResponse,
    UpdateGeneratorOwnerProfileResponse,
    GetGeneratorOwnerProfileResponse,
    GetBillCollectorForGOResponse,
    UpsertBillCollectorResponse,
    GetSmsTemplatesResponse,
    GetSubscriptionBillingModelResponse,
    GetLookupResponse,
    GenerateBillsResponse,
    AcceptBillsResponse,
    GetBillsResponse,
    UpsertSubscriptionBillingModelResponse,
    GetGeneratorOwnerDashboardResponse,
    GetSmsCampaignsResponse,
    CreateSmsCampaignResponse,
    GetSmsCampaignDetailsResponse
} from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class GeneratorOwnerService {
    private apiService: ApiService = inject(ApiService);

    public getSubscribers(queryParams: GetSubscribersQueryParams): Observable<GetSubscribersResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSubscribersResponse>('/GeneratorOwner/GetSubscribers', { params: params });
    }

    public upsertSubscriber(request: UpsertSubscriberRequest): Observable<UpsertSubscriberResponse> {
        return this.apiService.post<UpsertSubscriberResponse>('/GeneratorOwner/UpsertSubscriber', request);
    }

    public getGenerators(): Observable<GetGeneratorsResponse> {
        return this.apiService.get<GetGeneratorsResponse>('/GeneratorOwner/Generator');
    }

    public upsertGenerator(request: UpsertGeneratorRequest): Observable<UpsertGeneratorResponse> {
        return this.apiService.post<UpsertGeneratorResponse>('/GeneratorOwner/Generator', request);
    }

    public getProfile(): Observable<GetGeneratorOwnerProfileResponse> {
        return this.apiService.get<GetGeneratorOwnerProfileResponse>('/GeneratorOwner/Profile');
    }

    public updateProfile(request: UpdateGeneratorOwnerProfileRequest): Observable<UpdateGeneratorOwnerProfileResponse> {
        return this.apiService.post<UpdateGeneratorOwnerProfileResponse>('/GeneratorOwner/Profile', request);
    }

    public getBillCollectorForGO() {
        return this.apiService.get<GetBillCollectorForGOResponse>('/GeneratorOwner/BillCollectorForGO');
    }

    public upsertBillCollector(request: UpsertBillCollectorRequest): Observable<UpsertBillCollectorResponse> {
        return this.apiService.post<UpsertBillCollectorResponse>('/GeneratorOwner/BillCollector', request);
    }

    public getSmsTemplate(): Observable<GetSmsTemplatesResponse> {
        return this.apiService.get<GetSmsTemplatesResponse>('/GeneratorOwner/SMSTemplates');
    }

    public getLookup(queryParams: GetLookupQueryParams): Observable<GetLookupResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetLookupResponse>('/GeneratorOwner/Lookup', { params: params });
    }

    public getSubscriberQrCode(subscriberId: number): Observable<Blob> {
        const path = `/GeneratorOwner/Subscriber/${subscriberId}/QrCode`;
        return this.apiService.getBlob(path);
    }

    public getSubscribersQrCodePdf(request: GetSubscribersQrCodePdfRequest) {
        return this.apiService.postBlob('/GeneratorOwner/Subscribers/QrCodePdf', request);
    }

    public generateBills(request: GenerateBillsRequest): Observable<GenerateBillsResponse> {
        return this.apiService.post<GenerateBillsResponse>('/GeneratorOwner/GenerateBills', request);
    }

    public acceptBills(request: AcceptBillsRequest): Observable<AcceptBillsResponse> {
        return this.apiService.post<AcceptBillsResponse>('/GeneratorOwner/AcceptBills', request);
    }

    public generateAllBills(request: GenerateAllBillsRequest): Observable<GenerateBillsResponse> {
        return this.apiService.post<GenerateBillsResponse>('/GeneratorOwner/GenerateAllBills', request);
    }

    public getBills(queryParams: GetBillsQueryParams): Observable<GetBillsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetBillsResponse>('/GeneratorOwner/GetBills', { params: params });
    }

    public upsertSubscriptionBillingModel(request: UpsertSubscriptionBillingModelRequest): Observable<UpsertSubscriptionBillingModelResponse> {
        return this.apiService.post<UpsertSubscriptionBillingModelResponse>('/GeneratorOwner/SubscriptionBillingModel', request);
    }

    public getSubscriptionBillingModel(queryParams: GetSubscriptionBillingModelQueryParams): Observable<GetSubscriptionBillingModelResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSubscriptionBillingModelResponse>('/GeneratorOwner/SubscriptionBillingModel', { params: params });
    }

    public getDashboard() {
        return this.apiService.get<GetGeneratorOwnerDashboardResponse>('/GeneratorOwner/Dashboard');
    }

    public getSmsTemplates() {
        return this.apiService.get<GetSmsTemplatesResponse>('/GeneratorOwner/SmsTemplates');
    }

    public getSmsCampaigns(queryParams: GetSmsCampaignsQueryParams) {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsCampaignsResponse>('/GeneratorOwner/SmsCampaigns', { params: params });
    }

    public createSmsCampaign(request: CreateSmsCampaignRequest) {
        return this.apiService.post<CreateSmsCampaignResponse>('/GeneratorOwner/SmsCampaigns', request);
    }

    public getSmsCampaignDetails(queryParams: GetSmsCampaignDetailsQueryParams) {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsCampaignDetailsResponse>(`/GeneratorOwner/SmsCampaigns/${queryParams['id']}`, {
            params: params
        });
    }
}
