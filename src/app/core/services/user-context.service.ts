import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WalletBalance, WarningMessage } from '@/core/models/model';
import { AuthService } from '@/core/services/auth.service';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GetWalletBalancesResponse, GetWarningMessagesResponse } from '@/core/services/api/response';
import { UserRole } from '@/core/enums/enum';
import { WalletService } from '@/core/services/wallet.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
    // Exposed observables for UI
    generatorOwnerWarnings$ = new BehaviorSubject<WarningMessage[]>([]);
    generatorOwnerWalletBalance$ = new BehaviorSubject<WalletBalance | null>(null);

    private readonly loaders: Record<string, () => void> = {};

    constructor(
        private generatorOwnerService: GeneratorOwnerService,
        private walletService: WalletService,
        private auth: AuthService
    ) {
        // Initialize the registry
        this.loaders = {
            [UserRole.GENERATOR_OWNER]: () => {
                this.loadWarnings();
                this.loadWalletBalance();
            },
            [UserRole.BILL_COLLECTOR]: () => this.loadCollectorStats(),
            [UserRole.ADMIN]: () => this.loadAdminData()
        };
    }

    /** Public API — load data based on user role */
    loadGlobalContext() {
        const role = this.auth.getRole();
        // Call the loader if it exists
        if (role) {
            this.loaders[role]?.();
        }
    }

    // API Calls
    private loadWarnings() {
        this.generatorOwnerService.getWarningMessages().subscribe({
            next: (warnings: GetWarningMessagesResponse) => {
                this.generatorOwnerWarnings$.next(warnings.messages);
            },
            error: (err) => {
                this.generatorOwnerWarnings$.next([]);
                console.error('Failed to load warnings:', err);
            }
        });
    }

    private loadWalletBalance() {
        this.walletService.getWalletBalance().subscribe({
            next: (walletBalance: GetWalletBalancesResponse) => {
                this.generatorOwnerWalletBalance$.next(walletBalance.balance);
            },
            error: (err) => {
                this.generatorOwnerWalletBalance$.next(null);
                console.error('Failed to load warnings:', err);
            }
        });
    }

    private loadCollectorStats() {
        // Can be used to load Bill Collector global data
    }

    private loadAdminData() {
        // Can be used to load Admin global data
    }
}
