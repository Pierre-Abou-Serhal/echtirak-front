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

export enum BillingMode {
    FIXED = "FIXED",
    METERED = "METERED",
}
