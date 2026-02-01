import { Component, inject, Input, output } from '@angular/core';
import { Bill } from '@/core/models/model';
import { GenerateBillsForAllFixedSubscribersRequest } from '@/core/services/api/request';
import { GenerateBillsForAllFixedSubscribersResponse } from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { Button } from 'primeng/button';
import { getBillYearMonth } from '@/core/utils/utils';
import { NotificationService } from '@/core/services/notification.service';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
    selector: 'app-fixed-bill-generation',
    imports: [Button, FormsModule, DatePicker],
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
    private readonly notificationService = inject(NotificationService);

    isBillsGenerating: boolean = false;

    billPeriod: Date | null = null;

    generateBills() {
        const period = getBillYearMonth(this.billPeriod);

        if (!period) {
            this.notificationService.warn('Warning', 'Please select Bill Period (year/month)');
            return;
        }

        this.isBillsGenerating = true;

        let request: GenerateBillsForAllFixedSubscribersRequest = {
            generatorId: this.generatorId,
            billMonth: period.billMonth,
            billYear: period.billYear
        };

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
