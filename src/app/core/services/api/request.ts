// Auth Requests
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
    subscriptionAmps?: number;
    currentKva?: number;
    electricMeterNumber?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    modifiedBy?: string;
    keyword?: string;
}
