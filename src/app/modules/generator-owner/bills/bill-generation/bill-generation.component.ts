import { Component, inject, OnInit } from '@angular/core';
import { Select } from 'primeng/select';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { Bill, Generator } from '@/core/models/model';
import { SelectOptionNumValue } from '@/core/dtos/dto';
import { GetGeneratorsResponse } from '@/core/services/api/response';
import { FormsModule } from '@angular/forms';
import { BillsPreviewComponent } from '@/modules/generator-owner/bills/bills-preview/bills-preview.component';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import {
    MeteredBillGenerationComponent
} from '@/modules/generator-owner/bills/bill-generation/metered-bill-generation/metered-bill-generation.component';
import {
    FixedBillGenerationComponent
} from '@/modules/generator-owner/bills/bill-generation/fixed-bill-generation/fixed-bill-generation.component';

@Component({
    selector: 'app-bill-generation-component',
    imports: [Select, FormsModule, BillsPreviewComponent, Tab, TabList, TabPanel, TabPanels, Tabs, MeteredBillGenerationComponent, FixedBillGenerationComponent],
    templateUrl: './bill-generation.component.html',
    styleUrl: './bill-generation.component.scss'
})
export class BillGenerationComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    billsPreview: Bill[] = [];
    generators: SelectOptionNumValue[] = [];

    selectedGeneratorId: number = 0;
    isGeneratorsLoading: boolean = true;

    activeTab: string = '0';

    ngOnInit(): void {
        // Fetch generators drop down items
        this.generatorOwnerService.getGenerators().subscribe({
            next: (response: GetGeneratorsResponse) => {
                this.generators = response.generators.map((generator: Generator) => ({
                    value: generator.id,
                    label: generator.code
                }));
                this.selectedGeneratorId = response.generators[0].id ?? 0;
                this.isGeneratorsLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.generators = [];
                this.isGeneratorsLoading = false;
            }
        });
    }

    // Listens to the output to any child component outputting a bill list
    generateBills(bills: Bill[]) {
       this.billsPreview = bills;
    }
}
