import {
    Subscriber,
    User,
    Generator,
    GeneratorOwnerProfile,
    BillCollectorProfile,
    SmsTemplate, SubscriptionBillingModel, Lookup, Bill
} from '@/core/models/model';
import { TokenPair } from '@/core/dtos/dto';

// Auth Response
export interface SignInResponse {
    user: User,
    token: TokenPair
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

//Generator Owner Response
export interface GetSubscribersPage {
    items: Subscriber[],
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean
}

export interface GetSubscribersResponse {
    page: GetSubscribersPage
}

export interface UpsertSubscriberResponse extends Subscriber {}

export interface GetGeneratorsResponse {
    generators: Generator[]
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

export interface GenerateBillsResponse {
    bills: Bill[];
}

export interface AcceptBillsResponse {
    success: boolean;
    billsInserted: number
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
