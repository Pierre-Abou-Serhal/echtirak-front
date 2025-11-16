import { UserRole } from '@/core/enums/enum';

export interface User {
    id: number;
    username: string;
    userRoleCode: UserRole;
}
