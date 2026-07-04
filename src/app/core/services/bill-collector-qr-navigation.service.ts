import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export type BillCollectorQrTarget = { type: 'building-box'; token: string } | { type: 'kva-reading'; subscriberId: number } | { type: 'bill-collection'; billId: number };

@Injectable({
    providedIn: 'root'
})
export class BillCollectorQrNavigationService {
    private readonly router = inject(Router);

    parse(value: string): BillCollectorQrTarget | null {
        const raw = (value ?? '').trim();

        if (!raw) return null;

        const url = this.toUrl(raw);

        if (!url) {
            if (this.looksLikeBoxToken(raw)) {
                return {
                    type: 'building-box',
                    token: raw
                };
            }

            return null;
        }

        const path = url.pathname.toLowerCase();

        const boxToken = this.getQueryParam(url, ['qrToken', 'boxToken', 'token']) ?? this.getSegmentAfter(url.pathname, ['boxes', 'building-boxes']);

        if (boxToken && this.isBuildingBoxPath(path)) {
            return {
                type: 'building-box',
                token: boxToken
            };
        }

        const subscriberId = this.getNumberQueryParam(url, ['subscriberId', 'subscriber', 'subId']) ?? (this.isKvaReadingPath(path) ? this.getLastNumberFromPath(url.pathname) : null);

        if (subscriberId && this.isKvaReadingPath(path)) {
            return {
                type: 'kva-reading',
                subscriberId
            };
        }

        const billId = this.getNumberQueryParam(url, ['collectBillId', 'billId', 'billReference']) ?? (this.isBillCollectionPath(path) ? this.getLastNumberFromPath(url.pathname) : null);

        if (billId && this.isBillCollectionPath(path)) {
            return {
                type: 'bill-collection',
                billId
            };
        }

        if (this.looksLikeBoxToken(raw)) {
            return {
                type: 'building-box',
                token: raw
            };
        }

        return null;
    }

    async navigateToTarget(target: BillCollectorQrTarget): Promise<boolean> {
        if (target.type === 'building-box') {
            return this.router.navigate(['/app', 'bill-collector', 'boxes', target.token]);
        }

        if (target.type === 'kva-reading') {
            return this.router.navigate(['/app', 'bill-collector', 'subscribers', 'add-kva-reading', target.subscriberId]);
        }

        return this.router.navigate(['/app', 'bill-collector', 'bill-collections'], {
            queryParams: {
                collectBillId: target.billId
            }
        });
    }

    async handleScannedValue(value: string): Promise<BillCollectorQrTarget | null> {
        const target = this.parse(value);

        if (!target) return null;

        await this.navigateToTarget(target);

        return target;
    }

    private toUrl(value: string): URL | null {
        try {
            return new URL(value);
        } catch {
            try {
                return new URL(value, window.location.origin);
            } catch {
                return null;
            }
        }
    }

    private isBuildingBoxPath(path: string): boolean {
        return path.includes('/boxes/') || path.includes('/building-boxes/');
    }

    private isKvaReadingPath(path: string): boolean {
        return path.includes('add-kva-reading') || path.includes('kva-reading');
    }

    private isBillCollectionPath(path: string): boolean {
        return path.includes('bill-collections') || path.includes('bill-collection');
    }

    private getQueryParam(url: URL, names: string[]): string | null {
        for (const name of names) {
            const value = url.searchParams.get(name);

            if (value?.trim()) {
                return value.trim();
            }
        }

        return null;
    }

    private getNumberQueryParam(url: URL, names: string[]): number | null {
        for (const name of names) {
            const value = url.searchParams.get(name);

            if (!value) continue;

            const id = Number(value);

            if (Number.isInteger(id) && id > 0) return id;
        }

        return null;
    }

    private getSegmentAfter(pathname: string, segmentNames: string[]): string | null {
        const segments = pathname.split('/').filter(Boolean);

        for (let i = 0; i < segments.length - 1; i++) {
            const current = segments[i].toLowerCase();

            if (segmentNames.includes(current)) {
                return decodeURIComponent(segments[i + 1]);
            }
        }

        return null;
    }

    private getLastNumberFromPath(pathname: string): number | null {
        const segments = pathname.split('/').filter(Boolean);

        for (let i = segments.length - 1; i >= 0; i--) {
            const id = Number(segments[i]);

            if (Number.isInteger(id) && id > 0) return id;
        }

        return null;
    }

    private looksLikeBoxToken(value: string): boolean {
        const raw = value.trim();

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(raw)) return true;

        return /^[A-Za-z0-9_-]{16,}$/.test(raw);
    }
}
