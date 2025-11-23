import { UserRole } from '@/core/enums/enum';

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
