import { SubscribersComponent } from '@/modules/bill-collector/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { BILL_COLLECTOR_MENU } from '@/modules/bill-collector/bill-collector.menu';
import { BILL_COLLECTOR_PROFILE_MENU } from '@/modules/bill-collector/bill-collector-profile.menu';

export const BILL_COLLECTOR_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: BILL_COLLECTOR_MENU,
            profileMenu: BILL_COLLECTOR_PROFILE_MENU
        },
        children: [
            { path: 'subscribers', component: SubscribersComponent },
        ]
    }
] as Routes;
