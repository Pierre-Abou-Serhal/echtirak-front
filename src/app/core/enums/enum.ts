export enum UserRole {
    GENERATOR_OWNER = 'GENERATOR_OWNER',
    BILL_COLLECTOR = 'BILL_COLLECTOR',
    ADMIN = 'ADMIN'
}

export enum SubscriberStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    MARKED_FOR_DEACTIVATION = 'MARKED_FOR_DEACTIVATION'
}

export enum BillStatus {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    PAID = 'PAID'
}

export enum BillingModel {
    FIXED = 'Fixed',
    METERED = 'Metered'
}

export enum SmsCampaignStatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED'
}

export enum SmsMessageStatus {
    FAILED = 'FAILED',
    DELIVERED = 'DELIVERED',
    SENT = 'SENT',
    PENDING = 'PENDING'
}

export enum KvaReadingStatus {
    PENDING = 'PENDING',
    BILLED = 'BILLED',
    CANCELLED = 'CANCELLED'
}

export enum LookupDomain {
    BILL_STATUS = 'BILL_STATUS',
    BILLING_CYCLE_STATUS = 'BILLING_CYCLE_STATUS',
    BILLING_MODE = 'BILLING_MODE',
    GO_STATUS = 'GO_STATUS',
    PAYMENT_METHOD = 'PAYMENT_METHOD',
    SMS_CAMP_SEL_CRITERIA = 'SMS_CAMP_SEL_CRITERIA',
    SMS_CAMPAIGN_STATUS = 'SMS_CAMPAIGN_STATUS',
    SMS_JOB_STATUS = 'SMS_JOB_STATUS',
    SMS_STATUS = 'SMS_STATUS',
    SMS_TEMPLATE_VARIABLE = 'SMS_TEMPLATE_VARIABLE',
    SUBSCRIBER_STATUS = 'SUBSCRIBER_STATUS',
    USER_ROLE = 'USER_ROLE',
    WALLET_TRANSACTION_TYPE = 'WALLET_TRANSACTION_TYPE',
    KVA_READING_STATUS = 'KVA_READING_STATUS',
    SMS_TEMPLATE_ROLE = 'SMS_TEMPLATE_ROLE',
    GENERATOR_STATUS = 'GENERATOR_STATUS'
}

export enum AnnouncementFilterType {
    READ = 'READ',
    UNREAD = 'UNREAD'
}

export enum DataViewLayout {
    LIST = 'list',
    GRID = 'grid'
}

export enum AnnouncementPriority {
    URGENT = 'URGENT',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export enum GeneratorOwnerStatus {
    ACTIVE = 'ACTIVE',
    DEACTIVATED = 'DEACTIVATED',
    SUSPENDED = 'SUSPENDED'
}

export enum BillIssuedSmsStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED',
    SENT = 'SENT'
}

export enum BillOverdueSmsStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    FAILED = 'FAILED',
    SENT = 'SENT'
}

export enum BillAction {
    EDIT = 'EDIT',
    PAY = 'PAY',
    CANCEL = 'CANCEL'
}

export enum SmsTemplateRole {
    BILL_ISSUANCE = 'BILL_ISSUANCE',
    OVERDUE_BILL = 'OVERDUE_BILL',
    SUBSCRIBER = 'SUBSCRIBER'
}

export enum AddressFields {
    COUNTRY = 'Country',
    CITY = 'City',
    STREET = 'Street',
    BUILDING = 'Building'
}
