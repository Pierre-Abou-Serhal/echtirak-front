import { UserRole } from '@/core/enums/enum';
import { SmsMessage, SmsTemplate } from '@/core/models/model';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthSession {
    userId: number;
    role: UserRole;
    accessToken: string;
    refreshToken: string;
}

export interface SelectOptionNumValue {
    label: string;
    value: number;
}

export interface SelectOptionStrValue {
    label: string;
    value: string;
}

export interface DashboardSubscribers {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    newThisWeek: number;
}

export interface DashboardBills {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
    thisMonth: DashboardBillsPeriod;
    lastMonth: DashboardBillsPeriod;
}

export interface DashboardBillsPeriod {
    count: number;
    revenue: number;
}

export interface DashboardConsumption {
    totalKva: number;
    averageKvaPerSubscriber: number;
    totalKvaThisMonth: number;
}

export interface DashboardRecentActivity {
    newSubscribersLast7Days: number;
    billsGeneratedLast7Days: number;
    billsPaidLast7Days: number;
}

export interface DashboardWallet {
    balance: number;
    projectedNextCycleCharge: number;
    availableBalance: number;
    effectiveCap: number;
    defaultCap: number;
    overrideCap: number;
    daysUntilNextBilling: number;
    nextBillingDate: string;
    warningMessage: string;
}

export interface DashboardWalletStatistics {
    topUpsThisMonth: number;
    spentThisMonth: number;
    smsChargesThisMonth: number;
    billingChargesThisMonth: number;
    refundsThisMonth: number;
    transactionsThisMonth: number;
    topUpsLastMonth: number;
    spentLastMonth: number;
    topUpsLast7Days: number;
    transactionsLast7Days: number;
    totalTopUpsAllTime: number;
    totalSpentAllTime: number;
    totalTransactionsAllTime: number;
    lastTransactionDate: string;
}

export interface SmsCampaignStatistics {
    totalSubscribers: number;
    totalSmsSent: number;
    totalSmsDelivered: number;
    totalSmsFailed: number;
    totalSmsPending: number;
    deliveryRate: number;
    failureRate: number;
    pendingRate: number;
    statusBreakdown: { [key: string]: number };
}

export interface SmsCampaignDetail {
    id: number;
    campaignName: string;
    selectionCriteriaType: string;
    status: string;
    createdAt?: string;
    startedAt?: string;
    completedAt?: string;
    template: SmsTemplate;
}

export interface SmsCampaignDetailsMessage {
    items: SmsMessage[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
