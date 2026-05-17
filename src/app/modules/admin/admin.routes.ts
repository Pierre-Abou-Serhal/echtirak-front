import { Routes } from '@angular/router';
import { ADMIN_MENU } from '@/modules/admin/admin.menu';
import { GeneratorOwnersComponent } from '@/modules/admin/generator-owners/generator-owners.component';
import { ADMIN_PROFILE_MENU } from '@/modules/admin/admin-profile.menu';
import { DashboardComponent } from '@/modules/admin/dashboard/dashboard.component';
import { AnnouncementsComponent } from '@/modules/admin/announcements/announcements.component';
import { SmsTemplatesComponent } from '@/modules/admin/sms-templates/sms-templates.component';
import {
    GeneratorOwnerManagementComponent
} from '@/modules/admin/generator-owners/generator-owner-management/generator-owner-management.component';
import { MonitoringComponent } from '@/modules/admin/monitoring/monitoring.component';
import { AdminDocsComponent } from '@/modules/admin/docs/admin-docs.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: ADMIN_MENU,
            profileMenu: ADMIN_PROFILE_MENU
        },
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { screenName: 'Admin - Dashboard' } },
            { path: 'generator-owners', component: GeneratorOwnersComponent, data: { screenName: 'Admin - Generator Owners' } },
            { path: 'generator-owner-management', component: GeneratorOwnerManagementComponent, data: { screenName: 'Admin - Generator Owner Management' } },
            { path: 'announcements', component: AnnouncementsComponent, data: { screenName: 'Admin - Announcements' } },
            { path: 'sms-templates', component: SmsTemplatesComponent, data: { screenName: 'Admin - SMS Templates' } },
            { path: 'monitoring', component: MonitoringComponent, data: { screenName: 'Admin - Monitoring' } },
            { path: 'docs', component: AdminDocsComponent, data: { screenName: 'Docs' } }
        ]
    }
] as Routes;
