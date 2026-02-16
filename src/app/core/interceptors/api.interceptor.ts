import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpContextToken } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, defer, finalize, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { ApiError } from '@/core/services/api/api.service';
import { inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { AuthSession } from '@/core/dtos/dto';
import { NotificationService } from '@/core/services/notification.service';

// context key to avoid infinite retry loops
export const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

// helper to build request with base URL + Authorization header
function addAuthHeaders(req: HttpRequest<any>, session: AuthSession | null): HttpRequest<any> {
    const url = req.url.startsWith('http') ? req.url : environment.apiUrl + req.url;

    const headers: Record<string, string> = {
        Accept: 'application/json'
    };

    const isSignIn = req.url.includes('SignIn');
    const isRefresh = req.url.includes('RefreshToken');

    if (session?.accessToken && !isSignIn && !isRefresh) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return req.clone({ url, setHeaders: headers });
}

/**
 * Refresh queue:
 * - refreshInFlight$ exists only while refresh call is running.
 * - shareReplay(1) ensures all queued requests reuse the same refresh result.
 * - logout ONLY happens if the refresh call fails.
 */
let refreshInFlight$: Observable<any> | null = null;

function getRefreshObservable(authService: AuthService): Observable<any> {
    if (!refreshInFlight$) {
        refreshInFlight$ = defer(() => {
            const session = authService.session();
            const rt = session?.refreshToken;

            if (!rt) {
                const missing: ApiError = {
                    title: 'Unauthorized',
                    status: 401,
                    detail: 'Missing refresh token.'
                };
                return throwError(() => missing);
            }

            return authService.refreshToken({ refreshToken: rt });
        }).pipe(
            tap((refreshResponse) => {
                // update tokens in AuthService (+localStorage via your signal effect)
                authService.updateTokens(refreshResponse);
            }),

            // all queued requests will receive the same refresh result
            shareReplay(1),

            // logout ONLY if refresh-token API fails
            catchError((refreshErr: HttpErrorResponse) => {
                authService.logout();
                return throwError(() => mapApiError(refreshErr));
            }),

            // allow future refresh cycles
            finalize(() => {
                refreshInFlight$ = null;
            })
        );
    }

    return refreshInFlight$;
}

// ------ interceptor ------
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const notify = inject(NotificationService);

    const session: AuthSession | null = authService.session();
    const authReq = addAuthHeaders(req, session);

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            const apiError: ApiError = mapApiError(err);

            const skipRefresh = req.context.get(SKIP_REFRESH) || req.url.includes('SignIn') || req.url.includes('RefreshToken');

            const hasRefreshToken = !!session?.refreshToken;

            // ---------- 401: try refresh token flow ----------
            if (apiError.status === 401 && hasRefreshToken && !skipRefresh) {
                return getRefreshObservable(authService).pipe(
                    switchMap(() => {
                        // refresh succeeded -> retry original request with new token
                        const newSession = authService.session();
                        const retryReq = addAuthHeaders(req, newSession).clone({
                            context: req.context.set(SKIP_REFRESH, true)
                        });

                        // IMPORTANT: handle retry errors here (no logout)
                        return next(retryReq).pipe(
                            catchError((retryErr: HttpErrorResponse) => {
                                const mapped = mapApiError(retryErr);

                                if (mapped.status === 400 || mapped.status === 404 || mapped.status === 500) {
                                    notify.error('Something went wrong', mapped.detail);
                                }

                                // do NOT logout here — refresh already succeeded
                                return throwError(() => mapped);
                            })
                        );
                    })
                );
            }

            // ---------- other errors ----------
            if (apiError.status === 400 || apiError.status === 500 || apiError.status === 404) {
                notify.error("Something went wrong", apiError.detail);
            }

            // if 401 and we couldn't refresh (no refresh token at all) -> logout
            if (apiError.status === 401 && !hasRefreshToken) {
                authService.logout();
            }

            return throwError(() => apiError);
        })
    );
};

export function mapApiError(err: unknown): ApiError {
    const fallback: ApiError = {
        title: 'Unexpected Error',
        status: 0,
        detail: 'Something went wrong. Please try again.'
    };

    if (err && typeof err === 'object' && 'status' in err) {
        const httpErr = err as any;
        const errorBody = httpErr.error;

        if (errorBody && typeof errorBody === 'object' && ('title' in errorBody || 'detail' in errorBody)) {
            return {
                title: String((errorBody as any).title ?? 'Error'),
                status: Number(httpErr.status ?? (errorBody as any).status ?? 0),
                detail: (errorBody as any).detail ? String((errorBody as any).detail) : undefined,
                correlationId: (errorBody as any).correlationId ? String((errorBody as any).correlationId) : undefined,
                ...errorBody
            };
        }

        if (typeof errorBody === 'string') {
            return {
                ...fallback,
                status: Number(httpErr.status ?? 0),
                detail: errorBody.slice(0, 500)
            };
        }

        if (httpErr.status === 0) {
            return {
                ...fallback,
                status: 0,
                detail: 'Network error or CORS issue.'
            };
        }

        return {
            ...fallback,
            status: Number(httpErr.status ?? 0),
            detail: httpErr.message ?? fallback.detail
        };
    }

    return fallback;
}
