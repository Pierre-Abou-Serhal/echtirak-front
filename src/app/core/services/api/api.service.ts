import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly httpClient: HttpClient = inject(HttpClient);

    get<T>(path: string, options?: { headers?: HttpHeaders; params?: HttpParams }) : Observable<T> {
        const { headers, params } = options ?? {};
        return this.httpClient
            .get<ApiResponse<T>>(path, { headers, params })
            .pipe(map(response => response.data));
    }

    post<T>(path: string, body: any, headers?: HttpHeaders) : Observable<T> {
        return this.httpClient
            .post<ApiResponse<T>>(path, body, { headers })
            .pipe(map(response => response.data));
    }

    put<T>(path: string, body: any, headers?: HttpHeaders) : Observable<T> {
        return this.httpClient
            .put<ApiResponse<T>>(path, body, { headers })
            .pipe(map(response => response.data));
    }

    delete<T>(path: string, headers?: HttpHeaders) : Observable<T> {
        return this.httpClient
            .delete<ApiResponse<T>>(path, { headers })
            .pipe(map(response => response.data));
    }

    getBlob(
        path: string,
        options?: { headers?: HttpHeaders; params?: HttpParams }
    ): Observable<Blob> {
        const { headers, params } = options ?? {};
        return this.httpClient.get(path, {
            headers,
            params,
            responseType: 'blob'
        });
    }

    postBlob(
        path: string,
        body: any,
        options?: { headers?: HttpHeaders; params?: HttpParams }
    ): Observable<HttpResponse<Blob>> {
        const { headers, params } = options ?? {};

        return this.httpClient.post(path, body, {
            headers,
            params,
            responseType: 'blob',
            observe: 'response'
        });
    }

    buildParams(params: any) : HttpParams {
        let queryParams = new HttpParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;

            // serialize Date to ISO; everything else to string
            if (value instanceof Date) {
                queryParams = queryParams.set(key, value.toISOString());
            } else {
                queryParams = queryParams.set(key, String(value));
            }
        });

        return queryParams;
    }
}

// Success API response
export interface ApiResponse<T> {
    correlationId: string;
    message: string;
    data: T;
}

// Error returned from API if error occurred
export interface ApiError {
    title: string;
    status: number;
    detail?: string;
    correlationId?: string;
    [key: string]: unknown; // For any extra fields that might be added later if needed
}
