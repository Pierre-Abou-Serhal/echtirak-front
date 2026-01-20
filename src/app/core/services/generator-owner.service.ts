import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import {
    AcceptBillsRequest,
    CreateSmsCampaignRequest,
    GenerateBillsForSelectedSubscribersRequest,
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
    GenerateBillsForMeteredSubscribersRequest,
    GenerateBillsForAllFixedSubscribersRequest,
    GetAnnouncementsQueryParams,
    MarkAnnouncementAsReadRequest,
    GetKVAReadingsQueryParams,
    GetSubscribersQrCodeZipRequest
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
    GenerateBillsForSelectedSubscribersResponse,
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
    GenerateBillsForMeteredSubscribersResponse,
    GenerateBillsForAllFixedSubscribersResponse,
    GetAnnouncementsResponse,
    GetAnnouncementsUnreadCountResponse,
    GetKVAReadingsResponse
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

    public getSubscribersQrCodeZip(request: GetSubscribersQrCodeZipRequest) {
        return this.apiService.postBlob('/GeneratorOwner/Subscribers/QrCodeZip', request);
    }

    public getSubscribersQrCodePdf(request: GetSubscribersQrCodePdfRequest) {
        return this.apiService.postBlob('/GeneratorOwner/Subscribers/QrCodePdf', request);
    }

    public generateBillsForSelectedSubscribers(request: GenerateBillsForSelectedSubscribersRequest): Observable<GenerateBillsForSelectedSubscribersResponse> {
        return this.apiService.post<GenerateBillsForSelectedSubscribersResponse>('/GeneratorOwner/GenerateBillsForSelectedSubscribers', request);
    }

    public acceptBills(request: AcceptBillsRequest): Observable<AcceptBillsResponse> {
        return this.apiService.post<AcceptBillsResponse>('/GeneratorOwner/AcceptBills', request);
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

    public generateBillsForMeteredSubscribers(request: GenerateBillsForMeteredSubscribersRequest): Observable<GenerateBillsForMeteredSubscribersResponse> {
        return this.apiService.post<GenerateBillsForMeteredSubscribersResponse>('/GeneratorOwner/GenerateBillsForMeteredSubscribers', request);
    }

    public generateBillsForAllFixedSubscribers(request: GenerateBillsForAllFixedSubscribersRequest): Observable<GenerateBillsForAllFixedSubscribersResponse> {
        return this.apiService.post<GenerateBillsForAllFixedSubscribersResponse>('/GeneratorOwner/GenerateBillsForAllFixedSubscribers', request);
    }

    public getAnnouncements(queryParams: GetAnnouncementsQueryParams): Observable<GetAnnouncementsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetAnnouncementsResponse>(`/GeneratorOwner/Announcement`, {
            params: params
        });
    }

    public getAnnouncementsUnreadCount(): Observable<GetAnnouncementsUnreadCountResponse> {
        return this.apiService.get<GetAnnouncementsUnreadCountResponse>(`/GeneratorOwner/Announcement/UnreadCount`);
    }

    public deleteAnnouncement(id: number): Observable<void> {
        return this.apiService.delete<void>(`/GeneratorOwner/Announcement/${id}`);
    }

    public markAnnouncementAsRead(request: MarkAnnouncementAsReadRequest): Observable<void> {
        return this.apiService.post<void>(`/GeneratorOwner/Announcement/${request.announcementId}/MarkAsRead`, request);
    }

    public getKvaReadingImage(recordId: number): Observable<Blob> {
        const path = `/GeneratorOwner/kva-reading-image/${recordId}`;
        return this.apiService.getBlob(path);
    }

    public getKVAReadings(queryParams: GetKVAReadingsQueryParams): Observable<GetKVAReadingsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetKVAReadingsResponse>(`/GeneratorOwner/KVAReadings`, {
            params: params
        });
    }
}
