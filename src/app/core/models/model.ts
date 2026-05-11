import { UserRole } from '@/core/enums/enum';
import { SubscriberAddress } from '@/core/dtos/dto';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
    displayName: string;
    statusCode: string;
}

export class Subscriber {
    id: number = -1;
    generatorId: number = 0;
    generatorCode: string = '';
    phoneNumber: string = '';
    firstName: string = '';
    lastName: string = '';
    address?: SubscriberAddress | null = null;
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
    smsEnabled: boolean = false;
    preferredLanguage?: string | null;
    lastBilledAt?: string | null;
    publicViewUrl?: string;
    subscriberBillCode?: string;
    extraFees?: ExtraFee[];
}

// TODO: `capacityUnit` is mandatory if `capacity` is provided
export interface Generator {
    id: number;
    code: string;
    description: string;
    location: string;
    size?: string;
    capacity?: number;
    capacityUnit?: string;
    model?: string;
    manufacturer?: string;
    serialNumber?: string;
    voltage?: string;
    phase?: string;
    frequency?: string;
    amperage?: number;
    statusCode?: string;
    statusDescription?: string;
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
    userId?: number;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface SmsTemplate {
    id: number;
    generatorOwnerUserId: number;
    name: string;
    nameAr?: string;
    body: string;
    bodyAr?: string;
    language: string;
    roleCode: string;
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
    name: string;
}

export interface Lookup {
    id: number;
    domain: string;
    code: string;
    description: string;
}

export interface Bill {
    id: number;
    billReference?: number;
    kvaReadingId?: number;
    subscriberId: number;
    subscriberFirstName: string;
    subscriberLastName: string;
    generatorId: number;
    generatorCode: string;
    billDate: string;
    billYear: string;
    billMonth: string;
    dueDate: string;
    amount: number;
    amountLBP?: string;
    exchangeRate?: number;
    currencyCode: string;
    statusCode: string;
    statusDescription: string;
    subscriberPhoneNumber: string;
    billIssuedSmsStatus: string;
    billOverdueSmsStatus: string;
    previousKva: number;
    currentKva: number;
    subscriptionAmps: number;
    kvaFee: number;
    subscriptionFeeVar: number;
    subscriptionFeeFixed: number;
    notes: string;
    amountPerKva: number;
    generatedFrom: number;
    hasDuplicateBill: boolean;
    duplicateMessage: string;
    hasRecentPayment: boolean;
    billingModel: string;
    paidAt?: string;
    extraFees?: ExtraFee[] | null;
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
    isActive: boolean;
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
    statusCode: string;
    statusDomain: string;
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
    overrideCapSetAt: string;
    topUpReferenceNumber: string;
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

// Used in Bills and Subscribers
export interface ExtraFee {
    id?: number;
    extraFeeId?: number;
    billId?: number;
    subscriberId?: number;
    name?: string;
    extraFeeName?: string;
    amount?: number;
    amountLBP?: string;
    isActive?: boolean;
    createdAt?: string;
}

export interface BillCollection {
    id: number;
    billId: number;
    billCollectorUserId: number;
    billCollectorName: string;
    amount: number;
    currencyCode: string;
    statusCode: string;
    collectionStatus: string;
    createdAt: string;
}
