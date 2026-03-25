import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicService } from '@/core/services/public.service';
import { Bill } from '@/core/models/model';
import { GetBillsByCodeResponse } from '@/core/services/api/response';
import { finalize } from 'rxjs';
import { Divider } from 'primeng/divider';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-get-bills-by-code',
    standalone: true,
    imports: [CommonModule, FormsModule, Divider, Card, Message, ProgressSpinner, Tag, Button],
    templateUrl: './get-bills-by-code.component.html',
    styleUrl: './get-bills-by-code.component.scss'
})
export class GetBillsByCodeComponent implements OnInit {
    @Input() code: string | null = null;

    publicService = inject(PublicService);

    loading = false;
    pendingBills: Bill[] = [];

    downloading: Record<number, boolean> = {};

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

    getExtraFeesTotalUsd(bill: any): number {
        return (bill?.extraFees ?? []).reduce((sum: number, f: any) => sum + (Number(f?.amount) || 0), 0);
    }

    getExtraFeesTotalLbp(bill: any): number {
        return (bill?.extraFees ?? []).reduce((sum: number, f: any) => sum + (Number(this.convertFormattedLbpAmount(f?.amountLBP)) || 0), 0);
    }

    convertFormattedLbpAmount(amountLbp?: string) {
        if (!amountLbp) {
            return 0;
        }
        const numberString = amountLbp.replace(/,/g, '');
        return parseFloat(numberString);
    }

    isDownloading(billId: number): boolean {
        return this.downloading[billId];
    }

    downloadBillPdf(bill: any) {
        if (!bill?.id) return;
        if (!this.code) return; // subscriberBillCode from your page

        const billId = Number(bill.id);
        if (this.isDownloading(billId)) return;

        this.downloading[billId] = true;

        this.publicService
            .getBillReportByCode({
                subscriberBillCode: this.code,
                billId: billId
            })
            .pipe(finalize(() => (this.downloading[billId] = false)))
            .subscribe({
                next: (blob: Blob) => {
                    const filename = this.buildBillPdfName(bill);
                    this.saveBlob(blob, filename);
                },
                error: (err) => {
                    console.log(err);
                    // optional: show toast/snackbar
                }
            });
    }

    private buildBillPdfName(bill: any): string {
        const ym = `${bill.billYear}-${String(bill.billMonth).padStart(2, '0')}`;
        const name = `${(bill.subscriberFirstName ?? '').toString().trim()}_${(bill.subscriberLastName ?? '').toString().trim()}`.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
        return `bill_${bill.id}_${ym}_${name || 'subscriber'}.pdf`;
    }

    private saveBlob(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }
}
