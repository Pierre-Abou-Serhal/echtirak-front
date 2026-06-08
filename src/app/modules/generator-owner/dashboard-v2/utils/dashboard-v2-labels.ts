export interface DashboardV2Metric {
    label: string;
    value: string;
    description?: string;
    icon?: string;
    severity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary';
}

export const DASHBOARD_V2_DATE_MODES = [
    { label: 'Issue Date', value: 'ISSUE_DATE' },
    { label: 'Bill Period', value: 'BILL_PERIOD' },
    { label: 'Paid At', value: 'PAID_AT' }
];

export const DASHBOARD_V2_CURRENCIES = [
    { label: 'USD', value: 'USD' },
    { label: 'LBP', value: 'LBP' }
];

export const DASHBOARD_V2_RISKS = [
    { label: 'All risks', value: '' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
];
