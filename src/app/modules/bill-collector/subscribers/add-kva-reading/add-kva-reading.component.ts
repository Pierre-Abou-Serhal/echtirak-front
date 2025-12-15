import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BillCollectorService } from '@/core/services/bill-collector-service';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@/core/services/notification.service';
import { KvaReadingStatus } from '@/core/enums/enum';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';

@Component({
    selector: 'app-add-kva-reading.component',
    imports: [InputNumber, FormsModule, Button],
    templateUrl: './add-kva-reading.component.html',
    styleUrl: './add-kva-reading.component.scss'
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

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.subscriberId = Number(idParam);

        if (!Number.isFinite(this.subscriberId) || this.subscriberId <= 0) {
            // fallback if route param is wrong
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
        return this.kvaReading !== null && this.kvaReading !== undefined;
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
                    this.notificationService.error('Failed', 'Could not submit KVA reading.');
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
