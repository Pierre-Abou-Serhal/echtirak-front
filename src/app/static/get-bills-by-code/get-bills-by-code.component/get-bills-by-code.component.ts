import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicService } from '@/core/services/public.service';
import { Bill } from '@/core/models/model';
import { GetBillsByCodeResponse } from '@/core/services/api/response';

@Component({
    selector: 'app-get-bills-by-code',
    standalone: true,
    imports: [CommonModule, FormsModule ],
    templateUrl: './get-bills-by-code.component.html',
    styleUrl: './get-bills-by-code.component.scss'
})
export class GetBillsByCodeComponent implements OnInit {
    @Input() code: string | null = null;

    publicService = inject(PublicService);

    loading = false;
    pendingBills: Bill[] = [];

    ngOnInit(): void {
        this.getPendingBills();
    }
    getPendingBills() {
        if (this.code) {
            this.loading = true;
            this.publicService.getBillsByCode({ SubscriberBillCode: this.code }).subscribe({
                next: (response: GetBillsByCodeResponse) => {
                    this.pendingBills = response.page.items;

                    this.loading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.loading = false;
                }
            });
        }
    }
}
