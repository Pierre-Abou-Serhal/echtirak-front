import { MenuItem } from 'primeng/api';
import { UserContextService } from '@/core/services/user-context.service';
import { inject } from '@angular/core';

export const GENERATOR_OWNER_MENU: MenuItem[] = [
    {
        label: 'Generator Owner',
        items: [
            { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/app/generator-owner/dashboard'], badge: undefined},
            { label: 'Subscribers', icon: 'pi pi-users', routerLink: ['/app/generator-owner/subscribers'], badge: undefined },
            { label: 'Generators', icon: 'pi pi-bolt', routerLink: ['/app/generator-owner/generators'], badge: undefined },
            { label: 'Bill Collectors', icon: 'pi pi-user-edit', routerLink: ['/app/generator-owner/bill-collectors'], badge: undefined },
            { label: 'SMS Templates', icon: 'pi pi-envelope', routerLink: ['/app/generator-owner/sms-templates'], badge: undefined },
            { label: 'SMS Campaigns', icon: 'pi pi-send', routerLink: ['/app/generator-owner/sms-campaigns'], badge: undefined },
            { label: 'Bills', icon: 'pi pi-money-bill', routerLink: ['/app/generator-owner/bills'], badge: undefined },
            { label: 'Billing Models', icon: 'pi pi-credit-card', routerLink: ['/app/generator-owner/subscription-billing-model'], badge: undefined },
            { label: 'Currency Rates', icon: 'pi pi-dollar', routerLink: ['/app/generator-owner/currency-rates'], badge: undefined },
            { label: 'Wallet', icon: 'pi pi-wallet', routerLink: ['/app/generator-owner/wallet'], badge: undefined },
            { label: 'Announcements', icon: 'pi pi-megaphone', routerLink: ['/app/generator-owner/announcements'], badge: undefined }
        ]
    }
];
