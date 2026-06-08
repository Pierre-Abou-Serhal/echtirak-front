import * as Papa from 'papaparse';

export function exportRowsToCsv<T extends Record<string, unknown>>(rows: T[], filename: string): void {
    if (!rows.length) return;

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}
