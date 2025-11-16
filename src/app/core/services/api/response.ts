import { User } from '@/core/models/model';
import { TokenPair } from '@/core/dtos/dto';

export interface SignInResponse {
    user: User,
    token: TokenPair
}
