import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly httpClient: HttpClient = inject(HttpClient);

    get<T>(path: string, headers?: HttpHeaders) : Observable<T> {
        return this.httpClient
            .get<ApiResponse<T>>(path, { headers })
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
