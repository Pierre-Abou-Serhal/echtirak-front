import { MenuItem } from 'primeng/api';
export const ADMIN_MENU: MenuItem[] = [
    {
        label: 'Administrator',
        items: [
            { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/app/admin/dashboard'] },
            { label: 'Generator Owners', icon: 'pi pi-users', routerLink: ['/app/admin/generator-owners'] },
            { label: 'Announcements', icon: 'pi pi-megaphone', routerLink: ['/app/admin/announcements'] },
            { label: 'SMS Templates', icon: 'pi pi-envelope', routerLink: ['/app/admin/sms-templates'] }
        ]
    }
];
