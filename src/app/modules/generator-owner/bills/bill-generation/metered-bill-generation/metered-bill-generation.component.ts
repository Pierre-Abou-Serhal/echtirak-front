import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KvaReading } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GetKVAReadingsPerGeneratorResponse } from '@/core/services/api/response';

@Component({
    selector: 'app-metered-bill-generation',
    imports: [ FormsModule ],
    templateUrl: './metered-bill-generation.component.html',
    styleUrl: './metered-bill-generation.component.scss'
})
export class MeteredBillGenerationComponent {
    generatorId: number = 0;

    // Input setter. used to change value from parent
    @Input({ alias: 'generatorId', required: true }) set _generatorId(value: number) {
        this.generatorId = value;
        this.loadKvaReadings();
    }

    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);

    kvaReadings: KvaReading[] = [];
    isKvaReadingLoading = true;

    loadKvaReadings() {
        this.generatorOwnerService
            .getKVAReadingsPerGenerator({
                generatorId: this.generatorId
            })
            .subscribe({
                next: (response: GetKVAReadingsPerGeneratorResponse) => {
                    this.kvaReadings = response.readings;
                    this.isKvaReadingLoading = false;

                    console.log(this.generatorId);
                    console.log(this.kvaReadings);
                },
                error: (err) => {
                    console.log(err);
                    this.kvaReadings = [];
                    this.isKvaReadingLoading = false;
                }
            });
    }
}
