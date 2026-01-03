import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BillCollectorService } from '@/core/services/bill-collector.service';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@/core/services/notification.service';
import { KvaReadingStatus } from '@/core/enums/enum';
import { finalize, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { Subscriber } from '@/core/models/model';
import { GetSubscribersResponse } from '@/core/services/api/response';
import { Skeleton } from 'primeng/skeleton';
import { LbPhonePipe } from '@/core/pipes/pipes';
import { provideNgxMask } from 'ngx-mask';
import { Panel } from 'primeng/panel';
import { PrimeTemplate } from 'primeng/api';

@Component({
    selector: 'app-add-kva-reading.component',
    imports: [InputNumber, FormsModule, Button, Skeleton, LbPhonePipe, Panel, PrimeTemplate],
    templateUrl: './add-kva-reading.component.html',
    styleUrl: './add-kva-reading.component.scss',
    standalone: true,
    providers: [provideNgxMask()]
})
export class AddKvaReadingComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private location = inject(Location);

    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);

    subscriberId!: number;

    kvaReading: number | null = null;

    imageFile: File | null = null;
    imagePreviewUrl: string | null = null;

    submitted = false;
    saving = false;

    subscriber?: Subscriber;
    isSubscriberDataLoading: boolean = true;
    subscriberPanelCollapsed = true;

    async ngOnInit(): Promise<void> {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.subscriberId = Number(idParam);

        if (!Number.isFinite(this.subscriberId) || this.subscriberId <= 0) {
            // fallback if route param is wrong
            this.goBack();
        }

        // Call API to get subscriber info by id
        try {
            const res: GetSubscribersResponse = await firstValueFrom(
                this.billCollectorService.getSubs({
                    pageNumber: 1,
                    pageSize: 1,
                    subscriberId: this.subscriberId
                })
            );

            // Subscriber ID matched QR Code ID
            const items = res?.page?.items ?? [];

            if (!items || items.length === 0) {
                this.isSubscriberDataLoading = false;
                this.goBack();
            } else {
                this.subscriber = items[0];
                this.isSubscriberDataLoading = false;
            }
        } catch (error) {
            console.log(error);
            this.isSubscriberDataLoading = false;
            this.goBack();
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        // basic guard (optional)
        if (!file.type.startsWith('image/')) {
            this.notificationService.error('Invalid file', 'Please select an image.');
            return;
        }

        this.imageFile = file;

        // preview
        if (this.imagePreviewUrl) URL.revokeObjectURL(this.imagePreviewUrl);
        this.imagePreviewUrl = URL.createObjectURL(file);
    }

    clearImage() {
        this.imageFile = null;

        if (this.imagePreviewUrl) {
            URL.revokeObjectURL(this.imagePreviewUrl);
            this.imagePreviewUrl = null;
        }
    }

    isKvaReadingValid(): boolean {
        // allow 0 if you want; if not, use > 0
        return this.kvaReading !== null && this.kvaReading !== undefined && this.kvaReading >= (this.subscriber?.currentKva ?? 0);
    }

    private isFormValid(): boolean {
        return this.isKvaReadingValid() && !!this.imageFile;
    }

    submit() {
        this.submitted = true;
        if (!this.isFormValid() || this.saving) return;

        this.saving = true;

        this.billCollectorService
            .upsertKVAReading({
                id: -1,
                subscriberId: this.subscriberId,
                kvaReading: this.kvaReading!,
                status: KvaReadingStatus.PENDING,
                imageFile: this.imageFile!
            })
            .pipe(
                finalize(() => (this.saving = false)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.notificationService.success('Success', 'KVA reading submitted.');
                    this.goBack(); // go back after success
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    goBack() {
        const before = window.history.length;
        this.location.back();

        setTimeout(() => {
            if (window.history.length === before) {
                this.router.navigate(['/app/bill-collector/subscribers']);
            }
        }, 0);
    }
}
