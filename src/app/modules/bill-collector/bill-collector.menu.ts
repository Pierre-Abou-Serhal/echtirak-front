import { MenuItem } from 'primeng/api';
export const BILL_COLLECTOR_MENU: MenuItem[] = [
    {
        label: 'Bill Collector',
        items: [
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/bill-collector/subscribers'] },
            { label: 'KWH Readings', icon: 'pi pi-book', routerLink: ['/app/bill-collector/kva-readings'] },
            { label: 'Bill Collections', icon: 'pi pi-list-check', routerLink: ['/app/bill-collector/bill-collections'] },
        ]
    }
];
