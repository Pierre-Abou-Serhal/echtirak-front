import { UserRole } from '@/core/enums/enum';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
}

export interface Subscriber {
    id: number;
    generatorId: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    previousKva: number;
    subscriptionAmps: number;
    currentKva: number;
    electricMeterNumber: string;
    billingModeCode: string;
    statusCode: string;
}
