import { Subscriber, User, Generator } from '@/core/models/model';
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
