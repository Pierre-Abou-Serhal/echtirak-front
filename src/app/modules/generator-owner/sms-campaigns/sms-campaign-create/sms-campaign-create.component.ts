import { Component } from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import {
    SmsCampaignCreateSubscribersComponent
} from '@/modules/generator-owner/sms-campaigns/sms-campaign-create/sms-campaign-create-subscribers/sms-campaign-create-subscribers.component';
import {
    SmsCampaignCreateBillsComponent
} from '@/modules/generator-owner/sms-campaigns/sms-campaign-create/sms-campaign-create-bills/sms-campaign-create-bills.component';
import { Button } from 'primeng/button';
import { Location } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-sms-campaign-create.component',
    imports: [Tab, TabList, TabPanel, TabPanels, Tabs, SmsCampaignCreateSubscribersComponent, SmsCampaignCreateBillsComponent, Button, Tooltip],
    templateUrl: './sms-campaign-create.component.html',
    styleUrl: './sms-campaign-create.component.scss'
})
export class SmsCampaignCreateComponent {
    activeTab: string = '0';

    constructor(private location: Location) {}

    onTabChange(tabValue: string | number) {
        if (tabValue === '0' || tabValue === 0) {
        }
    }

    backClicked(): void {
        this.location.back();
    }
}
