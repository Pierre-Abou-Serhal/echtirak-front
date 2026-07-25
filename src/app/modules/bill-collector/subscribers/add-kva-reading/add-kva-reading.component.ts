import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Button } from 'primeng/button';

import { NotificationService } from '@/core/services/notification.service';
import {
    KvaReadingEditorComponent
} from '@/modules/bill-collector/kva-readings/kva-reading-editor/kva-reading-editor.component';
import { UpsertKvaReadingResult } from '@/core/dtos/dto';

@Component({
    selector: 'app-add-kva-reading',
    standalone: true,
    imports: [Button, KvaReadingEditorComponent, KvaReadingEditorComponent],
    templateUrl: './add-kva-reading.component.html'
})
export class AddKvaReadingComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    subscriberId = 0;
    readingEditorBusy = false;

    ngOnInit(): void {
        this.subscriberId = Number(this.route.snapshot.paramMap.get('id'));

        if (!Number.isFinite(this.subscriberId) || this.subscriberId <= 0) {
            this.notificationService.error('Invalid Subscriber', 'A valid subscriber is required to add a reading.');

            this.goBack();
        }
    }

    onReadingSaved(result: UpsertKvaReadingResult): void {
        let message = 'KWH reading added successfully.';

        if (result.billCreated) {
            message = 'Reading saved and bill created automatically.';
        } else if (result.billAmended) {
            message = 'Reading saved and the existing bill was amended.';
        }

        this.notificationService.success('Success', message);

        // The editor emits saved before its finalize callback clears busy.
        this.readingEditorBusy = false;
        this.goBack();
    }

    goBack(): void {
        if (this.readingEditorBusy) {
            return;
        }

        void this.router.navigate(['/app/bill-collector/subscribers']);
    }
}
