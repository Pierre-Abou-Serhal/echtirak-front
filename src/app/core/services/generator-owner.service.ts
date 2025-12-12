import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import {
    AcceptBillsRequest,
    CreateSmsCampaignRequest,
    GenerateAllBillsRequest,
    GenerateBillsRequest,
    GetBillsQueryParams,
    GetCurrencyRatesQueryParams,
    GetLookupQueryParams,
    GetSmsCampaignDetailsQueryParams,
    GetSmsCampaignsQueryParams,
    GetSubscribersQrCodePdfRequest,
    GetSubscribersQueryParams,
    GetSubscriptionBillingModelQueryParams,
    UpsertCurrencyRatesRequest,
    UpdateGeneratorOwnerProfileRequest,
    UpsertBillCollectorRequest,
    UpsertGeneratorRequest,
    UpsertSubscriberRequest,
    UpsertSubscriptionBillingModelRequest,
    UpdateBillRequest,
    GetKVAReadingsPerGeneratorQueryParams,
    UpdateKVAReadingRequest,
    GenerateBillsFromKVAReadingsRequest
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
    GetSmsCampaignDetailsResponse,
    GetWarningMessagesResponse,
    GetCurrenciesResponse,
    GetCurrencyRatesResponse,
    UpsertCurrencyRatesResponse,
    UpdateBillResponse,
    GetKVAReadingsPerGeneratorResponse,
    UpdateKVAReadingResponse,
    GenerateBillsFromKVAReadingsResponse
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

    public getDashboard(): Observable<GetGeneratorOwnerDashboardResponse> {
        return this.apiService.get<GetGeneratorOwnerDashboardResponse>('/GeneratorOwner/Dashboard');
    }

    public getSmsTemplates(): Observable<GetSmsTemplatesResponse> {
        return this.apiService.get<GetSmsTemplatesResponse>('/GeneratorOwner/SmsTemplates');
    }

    public getSmsCampaigns(queryParams: GetSmsCampaignsQueryParams): Observable<GetSmsCampaignsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsCampaignsResponse>('/GeneratorOwner/SmsCampaigns', { params: params });
    }

    public createSmsCampaign(request: CreateSmsCampaignRequest): Observable<CreateSmsCampaignResponse> {
        return this.apiService.post<CreateSmsCampaignResponse>('/GeneratorOwner/SmsCampaigns', request);
    }

    public getSmsCampaignDetails(queryParams: GetSmsCampaignDetailsQueryParams): Observable<GetSmsCampaignDetailsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsCampaignDetailsResponse>(`/GeneratorOwner/SmsCampaigns/${queryParams['id']}`, {
            params: params
        });
    }

    public getWarningMessages(): Observable<GetWarningMessagesResponse> {
        return this.apiService.get<GetWarningMessagesResponse>('/GeneratorOwner/WarningMessages');
    }

    public getCurrencies(): Observable<GetCurrenciesResponse> {
        return this.apiService.get<GetCurrenciesResponse>(`/GeneratorOwner/Currency`);
    }

    public getCurrencyRates(queryParams: GetCurrencyRatesQueryParams): Observable<GetCurrencyRatesResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetCurrencyRatesResponse>(`/GeneratorOwner/CurrencyRates`, {
            params: params
        });
    }

    public upsertCurrencyRates(request: UpsertCurrencyRatesRequest): Observable<UpsertCurrencyRatesResponse> {
        return this.apiService.post<UpsertCurrencyRatesResponse>('/GeneratorOwner/CurrencyRates', request);
    }

    public updateBill(request: UpdateBillRequest): Observable<UpdateBillResponse> {
        return this.apiService.post<UpdateBillResponse>('/GeneratorOwner/UpdateBill', request);
    }

    public getKVAReadingsPerGenerator(queryParams: GetKVAReadingsPerGeneratorQueryParams): Observable<GetKVAReadingsPerGeneratorResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetKVAReadingsPerGeneratorResponse>(`/GeneratorOwner/getKVAReadingsPerGenerator`, {
            params: params
        });
    }
    public updateKVAReading(request: UpdateKVAReadingRequest): Observable<UpdateKVAReadingResponse> {
        return this.apiService.post<UpdateKVAReadingResponse>('/GeneratorOwner/updateKVAReading', request);
    }

    public generateBillsFromKVAReadings(request: GenerateBillsFromKVAReadingsRequest): Observable<GenerateBillsFromKVAReadingsResponse> {
        return this.apiService.post<GenerateBillsFromKVAReadingsResponse>('/GeneratorOwner/GenerateBillsFromKVAReadings', request);
    }
}
