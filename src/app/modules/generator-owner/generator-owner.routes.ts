import { SubscribersComponent } from '@/modules/generator-owner/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { GENERATOR_OWNER_MENU } from '@/modules/generator-owner/generator-owner.menu';
import { GeneratorsComponent } from '@/modules/generator-owner/generators/generators.component';
import { GENERATOR_OWNER_PROFILE_MENU } from '@/modules/generator-owner/generator-owner-profile.menu';
import { ProfileComponent } from '@/modules/generator-owner/profile/profile.component';
import { BillCollectorComponent } from '@/modules/generator-owner/bill-collector/bill-collector.component';

export const GENERATOR_OWNER_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: GENERATOR_OWNER_MENU,
            profileMenu: GENERATOR_OWNER_PROFILE_MENU
        },
        children: [
            { path: 'subscribers', component: SubscribersComponent },
            { path: 'generators', component: GeneratorsComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'bill-collectors', component: BillCollectorComponent },
        ]
    }
] as Routes;
