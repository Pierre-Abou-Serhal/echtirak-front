import { MenuItem } from 'primeng/api';
export const BILL_COLLECTOR_MENU: MenuItem[] = [
    {
        label: 'Bill Collector',
        items: [
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/bill-collector/subscribers'] }
        ]
    }
];
