import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/core/services/api/api.service';
import {
    GetWalletTransactionsQueryParams,
    WalletForecastRequest
} from '@/core/services/api/request';
import { Observable } from 'rxjs';
import {
    GetWalletBalancesResponse,
    GetWalletTransactionsResponse,
    WalletForecastResponse
} from '@/core/services/api/response';

@Injectable({ providedIn: 'root' })
export class WalletService {
    private apiService: ApiService = inject(ApiService);

    public getWalletBalance(): Observable<GetWalletBalancesResponse> {
        return this.apiService.get<GetWalletBalancesResponse>('/Wallet/Balance');
    }

    public getWalletTransactions(queryParams: GetWalletTransactionsQueryParams): Observable<GetWalletTransactionsResponse> {
        let params = this.apiService.buildParams(queryParams);

        return this.apiService.get<GetWalletTransactionsResponse>('/Wallet/Transactions', { params: params });
    }

    public walletForecast(request: WalletForecastRequest): Observable<WalletForecastResponse> {
        return this.apiService.post<WalletForecastResponse>('/Wallet/Forecast', request);
    }
}
