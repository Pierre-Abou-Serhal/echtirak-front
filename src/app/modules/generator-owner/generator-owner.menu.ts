import { MenuItem } from 'primeng/api';

export const GENERATOR_OWNER_MENU: MenuItem[] = [
    {
        label: 'Generator Owner',
        items: [
            { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/app/generator-owner/dashboard'] },
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/generator-owner/subscribers'] },
            { label: 'Generators', icon: 'pi pi-bolt', routerLink: ['/app/generator-owner/generators'] },
            { label: 'Bill Collectors', icon: 'pi pi-user-edit', routerLink: ['/app/generator-owner/bill-collectors'] },
            { label: 'SMS Templates', icon: 'pi pi-envelope', routerLink: ['/app/generator-owner/sms-templates'] },
            { label: 'SMS Campaigns', icon: 'pi pi-send', routerLink: ['/app/generator-owner/sms-campaigns'] },
            { label: 'Bills', icon: 'pi pi-money-bill', routerLink: ['/app/generator-owner/bills'] },
            { label: 'Billing Models', icon: 'pi pi-credit-card', routerLink: ['/app/generator-owner/subscription-billing-model'] },
            { label: 'Currency Rates', icon: 'pi pi-dollar', routerLink: ['/app/generator-owner/currency-rates'] },
            { label: 'Wallet', icon: 'pi pi-wallet', routerLink: ['/app/generator-owner/wallet'] },
        ]
    }
];
