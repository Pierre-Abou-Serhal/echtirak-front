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
    GetSubscribersQrCodeZipRequest,
    GetGoSmsTemplatesQueryParams,
    GetBillsForSmsQueryParams,
    GetAddressHintsQueryParams,
    GetCitiesQueryParams,
    GetStreetsQueryParams,
    GetBuildingsQueryParams,
    BulkUpdateAddressesRequest,
    UpsertExtraFeeRequest,
    UpsertExpenseTypeRequest,
    GetExpensesQueryParams,
    UpsertExpenseRequest,
    GetFinanceDaysQueryParams,
    GetFinanceDayDetailQueryParams,
    GetBillCollectionsQueryParam,
    ApproveOrRejectBillCollectionRequest,
    PayBillsInBulkRequest,
    GetBillsByPeriodStatusQueryParam,
    GetBulkBillReportRequest,
    DashboardV2FilterRequest,
    UpdateSubscriberBuildingBoxOrderRequest,
    GetBuildingBoxQrCodeRequest
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
    GetKVAReadingsResponse,
    GetBillsForSmsResponse,
    GetAddressHintsResponse,
    GetCountriesResponse,
    GetCitiesResponse,
    GetStreetsResponse,
    GetBuildingsResponse,
    GetExtraFeesResponse,
    UpsertExtraFeeResponse,
    GetExpenseTypesResponse,
    UpsertExpenseTypeResponse,
    GetExpensesResponse,
    UpsertExpenseResponse,
    GetFinanceDaysResponse,
    GetFinanceDayDetailResponse,
    ApproveOrRejectBillCollectionResponse,
    PayBillsInBulkResponse,
    GetBillsByPeriodStatusResponse,
    GoGetBillCollectionsResponse,
    DashboardV2Response,
    DashboardV2BillsResponse,
    DashboardV2AccountingResponse,
    DashboardV2CollectionResponse,
    DashboardV2BillCollectorResponse,
    DashboardV2ConsumptionResponse,
    DashboardV2AddressResponse,
    DashboardV2GeneratorResponse,
    DashboardV2RecentActivityResponse,
    DashboardV2TopDebtorsResponse,
    DashboardV2AlertsResponse,
    DashboardV2OverviewResponse,
    DashboardV2SubscribersResponse,
    GetSubscribersByBuildingBoxTokenResponse,
    UpdateSubscriberBuildingBoxOrderResponse
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

    public getSmsTemplate(queryParams: GetGoSmsTemplatesQueryParams): Observable<GetSmsTemplatesResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetSmsTemplatesResponse>('/GeneratorOwner/SMSTemplates', { params: params });
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

    public getBillsForSms(queryParams: GetBillsForSmsQueryParams): Observable<GetBillsForSmsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetBillsForSmsResponse>(`/GeneratorOwner/BillsForSms`, {
            params: params
        });
    }

    public getAddressHints(queryParams: GetAddressHintsQueryParams): Observable<GetAddressHintsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetAddressHintsResponse>(`/GeneratorOwner/AddressHints`, {
            params: params
        });
    }

    public getCountries(): Observable<GetCountriesResponse> {
        return this.apiService.get<GetCountriesResponse>(`/GeneratorOwner/Addresses/Countries`);
    }

    public getCities(queryParams: GetCitiesQueryParams): Observable<GetCitiesResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetCitiesResponse>(`/GeneratorOwner/Addresses/Cities`, {
            params: params
        });
    }

    public getStreets(queryParams: GetStreetsQueryParams): Observable<GetStreetsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetStreetsResponse>(`/GeneratorOwner/Addresses/Streets`, {
            params: params
        });
    }

    public getBuildings(queryParams: GetBuildingsQueryParams): Observable<GetBuildingsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetBuildingsResponse>(`/GeneratorOwner/Addresses/Buildings`, {
            params: params
        });
    }

    public bulkUpdateAddresses(request: BulkUpdateAddressesRequest): Observable<void> {
        return this.apiService.put<void>('/GeneratorOwner/Addresses/BulkUpdate', request);
    }

    public getExtraFees(): Observable<GetExtraFeesResponse> {
        return this.apiService.get<GetExtraFeesResponse>(`/GeneratorOwner/ExtraFees`);
    }

    public upsertExtraFee(request: UpsertExtraFeeRequest): Observable<UpsertExtraFeeResponse> {
        return this.apiService.post<UpsertExtraFeeResponse>(`/GeneratorOwner/ExtraFees`, request);
    }

    public deleteExtraFee(extraFeeId: number): Observable<void> {
        return this.apiService.delete<void>(`/GeneratorOwner/ExtraFees/${extraFeeId}`);
    }

    public getExpenseTypes(): Observable<GetExpenseTypesResponse> {
        return this.apiService.get<GetExpenseTypesResponse>(`/GeneratorOwner/ExpenseTypes`);
    }

    public upsertExpenseType(request: UpsertExpenseTypeRequest): Observable<UpsertExpenseTypeResponse> {
        return this.apiService.post<UpsertExpenseTypeResponse>(`/GeneratorOwner/ExpenseTypes`, request);
    }

    public deleteExpenseType(expenseTypeId: number): Observable<void> {
        return this.apiService.delete<void>(`/GeneratorOwner/ExpenseTypes/${expenseTypeId}`);
    }

    public getExpenses(queryParams: GetExpensesQueryParams): Observable<GetExpensesResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetExpensesResponse>(`/GeneratorOwner/Expenses`, {
            params: params
        });
    }

    public upsertExpense(request: UpsertExpenseRequest): Observable<UpsertExpenseResponse> {
        return this.apiService.post<UpsertExpenseResponse>(`/GeneratorOwner/Expenses`, request);
    }

    public deleteExpense(expenseId: number): Observable<void> {
        return this.apiService.delete<void>(`/GeneratorOwner/Expenses/${expenseId}`);
    }

    public getFinanceDays(queryParams: GetFinanceDaysQueryParams): Observable<GetFinanceDaysResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetFinanceDaysResponse>(`/GeneratorOwner/Finances/days`, {
            params: params
        });
    }

    public getFinanceDayDetail(activityDate: string, queryParams: GetFinanceDayDetailQueryParams): Observable<GetFinanceDayDetailResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetFinanceDayDetailResponse>(`/GeneratorOwner/Finances/days/${activityDate}`, {
            params: params
        });
    }

    public getBillReport(billId: number): Observable<Blob> {
        return this.apiService.getBlob(`/GeneratorOwner/Bills/${billId}/Report`);
    }

    public getBillReceipt(billId: number): Observable<Blob> {
        return this.apiService.getBlob(`/GeneratorOwner/Bills/${billId}/Receipt`);
    }

    public getBillCollections(queryParams: GetBillCollectionsQueryParam): Observable<GoGetBillCollectionsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GoGetBillCollectionsResponse>(`/GeneratorOwner/BillCollections`, {
            params: params
        });
    }

    public approveOrRejectBillCollection(request: ApproveOrRejectBillCollectionRequest): Observable<ApproveOrRejectBillCollectionResponse> {
        return this.apiService.post<ApproveOrRejectBillCollectionResponse>(`/GeneratorOwner/BillCollections/Approve`, request);
    }

    public payBillsInBulk(request: PayBillsInBulkRequest): Observable<PayBillsInBulkResponse> {
        return this.apiService.post<PayBillsInBulkResponse>(`/GeneratorOwner/Bills/PayBulk`, request);
    }

    public getBillsByPeriodStatus(queryParams: GetBillsByPeriodStatusQueryParam): Observable<GetBillsByPeriodStatusResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetBillsByPeriodStatusResponse>(`/GeneratorOwner/GetBillsByPeriodStatus`, {
            params: params
        });
    }

    public getBulkBillReport(request: GetBulkBillReportRequest, onlyExtension: boolean) {
        const params = this.apiService.buildParams({ onlyExtension });

        return this.apiService.postBlob('/GeneratorOwner/Bills/Report/Bulk', request, {
            params
        });
    }

    // Dashboard V2
    public dashboardV2(request: DashboardV2FilterRequest): Observable<DashboardV2Response> {
        return this.apiService.post<DashboardV2Response>(`/go/dashboard`, request);
    }

    public dashboardV2Overview(request: DashboardV2FilterRequest): Observable<DashboardV2OverviewResponse> {
        return this.apiService.post<DashboardV2OverviewResponse>(`/go/dashboard/overview`, request);
    }

    public dashboardV2Subscribers(request: DashboardV2FilterRequest): Observable<DashboardV2SubscribersResponse> {
        return this.apiService.post<DashboardV2SubscribersResponse>(`/go/dashboard/subscribers`, request);
    }

    public dashboardV2Bills(request: DashboardV2FilterRequest): Observable<DashboardV2BillsResponse> {
        return this.apiService.post<DashboardV2BillsResponse>(`/go/dashboard/bills`, request);
    }

    public dashboardV2Accounting(request: DashboardV2FilterRequest): Observable<DashboardV2AccountingResponse> {
        return this.apiService.post<DashboardV2AccountingResponse>(`/go/dashboard/accounting`, request);
    }

    public dashboardV2Collections(request: DashboardV2FilterRequest): Observable<DashboardV2CollectionResponse> {
        return this.apiService.post<DashboardV2CollectionResponse>(`/go/dashboard/collections`, request);
    }

    public dashboardV2BillCollectors(request: DashboardV2FilterRequest): Observable<DashboardV2BillCollectorResponse[]> {
        return this.apiService.post<DashboardV2BillCollectorResponse[]>(`/go/dashboard/bill-collectors`, request);
    }

    public dashboardV2Consumption(request: DashboardV2FilterRequest): Observable<DashboardV2ConsumptionResponse> {
        return this.apiService.post<DashboardV2ConsumptionResponse>(`/go/dashboard/consumption`, request);
    }

    public dashboardV2AddressBreakdown(request: DashboardV2FilterRequest): Observable<DashboardV2AddressResponse[]> {
        return this.apiService.post<DashboardV2AddressResponse[]>(`/go/dashboard/address-breakdown`, request);
    }

    public dashboardV2Generators(request: DashboardV2FilterRequest): Observable<DashboardV2GeneratorResponse[]> {
        return this.apiService.post<DashboardV2GeneratorResponse[]>(`/go/dashboard/generators`, request);
    }

    public dashboardV2RecentActivity(request: DashboardV2FilterRequest): Observable<DashboardV2RecentActivityResponse> {
        return this.apiService.post<DashboardV2RecentActivityResponse>(`/go/dashboard/recent-activity`, request);
    }

    public dashboardV2TopDebtors(request: DashboardV2FilterRequest): Observable<DashboardV2TopDebtorsResponse> {
        return this.apiService.post<DashboardV2TopDebtorsResponse>(`/go/dashboard/top-debtors`, request);
    }

    public dashboardV2Alerts(request: DashboardV2FilterRequest): Observable<DashboardV2AlertsResponse[]> {
        return this.apiService.post<DashboardV2AlertsResponse[]>(`/go/dashboard/alerts`, request);
    }

    // Building Boxes
    public getSubscribersByBuildingBoxToken(token: string): Observable<GetSubscribersByBuildingBoxTokenResponse> {
        return this.apiService.get<GetSubscribersByBuildingBoxTokenResponse>(`/GeneratorOwner/building-boxes/${token}/subscribers`);
    }

    public updateSubscriberBuildingBoxOrder(token: string, request: UpdateSubscriberBuildingBoxOrderRequest): Observable<UpdateSubscriberBuildingBoxOrderResponse> {
        return this.apiService.put<UpdateSubscriberBuildingBoxOrderResponse>(`/GeneratorOwner/building-boxes/${token}/subscriber-order`, request);
    }

    public getBuildingBoxQrCode(token: string): Observable<Blob> {
        const path = `/GeneratorOwner/building-boxes/${token}/QrCode`;
        return this.apiService.getBlob(path);
    }

    public getBuildingBoxQrCodePdf(request: GetBuildingBoxQrCodeRequest) {
        return this.apiService.postBlob('/GeneratorOwner/building-boxes/QrCodePdf', request);
    }

    public getBuildingBoxQrCodeZip(request: GetBuildingBoxQrCodeRequest) {
        return this.apiService.postBlob('/GeneratorOwner/building-boxes/QrCodeZip', request);
    }
}
