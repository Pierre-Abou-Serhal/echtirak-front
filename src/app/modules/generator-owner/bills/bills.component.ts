import { Component, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { BillsListComponent } from '@/modules/generator-owner/bills/bills-list/bills-list.component';
import { CustomBillGenerationComponent } from '@/modules/generator-owner/bills/custom-bill-generation/custom-bill-generation.component';
import {
    BillGenerationComponent
} from '@/modules/generator-owner/bills/bill-generation/bill-generation.component';

@Component({
    selector: 'app-bills.component',
    imports: [TableModule, FormsModule, Tabs, TabList, TabPanels, Tab, TabPanel, BillsListComponent, CustomBillGenerationComponent, BillGenerationComponent],
    templateUrl: './bills.component.html',
    styleUrl: './bills.component.scss'
})
export class BillsComponent {
    @ViewChild('billsList') billsListComponent!: BillsListComponent;

    activeTab: string = '0';

    onTabChange(tabValue: string | number) {
        if (tabValue === '0' || tabValue === 0) {
            this.billsListComponent.applyFilters();
        }
    }
}
