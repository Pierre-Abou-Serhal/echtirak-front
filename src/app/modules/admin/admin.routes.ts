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

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: ADMIN_MENU,
            profileMenu: ADMIN_PROFILE_MENU
        },
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'generator-owners', component: GeneratorOwnersComponent },
            { path: 'generator-owner-management', component: GeneratorOwnerManagementComponent },
            { path: 'announcements', component: AnnouncementsComponent },
            { path: 'sms-templates', component: SmsTemplatesComponent }
        ]
    }
] as Routes;
