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

// Admin Dashboard
export interface AdminDashboard {
    platformOverview: PlatformOverview;
    financialMetrics: FinancialMetrics;
    growthMetrics: GrowthMetrics;
    usageMetrics: UsageMetrics;
    healthMetrics: HealthMetrics;
    consumptionMetrics: ConsumptionMetrics;
    operationalMetrics: OperationalMetrics;

    monthlyTrends: TrendPoint[];
    weeklyTrends: TrendPoint[];
    dailyTrends: TrendPoint[];

    topPerformers: TopPerformer[];

    forecasts: Forecasts;
    accountingSummary: AccountingSummary;
}

export interface PlatformOverview {
    totalGeneratorOwners: number;
    activeGeneratorOwners: number;
    inactiveGeneratorOwners: number;

    totalSubscribers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;

    totalGenerators: number;

    totalBillsGenerated: number;
    totalBillsThisMonth: number;
    totalBillsLastMonth: number;

    totalBillCollectors: number;

    platformAgeDays: number;
    firstGoSignupDate: string;
}

export interface FinancialMetrics {
    totalWalletTopUpsAllTime: number;
    totalWalletTopUpsThisMonth: number;
    totalWalletTopUpsLastMonth: number;

    totalChargesDeductedAllTime: number;
    totalChargesDeductedThisMonth: number;
    totalChargesDeductedLastMonth: number;

    totalRefundsAllTime: number;

    netPlatformRevenueAllTime: number;
    averageRevenuePerGoThisMonth: number;
    averageRevenuePerGoAllTime: number;

    revenueGrowthRateMoM: number;
    revenueGrowthRateYoY: number;

    totalWalletBalances: number;
    averageBalancePerGo: number;

    gosWithLowBalances: number;
    totalProjectedShortfall: number;
    totalProjectedNextCycleCharges: number;

    totalAvailableBalance: number;

    totalTopUpTransactionsAllTime: number;
    totalTopUpTransactionsThisMonth: number;

    totalBillingCycleChargesAllTime: number;
    totalBillingCycleChargesThisMonth: number;

    totalSmsChargesAllTime: number;
    totalSmsChargesThisMonth: number;

    totalBillingCycleChargesAmountAllTime: number;
    totalBillingCycleChargesAmountThisMonth: number;

    totalSmsChargesAmountAllTime: number;
    totalSmsChargesAmountThisMonth: number;

    totalRefundsAmountAllTime: number;
}

export interface GrowthMetrics {
    newSubscribersToday: number;
    newSubscribersThisWeek: number;
    newSubscribersThisMonth: number;
    newSubscribersLastMonth: number;

    subscriberGrowthRateMoM: number;
    subscriberGrowthRateYoY: number;

    averageSubscribersPerGo: number;

    newGosToday: number;
    newGosThisWeek: number;
    newGosThisMonth: number;
    newGosLastMonth: number;

    goGrowthRateMoM: number;
    goGrowthRateYoY: number;

    gosInFreeTrial: number;
    trialConversionRate: number;

    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;

    revenueGrowthVelocity: number;
}

export interface UsageMetrics {
    totalSmsSentAllTime: number;
    totalSmsSentThisMonth: number;
    totalSmsSentLastMonth: number;
    totalSmsSentToday: number;

    averageSmsPerGo: number;
    smsDeliveryRate: number;
    smsFailureRate: number;

    smsRevenue: number;

    billsGeneratedToday: number;
    billsGeneratedThisWeek: number;
    billsGeneratedThisMonth: number;

    averageBillsPerGo: number;
    billsPerSubscriberRatio: number;

    paymentRate: number;
    averageBillAmount: number;

    overdueBillsCount: number;
    overdueBillsAmount: number;

    gosUsingSmsCampaignsPercent: number;
    gosWithMultipleGeneratorsPercent: number;
    gosUsingBillCollectorsPercent: number;

    averageFeaturesUsedPerGo: number;
}

export interface HealthMetrics {
    activeGos: number;
    activeGosPercent: number;

    inactiveGos: number;
    inactiveGosPercent: number;

    deactivatedGos: number;
    deactivatedGosPercent: number;

    gosAtRisk: number;
    churnedGosLast30Days: number;

    churnRate: number;

    reactivatedGosLast30Days: number;
    retentionRate: number;

    billsPaidOnTimePercent: number;
    averagePaymentTimeDays: number;

    overdueBillsPercent: number;
    badDebtEstimation: number;
}

export interface ConsumptionMetrics {
    totalKvaConsumedAllTime: number;
    totalKvaConsumedThisMonth: number;
    averageKvaPerSubscriber: number;

    fixedBillingModelCount: number;
    meteredBillingModelCount: number;

    averageRevenuePerFixedModel: number;
    averageRevenuePerMeteredModel: number;
}

export interface OperationalMetrics {
    totalActiveBillCollectors: number;
    averageCollectorsPerGo: number;

    kvaReadingsSubmittedToday: number;
    kvaReadingsSubmittedThisMonth: number;

    averageGeneratorsPerGo: number;
}

export interface TrendPoint {
    period: string;
    periodStart: string;
    periodEnd: string;

    newGos: number;
    newSubscribers: number;
    revenue: number;

    smsSent: number;
    billsGenerated: number;
    billsPaid: number;
}

export interface TopPerformer {
    generatorOwnerUserId: number;
    businessName: string;
    username: string;

    metricType: string;
    metricValue: number;
    metricCount: number;
}

export interface Forecasts {
    projectedNextMonthRevenue: number;
    projectedAnnualRevenue: number;
    revenueGrowthTrajectory: number;

    projectedSubscriberCountNextMonth: number;
    projectedSubscriberCountNextQuarter: number;
    subscriberGrowthRateProjection: number;

    gosAtRiskOfChurning: number;
    estimatedRevenueAtRisk: number;
}

export interface AccountingSummary {
    thisMonth: AccountingPeriodSummary;
    lastMonth: AccountingPeriodSummary;
    allTime: AccountingPeriodSummary;

    averagePricingPerSubscriber: number;
    averagePricingPerSms: number;
    revenuePerSubscriber: number;
}

export interface AccountingPeriodSummary {
    totalIncome: number;
    totalExpenses: number;
    netRevenue: number;

    outstandingReceivables: number;
    accountsPayable: number;
}
