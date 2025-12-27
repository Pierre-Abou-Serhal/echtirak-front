import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lbPhone' })
export class LbPhonePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        const raw = value.toString().trim();

        // Detect if the original value had Lebanon prefix
        const hasPrefix = /^\s*\+?961/.test(raw);

        // Normalize: remove separators
        let s = raw.replace(/[\s\-().]/g, '');

        // Remove "+" then optional 961 (for formatting local part)
        if (s.startsWith('+')) s = s.slice(1);
        if (s.startsWith('961')) s = s.slice(3);

        // Optional: remove leading 0 (e.g. 03xxxxxx)
        // if (s.startsWith('0')) s = s.slice(1);

        // Digits only, max 8 for local part
        s = s.replace(/\D/g, '').slice(0, 8);
        if (!s) return '';

        // Format local as: xx xxx xxx
        const a = s.slice(0, 2);
        const b = s.slice(2, 5);
        const c = s.slice(5, 8);
        const formattedLocal = [a, b, c].filter(Boolean).join(' ');

        return hasPrefix ? `+961 ${formattedLocal}` : formattedLocal;
    }
}
