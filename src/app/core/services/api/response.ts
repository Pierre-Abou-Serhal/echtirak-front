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
    AdminGeneratorOwnerProfile
} from '@/core/models/model';
import {
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
    TokenPair
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
    recentActivity: DashboardRecentActivity;
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

export interface CreateSmsCampaignResponse {
    campaign: SmsCampaign;
}

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
