export type PrimeSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

const EMPTY_VALUE = '-';

export function formatMoney(value: number | null | undefined, currencyCode: string = 'USD'): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return EMPTY_VALUE;

    const numericValue = Number(value);

    if (currencyCode === 'LBP') {
        return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numericValue)} LBP`;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
    }).format(numericValue);
}

export function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return EMPTY_VALUE;

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
    }).format(Number(value));
}

export function formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return EMPTY_VALUE;

    return `${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(Number(value))}%`;
}

export function getAlertSeverity(severity: string | null | undefined): PrimeSeverity {
    switch ((severity ?? '').toUpperCase()) {
        case 'HIGH':
        case 'CRITICAL':
        case 'DANGER':
        case 'ERROR':
            return 'danger';
        case 'MEDIUM':
        case 'WARN':
        case 'WARNING':
            return 'warn';
        case 'LOW':
            return 'info';
        case 'SUCCESS':
            return 'success';
        default:
            return 'secondary';
    }
}

export function getRiskSeverity(daysOverdue: number | null | undefined): PrimeSeverity {
    const days = Number(daysOverdue ?? 0);

    if (days > 30) return 'danger';
    if (days > 7) return 'warn';
    if (days > 0) return 'info';

    return 'success';
}

export function getRiskLabel(daysOverdue: number | null | undefined): string {
    const days = Number(daysOverdue ?? 0);

    if (days > 30) return 'HIGH';
    if (days > 7) return 'MEDIUM';
    if (days > 0) return 'LOW';

    return 'NONE';
}

export function clampPercent(value: number | null | undefined): number {
    const numericValue = Number(value ?? 0);

    if (!Number.isFinite(numericValue)) return 0;

    return Math.max(0, Math.min(100, numericValue));
}
