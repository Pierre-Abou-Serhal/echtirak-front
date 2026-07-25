import { computed, inject, Injectable, linkedSignal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from '@/core/services/auth.service';

export interface BillCollectorBillingPeriod {
    billYear: string;
    billMonth: string;
}

interface StoredBillingPeriod extends BillCollectorBillingPeriod {
    savedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class BillCollectorBillingPeriodService {
    private readonly authService = inject(AuthService);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly storagePrefix = 'echtirak.bc.billing-period';

    /*
     * The stored value is automatically restored again if a different user
     * signs in during the same browser session.
     */
    private readonly periodState = linkedSignal<BillCollectorBillingPeriod | null>(() => {
        const userId = this.authService.session()?.userId;

        return this.restore(userId);
    });

    readonly period = this.periodState.asReadonly();

    readonly configured = computed(() => this.periodState() !== null);

    readonly date = computed<Date | null>(() => {
        const period = this.periodState();

        if (!period) return null;

        return new Date(Number(period.billYear), Number(period.billMonth) - 1, 1);
    });

    readonly label = computed(() => {
        const period = this.periodState();

        if (!period) return 'Not configured';

        return `${period.billYear}/${period.billMonth}`;
    });

    readonly isCurrentMonth = computed(() => {
        const period = this.periodState();

        if (!period) return false;

        const now = new Date();

        return period.billYear === String(now.getFullYear()) && period.billMonth === String(now.getMonth() + 1).padStart(2, '0');
    });

    setFromDate(date: Date): BillCollectorBillingPeriod {
        const period: BillCollectorBillingPeriod = {
            billYear: String(date.getFullYear()),
            billMonth: String(date.getMonth() + 1).padStart(2, '0')
        };

        this.set(period);

        return period;
    }

    set(period: BillCollectorBillingPeriod): void {
        const normalized = this.normalize(period);

        if (!normalized) {
            throw new Error('Invalid bill year or month.');
        }

        this.periodState.set(normalized);
        this.persist(normalized);
    }

    clear(): void {
        const userId = this.authService.session()?.userId;

        this.periodState.set(null);

        if (!this.isBrowser || !userId) return;

        localStorage.removeItem(this.getStorageKey(userId));
    }

    getSnapshot(): BillCollectorBillingPeriod | null {
        return this.periodState();
    }

    private restore(userId: number | null | undefined): BillCollectorBillingPeriod | null {
        if (!this.isBrowser || !userId) return null;

        const raw = localStorage.getItem(this.getStorageKey(userId));

        if (!raw) return null;

        try {
            const stored = JSON.parse(raw) as StoredBillingPeriod;

            return this.normalize(stored);
        } catch {
            localStorage.removeItem(this.getStorageKey(userId));
            return null;
        }
    }

    private persist(period: BillCollectorBillingPeriod): void {
        const userId = this.authService.session()?.userId;

        if (!this.isBrowser || !userId) return;

        const stored: StoredBillingPeriod = {
            ...period,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(this.getStorageKey(userId), JSON.stringify(stored));
    }

    private normalize(period: BillCollectorBillingPeriod): BillCollectorBillingPeriod | null {
        const year = String(period.billYear).trim();
        const monthNumber = Number(period.billMonth);

        if (!/^\d{4}$/.test(year)) return null;
        if (!Number.isInteger(monthNumber)) return null;
        if (monthNumber < 1 || monthNumber > 12) return null;

        return {
            billYear: year,
            billMonth: String(monthNumber).padStart(2, '0')
        };
    }

    private getStorageKey(userId: number): string {
        /*
         * User-scoping prevents two bill collectors using the same device
         * from inheriting each other's billing period.
         */
        return `${this.storagePrefix}.${userId}`;
    }
}
