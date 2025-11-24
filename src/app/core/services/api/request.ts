// Auth Requests
import {
    Bill,
    BillCollectorProfile,
    Generator,
    GeneratorOwnerProfile,
    Subscriber,
    SubscriptionBillingModel
} from '@/core/models/model';

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
}
export interface UpsertSubscriberRequest extends Subscriber {}

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

export interface GenerateBillsRequest {
    generatorId: number;
    subscriberIds: number[];
}

export interface AcceptBillsRequest {
    bills: Bill[];
}

export interface GenerateAllBillsRequest {
    generatorId: number;
}

export interface GetBillsQueryParams {
    pageNumber: number;
    pageSize: number;
    generatorId?: number;
    subscriberName?: string;
    statusCode?: string;
    billDateFrom?: string;
    billDateTo?: string
}

export interface UpsertSubscriptionBillingModelRequest extends SubscriptionBillingModel {}
