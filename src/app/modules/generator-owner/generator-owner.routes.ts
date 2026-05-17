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
import { BillCollectionsComponent } from '@/modules/generator-owner/bills/bill-collections/bill-collections.component';
import { GeneratorOwnerDocsComponent } from '@/modules/generator-owner/docs/generator-owner-docs.component';

export const GENERATOR_OWNER_ROUTES: Routes = [
    {
        path: '',
        data: {
            menu: GENERATOR_OWNER_MENU,
            profileMenu: GENERATOR_OWNER_PROFILE_MENU
        },
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { screenName: 'Generator Owner - Dashboard' } },
            { path: 'sms-campaigns', component: SmsCampaignsListComponent, data: { screenName: 'Generator Owner - SMS Campaigns' } },
            { path: 'sms-campaigns/:id', component: SmsCampaignDetailsComponent, data: { screenName: 'Generator Owner - SMS Campaign Details' } },
            { path: 'sms-campaigns-create', component: SmsCampaignCreateComponent, data: { screenName: 'Generator Owner - Create SMS Campaign' } },
            { path: 'subscribers', component: SubscribersComponent, data: { screenName: 'Generator Owner - Subscribers' } },
            { path: 'subscriber-addresses', component: SubscriberAddressesComponent, data: { screenName: 'Generator Owner - Subscriber Addresses' } },
            { path: 'generators', component: GeneratorsComponent, data: { screenName: 'Generator Owner - Generators' } },
            { path: 'profile', component: ProfileComponent, data: { screenName: 'Generator Owner - Profile' } },
            { path: 'bill-collectors', component: BillCollectorComponent, data: { screenName: 'Generator Owner - Bill Collectors' } },
            { path: 'bill-collections', component: BillCollectionsComponent, data: { screenName: 'Generator Owner - Bill Collections' } },
            { path: 'kva-reading-history', component: KvaReadingHistoryComponent, data: { screenName: 'Generator Owner - KWH Reading History' } },
            { path: 'sms-templates', component: SmsTemplatesComponent, data: { screenName: 'Generator Owner - SMS Templates' } },
            { path: 'bills', component: BillsComponent, data: { screenName: 'Generator Owner - Bills' } },
            { path: 'subscription-billing-model', component: SubscriptionBillingModelComponent, data: { screenName: 'Generator Owner - Subscription Billing Models' } },
            { path: 'currency-rates', component: CurrencyRatesComponent, data: { screenName: 'Generator Owner - Currency Rates' } },
            { path: 'wallet', component: WalletComponent, data: { screenName: 'Generator Owner - Wallet' } },
            { path: 'announcements', component: AnnouncementsComponent, data: { screenName: 'Generator Owner - Announcements' } },
            { path: 'docs', component: GeneratorOwnerDocsComponent, data: { screenName: 'Docs' } }
        ]
    }
] as Routes;
