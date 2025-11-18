import { MenuItem } from 'primeng/api';
export const GENERATOR_OWNER_MENU: MenuItem[] = [
    {
        label: 'Generator Owner',
        items: [
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/generator-owner/subscribers'] },
            { label: 'Generators', icon: 'pi pi-bolt', routerLink: ['/app/generator-owner/generators'] },
            { label: 'Bill Collectors', icon: 'pi pi-users', routerLink: ['/app/generator-owner/bill-collectors'] },
        ]
    }
];
