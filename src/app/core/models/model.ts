import { UserRole } from '@/core/enums/enum';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
}

export class Subscriber {
    id: number = -1;
    generatorId: number = 0;
    phoneNumber: string = '';
    firstName: string = '';
    lastName: string = '';
    previousKva: number = 0;
    subscriptionAmps: number = 0;
    currentKva: number = 0;
    electricMeterNumber: string = '';
    billingModeCode: string = '';
    statusCode: string = '';
}

export interface Generator {
    id: number,
    code: string,
    description: string,
    location: string
}

export interface GeneratorOwnerProfile {
    firstName: string,
    lastName: string,
    businessName: string,
    phoneNumber: string
}

export interface BillCollectorProfile {
    id: number;
    userId: number;
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}
