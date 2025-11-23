import { Component } from '@angular/core';
import { QrScannerComponent } from '@/modules/bill-collector/qr-scanner/qr-scanner.component';

@Component({
    selector: 'app-subscribers.component',
    imports: [QrScannerComponent],
    templateUrl: './subscribers.component.html',
    styleUrl: './subscribers.component.scss',
    standalone: true
})
export class SubscribersComponent {}
