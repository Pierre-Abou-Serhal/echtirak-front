// Auth Requests
import { Bill, BillCollectorProfile, CurrencyRate, Generator, GeneratorOwnerProfile, SubscriptionBillingModel } from '@/core/models/model';

export interface SignInRequest {
    username: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

//Generator Owner Requests
export interface GetSubscribersQueryParams {
    pageNumber: number;
    pageSize: number;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    generatorId?: number;
    subscriberId?: number;
    currentKva?: number;
    electricMeterNumber?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    modifiedBy?: string;
    keyword?: string;
    smsEnabled?: boolean;
}

export interface UpsertSubscriberRequest {
    id: number;
    generatorId: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    addressCountry: string;
    addressCity: string;
    addressStreet: string;
    addressBuilding: string;
    addressFloor?: string;
    previousKva: number;
    currentKva: number;
    electricMeterNumber: string;
    subscriptionBillingModelId: number;
    overrideAmount?: number;
    statusCode: string;
    smsEnabled: boolean;
    preferredLanguage?: string | null;
    extraFeeIds?: number[];
}

export interface UpsertGeneratorRequest extends Generator {}

export interface UpdateGeneratorOwnerProfileRequest extends GeneratorOwnerProfile {}

export interface UpsertBillCollectorRequest extends BillCollectorProfile {
    password?: string;
    confirmPassword?: string;
}

export interface GetSubscriptionBillingModelQueryParams {
    generatorId?: number;
}

export interface GetLookupQueryParams {
    domain?: string;
}

export interface GetSubscribersQrCodePdfRequest {
    generatorId: number;
}

export interface GetSubscribersQrCodeZipRequest {
    generatorId: number;
}

export interface GenerateBillsForSelectedSubscribersRequest {
    generatorId: number;
    subscriberIds: number[];
    billYear: string;
    billMonth: string;
}

export interface AcceptBillsRequest {
    bills: Bill[];
    billYear: string;
    billMonth: string;
}

export interface GetBillsQueryParams {
    pageNumber: number;
    pageSize: number;
    generatorId?: number;
    subscriberName?: string;
    statusCode?: string;
    billDateFrom?: string;
    billDateTo?: string;
    subscriberPhoneNumber?: string;
    keyword?: string;
}

export interface UpsertSubscriptionBillingModelRequest extends SubscriptionBillingModel {}

export interface CreateSmsCampaignRequest {
    templateId: number;
    campaignName: string;
    subscriberIds?: number[];
    billIds?: number[];
}

export interface GetSmsCampaignsQueryParams {
    pageNumber: number;
    pageSize: number;
    status?: string;
    fromDate?: string;
    ToDate?: string;
}

export interface GetSmsCampaignDetailsQueryParams {
    id: number;
    pageNumber: number;
    pageSize: number;
    status?: string;
    phoneNumber?: string;
    subscriberName?: string;
}

export interface GetCurrencyRatesQueryParams {
    fromCurrencyCode?: string;
    toCurrencyCode?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface UpsertCurrencyRatesRequest {
    rates: CurrencyRate[];
}

export interface GetWalletTransactionsQueryParams {
    pageNumber?: number;
    pageSize?: number;
    fromDate?: string;
    toDate?: string;
    type?: string;
}

export interface WalletForecastRequest {
    subscriberCount?: number;
    smsCount?: number;
    selectionCriteriaType?: string;
    customSubscriberIds?: number[];
    billIds?: number[];
    templateId?: number;
    subscriberIds?: number[];
}

export interface UpdateBillRequest {
    billId: number;
    subscriberId: number;
    subscriberFirstName: string;
    subscriberLastName: string;
    billDate: string;
    billYear: string;
    billMonth: string;
    previousKva: number;
    currentKva: number;
    kvaFee: number;
    subscriptionFeeVar: number;
    subscriptionFeeFixed: number;
    currencyCode: string;
    amount: number;
    notes: string;
    subscriptionAmps: number;
    statusCode: string;
    status: string;
}

export interface GetBillsByCodeQueryParams {
    SubscriberBillCode: string;
}

export interface GetKVAReadingsPerGeneratorQueryParams {
    generatorId: number;
}

export interface UpdateKVAReadingRequest {
    id: number;
    kvaReading: number;
    status: string;
}

export interface GenerateBillsForMeteredSubscribersRequest {
    kvaReadingIds: number[];
    billYear: string;
    billMonth: string;
}

export interface GenerateBillsForAllFixedSubscribersRequest {
    generatorId: number;
    billYear: string;
    billMonth: string;
}

export interface GetAnnouncementsQueryParams {
    pageNumber?: number;
    pageSize?: number;
    isRead?: boolean;
    includeDeleted?: boolean;
}

export interface MarkAnnouncementAsReadRequest {
    announcementId: number;
}

export interface UpsertKVAReadingRequest {
    id: number;
    subscriberId: number;
    kvaReading: number;
    status: string;
    imageFile?: File;
}

export interface GetDashboardQueryParams {
    period?: string;
    includeTrends?: boolean;
    includeForecasts?: boolean;
}

export interface UpdateGeneratorOwnerRequest {
    id: number; // -1 for create
    username: string;
    password?: string | null; // required on create only
    firstName: string;
    lastName: string;
    businessName: string;
    phoneNumber: string;
    smsDisplayName?: string | null;
    gracePeriodDays?: number | null;

    // Currency rates
    currencyRates?: CurrencyRate[] | null;

    // Pricing
    fixedPlatformFeeMonthly?: number | null;
    pricePerSubscriberMonthly: number;
    pricePerSms: number;

    isYearlyPayment: boolean;
    yearlyDiscountFixedFee?: number | null;
    yearlyDiscountPerSubscriber?: number | null;
    yearlyDiscountPerSms?: number | null;

    freeTrialMonths: number;
    freeTrialEnabled: boolean;
    billingCycleDays: number;
    billingStartDate?: string | null;

    // Wallet (create-only in UI)
    initialBalance?: number | null;
    paymentMethod?: string | null;
    overrideWalletCap?: number | null;
    overrideCapReason?: string | null;
    topUpReferenceNumber?: string | null;
}

export interface ReactivateGeneratorOwnerRequest {
    generatorOwnerUserId: number;
    reason: string;
}

export interface DeactivateGeneratorOwnerRequest {
    generatorOwnerUserId: number;
    reason: string;
}

export interface GetKVAReadingsQueryParams {
    pageNumber: number;
    pageSize: number;
    generatorId?: number;
    subscriberId?: number;
    status?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    keyword?: string;
}

export interface GetAdminAnnouncementsQueryParams {
    pageNumber: number;
    pageSize: number;
    isPublished?: boolean;
    keyword?: string;
}

export interface UpsertAnnouncementRequest {
    id: number;
    title: string;
    content: string;
    expiresAt: string;
    priority: string;
}

export interface PublishAnnouncementRequest {
    announcementId: number;
    publishToAll: boolean;
    generatorOwnerUserIds: number[];
}

export interface GetSmsTemplatesQueryParams {
    generatorOwnerUserId: number;
    roleCode?: string;
}

export interface UpsertSmsTemplateRequest {
    id: number;
    generatorOwnerUserId: number;
    name: string;
    nameAr: string;
    body: string;
    bodyAr: string;
    language: string;
    roleCode: string;
    isActive: boolean;
}

export interface TopUpGoWalletRequest {
    generatorOwnerUserId: number;
    amount: number;
    paymentMethod: string;
    referenceNumber: string;
    notes: string;
}

export interface SetCapOverrideGoWalletRequest {
    generatorOwnerUserId: number;
    overrideCap: number;
    reason: string;
}

export interface GetGoWalletTransactionsQueryParams {
    generatorOwnerUserId: number;
    PageNumber: number;
    PageSize: number;
    FromDate?: string;
    ToDate?: string;
    Type?: string;
}

export interface GetGoSmsTemplatesQueryParams {
    roleCode?: string;
}

export interface GetBillsForSmsQueryParams {
    role: string;
}

export interface GetAddressHintsQueryParams {
    query?: string;
}

export interface GetCitiesQueryParams {
    country: string;
}

export interface GetStreetsQueryParams {
    country: string;
    city: string;
}

export interface GetBuildingsQueryParams {
    country: string;
    city: string;
    street: string;
}

export interface BulkUpdateAddressesRequest {
    fieldName: string;
    oldValue: string;
    newValue: string;
}

export interface UpsertExtraFeeRequest {
    id: number;
    name: string;
}

export interface GetBillReportByCodeQueryParams {
    subscriberBillCode: string;
    billId: number;
}

export interface ScanBillBarcodeRequest {
    billId: number;
}

export interface GetBillCollectionsQueryParam {
    pageNumber: number;
    pageSize: number;
    billId?: number;
    collectionStatus?: string;
    collectionScope?: string;
    createdFrom?: string;
    createdTo?: string;
    billCollectorId?: number;
}

export interface ApproveOrRejectBillCollectionRequest {
    collectionIds: number[];
    approve: boolean;
}

export interface PayBillsInBulkRequest {
    billIds: number[];
}

export interface GetBillsByPeriodStatusQueryParam {
    billMonth: string;
    billYear: string;
    status: string;
    createdFrom?: string;
    createdTo?: string;
}

export interface GetBulkBillReportRequest {
    billIds: number[];
    paperSize: string;
}

export interface GetMonitoringActiveSessionsQueryParams {
    page: number;
    pageSize: number;
    role?: string;
    status?: string;
    country?: string;
    city?: string;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface GetMonitoringUserSessionsQueryParams {
    userId: number;
    from?: string;
    to?: string;
    role?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page: number;
    pageSize: number;
}

export interface GetMonitoringSessionActivityQueryParams {
    limit?: number;
    direction?: 'request' | 'response' | 'both';
}

export interface ForceLogoutMonitoringSessionRequest {
    reason: string;
}
