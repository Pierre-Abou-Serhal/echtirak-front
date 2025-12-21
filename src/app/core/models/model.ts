import { UserRole } from '@/core/enums/enum';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
}

export class Subscriber {
    id: number = -1;
    generatorId: number = 0;
    generatorCode: string = '';
    phoneNumber: string = '';
    firstName: string = '';
    lastName: string = '';
    address: string = '';
    previousKva: number = 0;
    currentKva: number = 0;
    electricMeterNumber: string = '';
    subscriptionBillingModelId: number = 0;
    overrideAmount?: number;
    billingModel: string = '';
    subscriptionAmps: number = 0;
    amountFixed: number = 0;
    amountPerKva: number = 0;
    statusCode: string = '';
    createdAt: string = '';
    createdByUsername: string = '';
    modifiedAt: string = '';
    modifiedByUsername: string = '';
}

export interface Generator {
    id: number,
    code: string,
    description: string,
    location: string
}

export interface GeneratorOwnerProfile {
    firstName: string;
    lastName: string;
    businessName: string;
    phoneNumber: string;
    gracePeriodDays: number;
    smsDisplayName: string;
    username: string;
}

export interface BillCollectorProfile {
    id: number;
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface SmsTemplate {
    id: number;
    generatorOwnerUserId: number;
    name: string;
    nameAr?: string;
    body: string;
    bodyAr?: string;
    language: string;
    isActive: boolean;
    createdAt: string;
    modifiedAt: string;
}

export interface SubscriptionBillingModel {
    id: number;
    generatorId: number;
    generatorCode?: string;
    model: string;
    subscriptionAmps: number;
    amountFixed: number;
    amountPerKva: number;
}

export interface Lookup {
    id: number;
    domain: string;
    code: string;
    description: string;
}

export interface Bill {
    id: number;
    subscriberId: number;
    subscriberFirstName: string;
    subscriberLastName: string;
    generatorId: number;
    generatorCode: string;
    billDate: string;
    amount: number;
    currencyCode: string;
    statusCode: string;
    statusDescription: string;
    previousKva: number;
    currentKva: number;
    subscriptionAmps: number;
    kvaFee: number;
    subscriptionFeeVar: number;
    subscriptionFeeFixed: number;
    notes: string;
    generatedFrom: number;
    hasDuplicateBill: boolean;
    hasRecentPayment: boolean;
}


export interface SmsCampaign {
    id: number;
    campaignName: string;
    selectionCriteriaType: string;
    status: string;
    totalSubscribers: number;
    totalSmsSent: number;
    totalSmsDelivered: number;
    totalSmsFailed: number;
    totalSmsPending: number;
    createdAt: string;
}

export interface SmsMessage {
    id: number;
    campaignId: number;
    subscriberId: number;
    subscriberName: string;
    phoneNumber: string;
    messageBody: string;
    status: string;
    statusDescription: string;
    sentAt?: string;
    deliveredAt?: string ;
}

export interface WarningMessage {
    messageCode: string;
    message: string
}

export interface Currency {
    id: number;
    code: string;
    name: string;
}

export interface CurrencyRate {
    id: number;
    fromCurrencyCode: string;
    toCurrencyCode: string;
    date: string;
    rate: number;
}

export interface WalletBalance {
    balance: number;
    projectedNextCycleCharge: number;
    availableBalance: number;
    effectiveCap: number;
    defaultCap: number;
    overrideCap?: number;
    daysUntilNextBilling: number;
    nextBillingDate?: string;
    warningMessage?: string;
}

export interface WalletTransaction {
    id: number;
    timestamp: string;
    type: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    balanceAfter: number;
    refId: string;
    description: string;
}

export interface Forecast {
    forecastedCost: number;
    currentAvailableBalance: number;
    newAvailableBalance: number;
    isAffordable: boolean;
    warningMessage: string;
    message: string;
}

export interface KvaReading {
    id: number;
    billCollectorUserId: number;
    subscriberId: number;
    subscriberFirstName: string;
    subscriberLastName: string;
    subscriberPhoneNumber: string;
    electricMeterNumber: string;
    generatorId: number;
    generatorCode: string;
    kvaReading: number;
    kvaPrevious: number;
    kvaCurrent: number;
    kvaReadingUrl: string;
    status: string;
    statusDomain: string;
    createdAt: string;
    createdBy: string;
    modifiedAt: string;
    modifiedBy: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: string;
    createdAt: string;
    publishedAt: string;
    expiresAt: string;
    isRead: boolean;
    readAt: string;
    isDeleted: boolean;
    deletedAt: string;
    receivedAt: string;
}

export interface AdminGeneratorOwnerProfile {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    businessName: string;
    phoneNumber: string;
    smsDisplayName: string;
    gracePeriodDays: number;
    currencyRates: CurrencyRate[];
    fixedPlatformFeeMonthly: number;
    pricePerSubscriberMonthly: number;
    pricePerSms: number;
    isYearlyPayment: boolean;
    yearlyDiscountFixedFee: number;
    yearlyDiscountPerSubscriber: number;
    yearlyDiscountPerSms: number;
    freeTrialMonths: number;
    freeTrialEnabled: boolean;
    billingCycleDays: number;
    billingStartDate: string;
    initialBalance: number;
    paymentMethod: string;
    overrideWalletCap: number;
    overrideCapReason: string;
}

export interface AdminAnnouncement {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    publishedAt: string;
    expiresAt: string;
    priority: string;
    createdAt: string;
    createdBy: number;
    createdByUsername: string;
    modifiedAt: string;
    modifiedBy: number;
    modifiedByUsername: string;
    recipientCount: number;
    readCount: number;
}
