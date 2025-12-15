import { SubscribersComponent } from '@/modules/bill-collector/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { BILL_COLLECTOR_MENU } from '@/modules/bill-collector/bill-collector.menu';
import { BILL_COLLECTOR_PROFILE_MENU } from '@/modules/bill-collector/bill-collector-profile.menu';
import { AddKvaReadingComponent } from '@/modules/bill-collector/subscribers/add-kva-reading/add-kva-reading.component';
import { KvaReadingsComponent } from '@/modules/bill-collector/kva-readings/kva-readings.component';

export const BILL_COLLECTOR_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: BILL_COLLECTOR_MENU,
            profileMenu: BILL_COLLECTOR_PROFILE_MENU
        },
        children: [
            { path: 'subscribers', component: SubscribersComponent },
            { path: 'subscribers/add-kva-reading/:id', component: AddKvaReadingComponent },
            { path: 'kva-readings', component: KvaReadingsComponent },
        ]
    }
] as Routes;
