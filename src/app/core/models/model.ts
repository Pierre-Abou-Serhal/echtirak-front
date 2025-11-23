import { UserRole } from '@/core/enums/enum';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
}

export class Subscriber {
    id: number = -1;
    generatorId: number = 0;
    generatorCode: string = '';
    phoneNumber: string = '';
    firstName: string = '';
    lastName: string = '';
    address: string = '';
    previousKva: number = 0;
    currentKva: number = 0;
    electricMeterNumber: string = '';
    subscriptionBillingModelId: number = 0;
    overrideAmount?: number;
    billingModel: string = '';
    subscriptionAmps: number = 0;
    amountFixed: number = 0;
    amountPerKva: number = 0;
    statusCode: string = '';
    createdAt: string = '';
    createdByUsername: string = '';
    modifiedAt: string = '';
    modifiedByUsername: string = '';
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
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
}

export interface SmsTemplate {
    id: number;
    name: string;
    body: string;
}

export interface SubscriptionBillingModel {
    id: number;
    generatorId: number;
    generatorCode: string;
    model: string;
    subscriptionAmps: number;
    amountFixed: number;
    amountPerKva: number;
}

export interface Lookup {
    id: number;
    domain: string;
    code: string;
    description: string;
}
