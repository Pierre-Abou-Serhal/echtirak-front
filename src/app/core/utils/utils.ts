import { Bill } from '@/core/models/model';
import { BillRow, SubscriberAddress } from '@/core/dtos/dto';

export function stripLebanonPrefix(phone: string | null | undefined): string {
    if (!phone) return '';

    // Normalize: trim + remove common separators
    let s = phone.trim().replace(/[\s\-().]/g, '');

    // Remove leading "+"
    if (s.startsWith('+')) s = s.slice(1);

    // Remove Lebanon country code if present
    if (s.startsWith('961')) s = s.slice(3);

    // Optional: remove leading 0 if user typed local with 0 (e.g. 03xxxxxx)
    // if (s.startsWith('0')) s = s.slice(1);

    return s;
}

export function addLebanonPrefix(phone: string | null | undefined): string {
    if (!phone) return '';

    // normalize: trim + remove separators
    let s = phone.trim().replace(/[\s\-().]/g, '');

    // if it already starts with +961 or 961, normalize to +961...
    if (s.startsWith('+')) s = s.slice(1);
    if (s.startsWith('961')) s = s.slice(3);

    // optional: remove leading 0 for local format like 03xxxxxx
    // if (s.startsWith('0')) s = s.slice(1);

    // if nothing left, return empty
    if (!s) return '';

    return `+961${s}`;
}

export function getBillYearMonth(billPeriod: Date | null): { billYear: string; billMonth: string } | null {
    if (!billPeriod) return null;

    const year = String(billPeriod.getFullYear());
    const month = String(billPeriod.getMonth() + 1).padStart(2, '0'); // 01-12

    return { billYear: year, billMonth: month };
}

export function mapBillToBillRow(b: Bill): BillRow {
    return {
        ...b,
        billPeriodKey: `${b.billYear}-${b.billMonth}`
    };
}

export function formatSubscriberAddress(addr?: SubscriberAddress | null): string {
    if (!addr) return '—';

    const parts = [
        addr.street,
        addr.building,
        addr.floor ? `Floor ${addr.floor}` : null,
        addr.city,
        addr.country
    ].filter(Boolean);

    return parts.join(', ');
}
