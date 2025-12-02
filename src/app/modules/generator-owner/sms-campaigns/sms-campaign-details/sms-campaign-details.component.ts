import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GetLookupResponse, GetSmsCampaignDetailsResponse } from '@/core/services/api/response';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SmsMessage } from '@/core/models/model';
import { LookupDomain, SmsCampaignStatus, SmsMessageStatus } from '@/core/enums/enum';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-sms-campaign-details',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, TagModule, ButtonModule, InputTextModule, FormsModule, Select],
    templateUrl: './sms-campaign-details.component.html',
    styleUrl: './sms-campaign-details.component.scss'
})
export class SmsCampaignDetailsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    constructor(private location: Location) {}

    public campaignId: number = 0;
    public details: WritableSignal<GetSmsCampaignDetailsResponse | null> = signal(null);
    public smsStatuses: WritableSignal<SelectOptionStrValue[] | undefined> = signal(undefined);
    public messages: WritableSignal<SmsMessage[]> = signal([]);
    public totalRecords: WritableSignal<number> = signal(0);
    public loading: WritableSignal<boolean> = signal(false);
    public isSmsStatusLoading: WritableSignal<boolean> = signal(true);
    public pageSize = 25;
    public pageNumber = 1;

    // Filters
    public filterPhoneNumber = '';
    public filterSubscriberName = '';
    public filterStatus = '';

    ngOnInit() {
        this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadDetails();
        this.loadSmsStatuses();
    }

    loadDetails() {
        this.loading.set(true);
        this.generatorOwnerService
            .getSmsCampaignDetails({
                id: this.campaignId,
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                status: this.filterStatus || undefined,
                phoneNumber: this.filterPhoneNumber || undefined,
                subscriberName: this.filterSubscriberName || undefined
            })
            .subscribe({
                next: (res) => {
                    this.details.set(res);
                    this.messages.set(res.messages.items);
                    this.totalRecords.set(res.messages.totalCount);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
    }

    loadSmsStatuses() {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.SMS_STATUS }).subscribe({
            next: (res: GetLookupResponse) => {
                this.smsStatuses.set(res.items.map((item) => ({ label: item.description, value: item.code })));
                this.isSmsStatusLoading.set(false);
            },
            error: (err) => {
                console.log(err);
                this.smsStatuses.set([]);
                this.isSmsStatusLoading.set(false);
            }
        });
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows + 1;
        this.pageSize = event.rows;
        this.loadDetails();
    }

    onFilter() {
        this.pageNumber = 1;
        this.loadDetails();
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case SmsMessageStatus.DELIVERED:
                return 'success';
            case SmsMessageStatus.PENDING:
                return 'warn';
            case SmsMessageStatus.SENT:
                return 'info';
            case SmsMessageStatus.FAILED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getSmsCampaignStatusSeverity(status: string): string {
        switch (status) {
            case SmsCampaignStatus.PENDING:
                return 'warn';
            case SmsCampaignStatus.PROCESSING:
                return 'info';
            case SmsCampaignStatus.COMPLETED:
                return 'success';
            default:
                return 'secondary';
        }
    }

    backClicked(): void {
        this.location.back();
    }
}
