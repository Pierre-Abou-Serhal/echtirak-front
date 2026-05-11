import {
    Subscriber,
    User,
    Generator,
    GeneratorOwnerProfile,
    BillCollectorProfile,
    SmsTemplate,
    SubscriptionBillingModel,
    Lookup,
    Bill,
    SmsCampaign,
    WarningMessage,
    CurrencyRate,
    Currency,
    WalletBalance,
    WalletTransaction,
    Forecast,
    KvaReading,
    Announcement,
    AdminGeneratorOwnerProfile,
    AdminAnnouncement,
    ExtraFee,
    BillCollection
} from '@/core/models/model';
import {
    SubscriberAddress,
    AdminDashboard,
    DashboardBills,
    DashboardConsumption,
    DashboardRecentActivity,
    DashboardSubscribers,
    DashboardWallet,
    DashboardWalletStatistics,
    SmsCampaignDetail,
    SmsCampaignDetailsMessage,
    SmsCampaignStatistics,
    TokenPair,
    DashboardCollectionsSummary,
    DashboardBillCollectorBreakdown,
    DashboardCollectionChannelSplit,
    DashboardTopDebtor,
    DashboardAccounting
} from '@/core/dtos/dto';

// Auth Response
export interface SignInResponse {
    user: User;
    token: TokenPair;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

//Generator Owner Response
export interface GetSubscribersPage {
    items: Subscriber[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetSubscribersResponse {
    page: GetSubscribersPage;
}

export interface UpsertSubscriberResponse extends Subscriber {}

export interface GetGeneratorsResponse {
    generators: Generator[];
}

export interface UpsertGeneratorResponse {
    generator: Generator;
}

export interface UpdateGeneratorOwnerProfileResponse {
    profile: GeneratorOwnerProfile;
}

export interface GetGeneratorOwnerProfileResponse {
    profile: GeneratorOwnerProfile;
}

export interface GetBillCollectorForGOResponse {
    collectors: BillCollectorProfile[];
}

export interface UpsertBillCollectorResponse {
    collector: BillCollectorProfile;
}

export interface GetSmsTemplatesResponse {
    templates: SmsTemplate[];
}

export interface GetSubscriptionBillingModelResponse {
    models: SubscriptionBillingModel[];
}

export interface GetLookupResponse {
    items: Lookup[];
}

export interface GenerateBillsForSelectedSubscribersResponse {
    bills: Bill[];
}

export interface AcceptBillsResponse {
    success: boolean;
    billsInserted: number;
}

export interface GenerateAllBillsResponse {
    bills: Bill[];
}

export interface GetBillsResponse {
    page: GetBillsPage;
}

export interface GetBillsPage {
    items: Bill[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface UpsertSubscriptionBillingModelResponse {
    model: SubscriptionBillingModel;
}

export interface GetGeneratorOwnerDashboardResponse {
    subscribers: DashboardSubscribers;
    bills: DashboardBills;
    consumption: DashboardConsumption;
    accounting: DashboardAccounting;
    recentActivity: DashboardRecentActivity;
    collectionsSummary: DashboardCollectionsSummary;
    billCollectorBreakdown: DashboardBillCollectorBreakdown[];
    collectionChannelSplit: DashboardCollectionChannelSplit;
    topDebtors: DashboardTopDebtor[];
    wallet: DashboardWallet;
    walletStatistics: DashboardWalletStatistics;
}

export interface GetSmsCampaignPage {
    items: SmsCampaign[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetSmsCampaignsResponse {
    page: GetSmsCampaignPage;
}

export interface CreateSmsCampaignResponse extends SmsCampaign {}

export interface GetSmsCampaignDetailsResponse {
    campaign: SmsCampaignDetail;
    statistics: SmsCampaignStatistics;
    messages: SmsCampaignDetailsMessage;
}

export interface GetWarningMessagesResponse {
    messages: WarningMessage[];
}

export interface GetCurrenciesResponse {
    currencies: Currency[];
}

export interface GetCurrencyRatesResponse {
    rates: CurrencyRate[];
}

export interface UpsertCurrencyRatesResponse {
    rates: CurrencyRate[];
}

export interface GetWalletBalancesResponse {
    balance: WalletBalance;
}

export interface GetWalletTransactionsResponse {
    page: GetWalletTransactionsPage;
}

export interface GetWalletTransactionsPage {
    items: WalletTransaction[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface WalletForecastResponse {
    forecast: Forecast;
}

export interface UpdateBillResponse {
    response: {
        oldBill: Bill;
        newBill: Bill;
    };
}

export interface GetBillsByCodeResponse {
    page: GetBillsByCodePage;
}

export interface GetBillsByCodePage {
    items: Bill[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetKVAReadingsPerGeneratorResponse {
    readings: KvaReading[];
}

export interface UpdateKVAReadingResponse {
    reading: KvaReading;
}

export interface GenerateBillsForMeteredSubscribersResponse {
    bills: Bill[];
    hasDuplicateBills: boolean;
}

export interface GenerateBillsForAllFixedSubscribersResponse {
    bills: Bill[];
    hasDuplicateBills: boolean;
}

export interface GetAnnouncementsResponse {
    page: GetAnnouncementsPage;
}

export interface GetAnnouncementsPage {
    items: Announcement[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetAnnouncementsUnreadCountResponse {
    count: {
        unreadCount: number;
    };
}

export interface GetKvaReadingPerBillCollectorResponse {
    readings: KvaReading[];
}

export interface UpsertKVAReadingResponse {
    reading: KvaReading;
}

export interface GetDashboardResponse {
    dashboard: AdminDashboard;
}

export interface GetGeneratorOwnersResponse {
    owners: AdminGeneratorOwnerProfile[];
}

export interface UpdateGeneratorOwnerResponse {
    owner: AdminGeneratorOwnerProfile;
}

export interface ReactivateGeneratorOwnerResponse {
    response: {
        generatorOwnerUserId: number;
        previousStatus: string;
        newStatus: string;
        pendingBillingCycleAmount: 0;
        newBalance: number;
        reactivatedAt: string;
    };
}

export interface DeactivateGeneratorOwnerResponse {
    response: {
        generatorOwnerUserId: number;
        statusCode: string;
        deactivatedAt: string;
        reason: string;
    };
}

export interface GetKVAReadingsResponse {
    page: GetKVAReadingsPage;
}

export interface GetKVAReadingsPage {
    items: KvaReading[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetAdminAnnouncementsResponse {
    page: GetAdminAnnouncementsPage;
}

export interface GetAdminAnnouncementsPage {
    items: AdminAnnouncement[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface UpsertAnnouncementResponse {
    announcement: AdminAnnouncement;
}

export interface PublishAnnouncementResponse {
    response: {
        announcementId: number;
        recipientCount: number;
        isPublished: boolean;
        publishedAt: string;
    };
}

export interface UpsertSmsTemplateResponse {
    template: SmsTemplate;
}

export interface TopUpGoWalletResponse {
    topUp: {
        topUpId: number;
        walletTransactionId: number;
        generatorOwnerUserId: number;
        amount: number;
        newBalance: number;
        paymentMethod: string;
        referenceNumber: string;
        processedAt: string;
    };
}

export interface SetCapOverrideGoWalletResponse {
    capOverride: {
        generatorOwnerUserId: number;
        oldCap: number;
        newOverrideCap: number;
        effectiveCap: number;
        reason: string;
        setByUserId: number;
        setAt: string;
    };
}

export interface GetGoWalletBalanceResponse {
    balance: {
        balance: number;
        projectedNextCycleCharge: number;
        availableBalance: number;
        effectiveCap: number;
        defaultCap: number;
        overrideCap: number;
        daysUntilNextBilling: number;
        nextBillingDate: string;
        warningMessage: string;
    };
}

export interface GetGoWalletTransactionsResponse {
    page: GetGoWalletTransactionsPage;
}

export interface GetGoWalletTransactionsPage {
    items: WalletTransaction[];
    pageNumber: 0;
    pageSize: 0;
    totalCount: 0;
    totalPages: 0;
    hasNext: true;
    hasPrevious: true;
}

export interface GetGoStatusResponse {
    status: {
        generatorOwnerUserId: number;
        statusCode: string;
        canUsePlatform: boolean;
    };
}

export interface GetBillsForSmsResponse {
    bills: Bill[];
}

export interface GetAddressHintsResponse {
    hints: SubscriberAddress[];
}

export interface GetCountriesResponse {
    values: string[];
}

export interface GetCitiesResponse {
    values: string[];
}

export interface GetStreetsResponse {
    values: string[];
}

export interface GetBuildingsResponse {
    values: string[];
}

export interface GetExtraFeesResponse {
    extraFees: ExtraFee[];
}

export interface UpsertExtraFeeResponse {
    extraFee: ExtraFee;
}

export interface ScanBillBarcodeResponse {
    item: BillCollection;
}

export interface BCGetBillCollectionsResponse {
    items: BCGetBillCollectionsItem[];
    page: BCGetBillCollectionsPage;
    summary: BCGetBillCollectionsSummary;
}

export interface BCGetBillCollectionsItem {
    billCollectorId: number;
    billCollectorName: string;
    bcCollections: BillCollection[];
    bcStats: BCGetBillCollectionsBcStats;
}

export interface BCGetBillCollectionsBcStats {
    collectionsCount: number;
    collectionsAmount: number;
    amountSharePct: number;

    pendingApprovalCount: number;
    pendingApprovalAmount: number;

    approvedCount: number;
    approvedAmount: number;

    rejectedCount: number;
    rejectedAmount: number;
}

export interface BCGetBillCollectionsPage {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface BCGetBillCollectionsSummary {
    collectionsCount: number;
    collectionsAmount: number;

    pendingApprovalCount: number;
    pendingApprovalAmount: number;

    approvedCount: number;
    approvedAmount: number;

    rejectedCount: number;
    rejectedAmount: number;
}

export interface GoGetBillCollectionsResponse {
    items: GOGetBillCollectionsItem[];
    page: GOGetBillCollectionsPage;
    summary: GOGetBillCollectionsSummary;
}

export interface GOGetBillCollectionsItem {
    billCollectorId: number;
    billCollectorName: string;
    bcCollections: BillCollection[];
    bcStats: GOGetBillCollectionsBcStats;
}

export interface GOGetBillCollectionsBcStats {
    collectionsCount: number;
    collectionsAmount: number;
    amountSharePct: number;
    pendingApprovalCount: number;
    pendingApprovalAmount: number;
    approvedCount: number;
    approvedAmount: number;
    rejectedCount: number;
    rejectedAmount: number;
}

export interface GOGetBillCollectionsPage {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GOGetBillCollectionsSummary {
    collectionsCount: number;
    collectionsAmount: number;
    pendingApprovalCount: number;
    pendingApprovalAmount: number;
    approvedCount: number;
    approvedAmount: number;
    rejectedCount: number;
    rejectedAmount: number;
}

export interface ApproveOrRejectBillCollectionResponse {
    updatedCount: number;
}

export interface PayBillsInBulkResponse {
    updatedCount: number;
}

export interface GetBillsByPeriodStatusResponse {
    bills: Bill[];
}

export interface GetMonitoringStatsResponse {
    stats: MonitoringStats;
}

export interface MonitoringStats {
    totalOnline: number;
    totalIdle: number;
    lastUpdatedAt: string;
    byRole: Record<string, number>;
    byCountry: Record<string, number>;
    topCities: MonitoringTopCity[];
}

export interface MonitoringTopCity {
    country: string;
    city: string | null;
    count: number;
}

export interface GetMonitoringActiveSessionsResponse {
    page: MonitoringActiveSessionsPage;
}

export interface MonitoringActiveSessionsPage {
    items: MonitoringSession[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
}

export interface MonitoringSession {
    sessionId: number;
    userId: number;
    username: string;
    fullName: string;
    roleCode: string;
    status: string;
    lastSeenAt: string;
    signedInAt: string;
    country: string | null;
    city: string | null;
    deviceType: string | null;
    browser: string | null;
    refreshCount: number;
    lastEndpoint: string | null;
}

export interface GetMonitoringUserSessionsResponse {
    page: MonitoringUserSessionsPage;
}

export interface MonitoringUserSessionsPage {
    items: MonitoringUserSession[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
}

export interface MonitoringUserSession {
    sessionId: number;
    userId: number;
    username: string;
    fullName: string;
    roleCode: string;
    status: string;
    signedInAt: string;
    lastSeenAt: string;
    loggedOutAt: string | null;
    logoutReason: string | null;
    refreshCount: number;
    country: string | null;
    city: string | null;
    deviceType: string | null;
    browser: string | null;
    durationSeconds: number | null;
}

export interface GetMonitoringSessionDetailResponse {
    session: MonitoringSessionDetail;
}

export interface MonitoringSessionDetail {
    sessionId: number;
    userId: number;
    username: string;
    fullName: string;
    roleCode: string;
    status: string;
    signedInAt: string;
    lastSeenAt: string;
    loggedOutAt: string | null;
    logoutReason: string | null;
    refreshCount: number;
    rootRefreshTokenId: number | null;
    currentRefreshTokenId: number | null;
    ipAddress: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    userAgentRaw: string | null;
    deviceType: string | null;
    os: string | null;
    osVersion: string | null;
    browser: string | null;
    browserVersion: string | null;
    language: string | null;
    cfRay: string | null;
}

export interface GetMonitoringSessionActivityResponse {
    items: MonitoringSessionActivity[];
}

export interface MonitoringSessionActivity {
    requestId: string;
    lastTime: string;
    endpointName: string | null;
    httpMethod: string | null;
    requestPath: string | null;
    screenName: string | null;
    lastStatusCode: number | null;
    rowCount: number;
}

export interface GetMonitoringActivityDetailResponse {
    items: MonitoringActivityDetailRow[];
}

export interface MonitoringActivityDetailRow {
    id: number;
    time: string;
    requestId: string;
    requestDirection: string;
    endpointName: string | null;
    httpMethod: string | null;
    statusCode: number | null;
    requestPath: string | null;
    correlationId: string | null;
    userId: number | null;
    userSessionId: number | null;
    screenName: string | null;
    message: string | null;
    json: string | null;
    serviceName: string | null;
    sourceContext: string | null;
    logLevel: string | null;
    exception: string | null;
}

export interface GetMonitoringMapResponse {
    buckets: MonitoringMapBucket[];
}

export interface MonitoringMapBucket {
    country: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    count: number;
}

export interface ForceLogoutMonitoringSessionResponse {
    result: {
        logged: boolean;
        rowsAffected: number;
    };
}

export interface GetMonitoringUsersResponse {
    users: User[];
}
