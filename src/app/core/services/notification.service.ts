import { MessageService } from 'primeng/api';
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private messageService: MessageService,  private zone: NgZone) {}

    error(summary: string, detail?: string, sticky = false) {
        this.zone.run(() => this.messageService.add({ severity: 'error', summary, detail, sticky }));
    }

    warn(summary: string, detail?: string) {
        this.zone.run(() => this.messageService.add({ severity: 'warn', summary, detail }));
    }

    success(summary: string, detail?: string) {
        this.zone.run(() => this.messageService.add({ severity: 'success', summary, detail }));
    }
}
