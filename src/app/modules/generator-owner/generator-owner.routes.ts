import { SubscribersComponent } from '@/modules/generator-owner/subscribers/subscribers.component';
import { DashboardComponent } from '@/modules/generator-owner/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { GENERATOR_OWNER_MENU } from '@/modules/generator-owner/generator-owner.menu';
import { GeneratorsComponent } from '@/modules/generator-owner/generators/generators.component';
import { GENERATOR_OWNER_PROFILE_MENU } from '@/modules/generator-owner/generator-owner-profile.menu';
import { ProfileComponent } from '@/modules/generator-owner/profile/profile.component';
import { BillCollectorComponent } from '@/modules/generator-owner/bill-collector/bill-collector.component';
import { SmsTemplatesComponent } from '@/modules/generator-owner/sms-templates/sms-templates.component';
import { BillsComponent } from '@/modules/generator-owner/bills/bills.component';
import {
    SubscriptionBillingModelComponent
} from '@/modules/generator-owner/subscription-billing-model/subscription-billing-model.component';
import { SmsCampaignsListComponent } from './sms-campaigns/sms-campaigns-list/sms-campaigns-list.component';
import { SmsCampaignDetailsComponent } from './sms-campaigns/sms-campaign-details/sms-campaign-details.component';
import { CurrencyRatesComponent } from '@/modules/generator-owner/currency-rates/currency-rates-component';
import { WalletComponent } from '@/modules/generator-owner/wallet/wallet-component';
import { AnnouncementsComponent } from '@/modules/generator-owner/announcements/announcements.component';
import {
    KvaReadingHistoryComponent
} from '@/modules/generator-owner/kva-reading-history/kva-reading-history.component';
import {
    SmsCampaignCreateComponent
} from '@/modules/generator-owner/sms-campaigns/sms-campaign-create/sms-campaign-create.component';
import {
    SubscriberAddressesComponent
} from '@/modules/generator-owner/subscriber-addresses/subscriber-addresses.component';

export const GENERATOR_OWNER_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: GENERATOR_OWNER_MENU,
            profileMenu: GENERATOR_OWNER_PROFILE_MENU
        },
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'sms-campaigns', component: SmsCampaignsListComponent },
            { path: 'sms-campaigns/:id', component: SmsCampaignDetailsComponent },
            { path: 'sms-campaigns-create', component: SmsCampaignCreateComponent },
            { path: 'subscribers', component: SubscribersComponent },
            { path: 'subscriber-addresses', component: SubscriberAddressesComponent },
            { path: 'generators', component: GeneratorsComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'bill-collectors', component: BillCollectorComponent },
            { path: 'kva-reading-history', component: KvaReadingHistoryComponent },
            { path: 'sms-templates', component: SmsTemplatesComponent },
            { path: 'bills', component: BillsComponent },
            { path: 'subscription-billing-model', component: SubscriptionBillingModelComponent },
            { path: 'currency-rates', component: CurrencyRatesComponent },
            { path: 'wallet', component: WalletComponent },
            { path: 'announcements', component: AnnouncementsComponent }
        ]
    }
] as Routes;
