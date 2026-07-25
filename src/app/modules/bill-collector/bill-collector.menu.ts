import { MenuItem } from 'primeng/api';
export const BILL_COLLECTOR_MENU: MenuItem[] = [
    {
        label: 'Bill Collector',
        items: [
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/bill-collector/subscribers'] },
            { label: 'KWH Readings', icon: 'pi pi-book', routerLink: ['/app/bill-collector/kva-readings'] },
            { label: 'Bill Collections', icon: 'pi pi-list-check', routerLink: ['/app/bill-collector/bill-collections'] },
            { label: 'Pending Work', icon: 'pi pi-clock', routerLink: ['/app/bill-collector/pending-work'] },
            { label: 'Bills', icon: 'pi pi-money-bill', routerLink: ['/app/bill-collector/bills'] },
            { label: 'Docs', icon: 'pi pi-question-circle', routerLink: ['/app/bill-collector/docs'] }
        ]
    }
];
