import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WarningMessage } from '@/core/models/model';
import { AuthService } from '@/core/services/auth.service';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GetWarningMessagesResponse } from '@/core/services/api/response';
import { UserRole } from '@/core/enums/enum';

@Injectable({ providedIn: 'root' })
export class UserContextService {
    // Exposed observables for UI
    generatorOwnerWarnings$ = new BehaviorSubject<WarningMessage[]>([]);

    private readonly loaders: Record<string, () => void> = {};

    constructor(private generatorOwnerService: GeneratorOwnerService, private auth: AuthService) {
        // Initialize the registry
        this.loaders = {
            [UserRole.GENERATOR_OWNER]: () => this.loadWarnings(),
            [UserRole.BILL_COLLECTOR]: () => this.loadCollectorStats(),
            [UserRole.ADMIN]: () => this.loadAdminData()
        };
    }

    /** Public API — load data based on user role */
    loadGlobalContext() {
        const role = this.auth.getRole();
        // Call the loader if it exists
        if(role) {
            this.loaders[role]?.();
        }
    }

    // ---------------------
    // Actual API calls here
    // ---------------------

    private loadWarnings() {
        this.generatorOwnerService.getWarningMessages().subscribe(
            {
                next: (warnings: GetWarningMessagesResponse) => {
                    warnings.messages.push({messageCode: "THIS_IS_A_TEST_CODE", message: "WLEKKKK DFAAAAAAA33333"}, {messageCode: "THIS_IS_A_TEST_CODE", message: "WLEKKKK DFAAAAAAA33333"})
                    this.generatorOwnerWarnings$.next(warnings.messages);
                    console.log(warnings);
                },
                error: err => {
                    this.generatorOwnerWarnings$.next([]);
                    console.error('Failed to load warnings:', err);
                }
            });
    }

    private loadCollectorStats() {
        // Can be used to load Bill Collector global data
    }

    private loadAdminData() {
        // Can be sued toi load Admin global data
    }
}
