import { SubscribersComponent } from '@/modules/bill-collector/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { BILL_COLLECTOR_MENU } from '@/modules/bill-collector/bill-collector.menu';
import { BILL_COLLECTOR_PROFILE_MENU } from '@/modules/bill-collector/bill-collector-profile.menu';
import { AddKvaReadingComponent } from '@/modules/bill-collector/subscribers/add-kva-reading/add-kva-reading.component';
import { KvaReadingsComponent } from '@/modules/bill-collector/kva-readings/kva-readings.component';
import { BillCollectionsComponent } from '@/modules/bill-collector/bill-collections/bill-collections.component';
import { BillCollectorDocsComponent } from '@/modules/bill-collector/docs/bill-collector-docs.component';

export const BILL_COLLECTOR_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: BILL_COLLECTOR_MENU,
            profileMenu: BILL_COLLECTOR_PROFILE_MENU
        },
        children: [
            { path: 'subscribers', component: SubscribersComponent, data: { screenName: 'Bill Collector - Subscribers' } },
            { path: 'subscribers/add-kva-reading/:id', component: AddKvaReadingComponent, data: { screenName: 'Bill Collector - Add KWH Reading' } },
            { path: 'kva-readings', component: KvaReadingsComponent, data: { screenName: 'Bill Collector - KWH Readings' } },
            { path: 'bill-collections', component: BillCollectionsComponent, data: { screenName: 'Bill Collector - Bill Collections' } },
            { path: 'docs', component: BillCollectorDocsComponent, data: { screenName: 'Docs' } }
        ]
    }
] as Routes;
