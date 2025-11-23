export enum UserRole {
    GENERATOR_OWNER = "GENERATOR_OWNER",
    BILL_COLLECTOR = "BILL_COLLECTOR",
    ADMIN = "ADMIN",
}

export enum SubscriberStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum BillStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    PAID = "PAID",
}

export enum BillingModel {
    FIXED = "Fixed",
    METERED = "Metered",
}

export enum LookupDomain {
    BILL_STATUS = "BILL_STATUS",
    BILLING_MODE = "BILLING_MODE",
    SUBSCRIBER_STATUS = "SUBSCRIBER_STATUS",
    USER_ROLE = "USER_ROLE",
}
