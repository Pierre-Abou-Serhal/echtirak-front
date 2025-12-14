import {
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpRequest,
    HttpContextToken,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { ApiError } from '@/core/services/api/api.service';
import { inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { AuthSession } from '@/core/dtos/dto';
import { NotificationService } from '@/core/services/notification.service';

// ------ refresh control (shared by all calls of apiInterceptor) ------
const isRefreshingToken = {
    value: false,
};
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// context key to avoid infinite retry loops
export const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

// helper to build request with base URL + Authorization header
function addAuthHeaders(req: HttpRequest<any>, session: AuthSession | null): HttpRequest<any> {
    const url = req.url.startsWith('http') ? req.url : environment.apiUrl + req.url;

    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const isSignIn = req.url.includes('SignIn');
    const isRefresh = req.url.includes('RefreshToken');

    if (session?.accessToken && !isSignIn && !isRefresh) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    return req.clone({ url, setHeaders: headers });
}

// ------ interceptor ------
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const notify = inject(NotificationService);

    // Get session from signal (your effect already keeps localStorage in sync)
    let session: AuthSession | null = authService.session();

    // Build initial request
    const authReq = addAuthHeaders(req, session);

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            const apiError: ApiError = mapApiError(err);

            const skipRefresh = req.context.get(SKIP_REFRESH) || req.url.includes('SignIn') || req.url.includes('RefreshToken');

            const hasRefreshToken = !!session?.refreshToken;

            // ---------- 401: try refresh token flow ----------
            if (apiError.status === 401 && hasRefreshToken && !skipRefresh) {
                // if not already refreshing, start the refresh
                if (!isRefreshingToken.value) {
                    isRefreshingToken.value = true;
                    refreshTokenSubject.next(null);

                    return authService.refreshToken({ refreshToken: session!.refreshToken! }).pipe(
                        switchMap((refreshResponse) => {
                            // update tokens in AuthService (+localStorage via signal)
                            authService.updateTokens(refreshResponse);

                            const newSession = authService.session();
                            const retryReq = addAuthHeaders(req, newSession).clone({
                                // mark this as already refreshed to avoid infinite loop
                                context: req.context.set(SKIP_REFRESH, true)
                            });

                            // signal to waiting requests that we have a new token
                            refreshTokenSubject.next(refreshResponse.accessToken);

                            return next(retryReq);
                        }),
                        catchError((refreshErr: HttpErrorResponse) => {
                            // refresh failed -> logout and propagate error
                            authService.logout();
                            const mappedRefreshError = mapApiError(refreshErr);
                            return throwError(() => mappedRefreshError);
                        }),
                        finalize(() => {
                            isRefreshingToken.value = false;
                        })
                    );
                } else {
                    // already refreshing: wait until refreshTokenSubject emits a non-null token
                    return refreshTokenSubject.pipe(
                        filter((token) => token != null),
                        take(1),
                        switchMap((token) => {
                            const newSession = authService.session();
                            const retryReq = addAuthHeaders(req, newSession).clone({
                                context: req.context.set(SKIP_REFRESH, true)
                            });
                            return next(retryReq);
                        })
                    );
                }
            }

            // ---------- other errors (or 401 without refresh token) ----------
            if (apiError.status === 400 || apiError.status === 500 || apiError.status === 404) {
                notify.error(apiError.title, apiError.detail);
            }

            // if 401 and we couldn't refresh -> logout
            if (apiError.status === 401 && !hasRefreshToken) {
                authService.logout();
            }

            return throwError(() => apiError);
        })
    );
};

export function mapApiError(err: unknown): ApiError {
    // Default/fallback
    const fallback: ApiError = {
        title: 'Unexpected Error',
        status: 0,
        detail: 'Something went wrong. Please try again.'
    };

    // Angular wraps responses in HttpErrorResponse
    if (err && typeof err === 'object' && 'status' in err) {
        const httpErr = err as any;

        const errorBody = httpErr.error;

        // Error sent from server
        if (errorBody && typeof errorBody === 'object' && ('title' in errorBody || 'detail' in errorBody)) {
            return {
                title: String((errorBody as any).title ?? 'Error'),
                status: Number(httpErr.status ?? (errorBody as any).status ?? 0),
                detail: (errorBody as any).detail ? String((errorBody as any).detail) : undefined,
                correlationId: (errorBody as any).correlationId ? String((errorBody as any).correlationId) : undefined,
                ...errorBody // extra fields if added later
            };
        }

        // If body is text or HTML
        if (typeof errorBody === 'string') {
            return {
                ...fallback,
                status: Number(httpErr.status ?? 0),
                detail: errorBody.slice(0, 500) // only take first 500 chars
            };
        }

        // Network error (no response)
        if (httpErr.status === 0) {
            return {
                ...fallback,
                status: 0,
                detail: 'Network error or CORS issue.'
            };
        }

        // Unknown shape
        return {
            ...fallback,
            status: Number(httpErr.status ?? 0),
            detail: httpErr.message ?? fallback.detail
        };
    }

    // Totally non-HTTP error (programmatic throw, RxJS, etc.)
    return fallback;
}
