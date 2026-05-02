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
import { formatSubscriberAddress } from '@/core/utils/utils';

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
    private readonly location = inject(Location);

    private readonly billCollectorService = inject(BillCollectorService);
    private readonly notificationService = inject(NotificationService);

    subscriberId!: number;

    kvaReading: number | null = null;

    imageFile: File | null = null;
    imagePreviewUrl: string | null = null;

    submitted = false;
    saving = false;
    compressingImage = false;

    subscriber?: Subscriber;
    isSubscriberDataLoading = true;
    subscriberPanelCollapsed = true;

    async ngOnInit(): Promise<void> {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.subscriberId = Number(idParam);

        if (!Number.isFinite(this.subscriberId) || this.subscriberId <= 0) {
            this.goBack();
            return;
        }

        try {
            const res: GetSubscribersResponse = await firstValueFrom(
                this.billCollectorService.getSubs({
                    pageNumber: 1,
                    pageSize: 1,
                    subscriberId: this.subscriberId
                })
            );

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

    async onFileSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.notificationService.error('Invalid file', 'Please select an image.');
            input.value = '';
            return;
        }

        this.compressingImage = true;

        try {
            const compressedFile = await this.compressImageToTargetSize(file, 400);

            this.imageFile = compressedFile;

            if (this.imagePreviewUrl) {
                URL.revokeObjectURL(this.imagePreviewUrl);
            }

            this.imagePreviewUrl = URL.createObjectURL(compressedFile);
        } catch (error) {
            this.notificationService.error('Compression Failed', 'Failed to compress the image. Please try another image.');

            input.value = '';
            this.imageFile = null;

            if (this.imagePreviewUrl) {
                URL.revokeObjectURL(this.imagePreviewUrl);
                this.imagePreviewUrl = null;
            }

        } finally {
            this.compressingImage = false;
        }
    }

    private async compressImageToTargetSize(file: File, targetSizeKb = 400): Promise<File> {
        const attempts = [
            { maxWidth: 1200, maxHeight: 1200, quality: 0.7 },
            { maxWidth: 1000, maxHeight: 1000, quality: 0.65 },
            { maxWidth: 900, maxHeight: 900, quality: 0.6 },
            { maxWidth: 800, maxHeight: 800, quality: 0.55 },
            { maxWidth: 700, maxHeight: 700, quality: 0.5 },
            { maxWidth: 600, maxHeight: 600, quality: 0.45 }
        ];

        let bestFile = file;

        for (const attempt of attempts) {
            const compressed = await this.compressImage(file, {
                maxWidth: attempt.maxWidth,
                maxHeight: attempt.maxHeight,
                quality: attempt.quality,
                outputType: 'image/jpeg'
            });

            bestFile = compressed;

            const sizeKb = compressed.size / 1024;

            if (sizeKb <= targetSizeKb) {
                return compressed;
            }
        }

        return bestFile;
    }

    private compressImage(
        file: File,
        options: {
            maxWidth: number;
            maxHeight: number;
            quality: number;
            outputType: 'image/jpeg' | 'image/webp';
        }
    ): Promise<File> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const objectUrl = URL.createObjectURL(file);

            image.onload = () => {
                URL.revokeObjectURL(objectUrl);

                const { width, height } = this.calculateImageSize(image.width, image.height, options.maxWidth, options.maxHeight);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not create canvas context.'));
                    return;
                }

                if (options.outputType === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Image compression failed.'));
                            return;
                        }

                        const extension = options.outputType === 'image/webp' ? 'webp' : 'jpg';
                        const fileName = this.replaceFileExtension(file.name, extension);

                        const compressedFile = new File([blob], fileName, {
                            type: options.outputType,
                            lastModified: Date.now()
                        });

                        resolve(compressedFile);
                    },
                    options.outputType,
                    options.quality
                );
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Could not load image.'));
            };

            image.src = objectUrl;
        });
    }

    private calculateImageSize(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        if (width <= maxWidth && height <= maxHeight) {
            return { width, height };
        }

        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        return { width, height };
    }

    private replaceFileExtension(fileName: string, extension: string): string {
        const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');

        return `${nameWithoutExtension}.${extension}`;
    }

    clearImage(): void {
        this.imageFile = null;

        if (this.imagePreviewUrl) {
            URL.revokeObjectURL(this.imagePreviewUrl);
            this.imagePreviewUrl = null;
        }
    }

    isKvaReadingValid(): boolean {
        return this.kvaReading !== null && this.kvaReading !== undefined && this.kvaReading >= (this.subscriber?.currentKva ?? 0);
    }

    private isFormValid(): boolean {
        return this.isKvaReadingValid() && !!this.imageFile;
    }

    submit(): void {
        this.submitted = true;

        if (!this.isFormValid() || this.saving || this.compressingImage) return;

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
                finalize(() => {
                    this.saving = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.notificationService.success('Success', 'KWH reading submitted.');
                    this.goBack();
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    goBack(): void {
        const before = window.history.length;

        this.location.back();

        setTimeout(() => {
            if (window.history.length === before) {
                this.router.navigate(['/app/bill-collector/subscribers']);
            }
        }, 0);
    }

    protected readonly formatSubscriberAddress = formatSubscriberAddress;
}
