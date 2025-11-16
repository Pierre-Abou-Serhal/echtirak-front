import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '@/core/services/api/api.service';
import { inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { AuthSession } from '@/core/dtos/dto';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // Get session token - check both the signal and localStorage as fallback
    const authService: AuthService = inject(AuthService);

    let session: AuthSession | null = authService.session();

    // Fallback: try to restore from localStorage if signal is null (might happen on initial load)
    if (!session) {
        try {
            const stored = localStorage.getItem(environment.localStorage.sessionKey);
            if (stored) {
                session = JSON.parse(stored);
            }
        } catch (e) {
            session = null;
        }
    }

    const apiReq = req.clone({
        url: environment.apiUrl + req.url,
        setHeaders: {
            Accept: 'application/json',
            ...(session && !req.url.includes('SignIn') ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        }
    });

    return next(apiReq).pipe(
        catchError((err: HttpErrorResponse) => {
            return throwError(() => mapApiError(err));
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
