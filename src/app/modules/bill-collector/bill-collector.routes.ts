import { SubscribersComponent } from '@/modules/bill-collector/subscribers/subscribers.component';
import { Routes } from '@angular/router';
import { BILL_COLLECTOR_MENU } from '@/modules/bill-collector/bill-collector.menu';
import { BILL_COLLECTOR_PROFILE_MENU } from '@/modules/bill-collector/bill-collector-profile.menu';
import { AddKvaReadingComponent } from '@/modules/bill-collector/subscribers/add-kva-reading/add-kva-reading.component';
import { KvaReadingsComponent } from '@/modules/bill-collector/kva-readings/kva-readings.component';
import { BillCollectionsComponent } from '@/modules/bill-collector/bill-collections/bill-collections.component';
import { BillCollectorDocsComponent } from '@/modules/bill-collector/docs/bill-collector-docs.component';
import { BuildingBoxesComponent } from '@/modules/bill-collector/building-boxes/building-boxes.component';
import { PendingWorkComponent } from '@/modules/bill-collector/pending-work/pending-work.component';
import { BillsComponent } from '@/modules/bill-collector/bills/bills.component';

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
            { path: 'pending-work', component: PendingWorkComponent, data: { screenName: 'Bill Collector - Pending Work' } },
            { path: 'bills', component: BillsComponent, data: { screenName: 'Bill Collector - Bills' } },
            { path: 'docs', component: BillCollectorDocsComponent, data: { screenName: 'Bill Collector - Docs' } },
            { path: 'boxes/:token', component: BuildingBoxesComponent, data: { screenName: 'Bill Collector - Building Box' } }
        ]
    }
] as Routes;
