import { Component, inject, Input, output } from '@angular/core';
import { Bill } from '@/core/models/model';
import { GenerateBillsForAllFixedSubscribersRequest } from '@/core/services/api/request';
import { GenerateBillsForAllFixedSubscribersResponse } from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-fixed-bill-generation',
    imports: [Button],
    templateUrl: './fixed-bill-generation.component.html',
    styleUrl: './fixed-bill-generation.component.scss'
})
export class FixedBillGenerationComponent {
    generatorId: number = 0;

    // Input setter. used to change value from parent
    @Input({ alias: 'generatorId', required: true }) set _generatorId(value: number) {
        this.generatorId = value;
    }

    // Output generated bills from kva readings
    generatedBills = output<Bill[]>();

    private readonly generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    isBillsGenerating: boolean = false;

    generateBills() {
        this.isBillsGenerating = true;

        let request: GenerateBillsForAllFixedSubscribersRequest = {
            generatorId: this.generatorId
        };

        console.log(request);

        this.generatorOwnerService.generateBillsForAllFixedSubscribers(request).subscribe({
            next: (response: GenerateBillsForAllFixedSubscribersResponse) => {
                this.generatedBills.emit(
                    response.bills.map((bill, index) => ({
                        ...bill,
                        id: index + 1
                    }))
                );

                this.isBillsGenerating = false;
            },
            error: (err) => {
                console.log(err);
                this.generatedBills.emit([]);
                this.isBillsGenerating = false;
            }
        });
    }
}
