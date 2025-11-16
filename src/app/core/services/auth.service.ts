import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import { SignInRequest } from '@/core/services/api/request';
import { Observable } from 'rxjs';
import { SignInResponse } from '@/core/services/api/response';
import { AuthSession, TokenPair } from '@/core/dtos/dto';
import { environment } from '../../../environments/environment';
import { User } from '@/core/models/model';
import { UserRole } from '@/core/enums/enum';
import { Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiService: ApiService = inject(ApiService);
    private readonly router = inject(Router);

    private sessionKey: string = environment.localStorage.sessionKey;
    private readonly sessionState = signal<AuthSession | null>(this.restoreSession());

    readonly session = this.sessionState.asReadonly();

    constructor() {
        effect(() => {
            const session = this.sessionState();
            if (session) {
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            } else {
                localStorage.removeItem(this.sessionKey);
            }
        });
    }

    public signIn(request: SignInRequest): Observable<SignInResponse> {
        return this.apiService.post<SignInResponse>('/Auth/SignIn', request);
    }

    private restoreSession(): AuthSession | null {
        const stored = localStorage.getItem(this.sessionKey);
        if (!stored) {
            return null;
        }
        try {
            const parsed = JSON.parse(stored) as AuthSession;
            if (parsed.accessToken) {
                return parsed;
            }
            localStorage.removeItem(this.sessionKey);
            return null;
        } catch (error) {
            localStorage.removeItem(this.sessionKey);
            return null;
        }
    }

    public setSession(user: User, tokenPair: TokenPair): void {
        const session: AuthSession = {
            userId: user.id,
            role: user.userRoleCode,
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
        };

        this.sessionState.set(session);
        console.log(session);
    }

    public async redirectUserByRole(){
        const userRole = this.session()?.role;

        switch (userRole) {
            case UserRole.GENERATOR_OWNER:
                await this.router.navigateByUrl('/app/generator-owner/subscribers');
                break;
            case UserRole.BILL_COLLECTOR:
                await this.router.navigateByUrl('/app/bill-collector/test');
                break;
            case UserRole.ADMIN:
                await this.router.navigateByUrl('/app/admin/test');
                break;
            default:
                await this.logout();
                break;
        }
    }

    public getRole(): UserRole | undefined {
        return this.session()?.role;
    }

    public async logout(): Promise<void> {
        this.sessionState.set(null);
        await this.router.navigateByUrl('/');
    }

    public hasRole(roles: UserRole[]): boolean {
        const role = this.getRole();
        if(role) {
            return roles.includes(role);
        }
        return false;
    }

    public isAuthenticated(){
        return !!this.session()?.accessToken;
    }

    public homeUrlTree(router: Router): UrlTree {
        const role = this.getRole();
        switch (role) {
            case UserRole.GENERATOR_OWNER:
                return router.createUrlTree(['/app/generator-owner/subscribers']);
            case UserRole.BILL_COLLECTOR:
                return router.createUrlTree(['/app/bill-collector']);
            case UserRole.ADMIN:
                return router.createUrlTree(['/app/admin']);
            default:
                return router.createUrlTree(['/access-denied']);
        }
    }
}
