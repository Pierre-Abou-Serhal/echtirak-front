import { Component, inject, OnInit } from '@angular/core';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { SmsTemplate } from '@/core/models/model';
import { GetSmsTemplatesResponse } from '@/core/services/api/response';
import { FormsModule } from '@angular/forms';
import { Skeleton } from 'primeng/skeleton';

type SmsTemplateView = SmsTemplate & {
    currentLang: 'en' | 'ar';
};

@Component({
    selector: 'app-sms-templates.component',
    imports: [FormsModule, Skeleton],
    templateUrl: './sms-templates.component.html',
    styleUrl: './sms-templates.component.scss',
    standalone: true
})

export class SmsTemplatesComponent implements OnInit {
    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    smsTemplates: SmsTemplateView[] = [];

    loading: boolean = true;

    ngOnInit() {
        this.generatorOwnerService.getSmsTemplate({}).subscribe({
            next: (response: GetSmsTemplatesResponse) => {
                this.smsTemplates = response.templates.map(t => ({
                    ...t,
                    currentLang: 'en' // default language
                }));

                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.loading = false;
            }
        });
    }
}
