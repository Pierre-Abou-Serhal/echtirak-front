import { Component, EventEmitter, Output } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat, Result } from '@zxing/library';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

export interface BarcodeScannedEvent {
    value: string;
    format: BarcodeFormat;
}

@Component({
    selector: 'app-qr-scanner',
    standalone: true,
    imports: [ZXingScannerModule, FormsModule, Button],
    templateUrl: './qr-scanner.component.html',
    styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent {
    @Output() scanned = new EventEmitter<string>();
    @Output() barcodeScanned = new EventEmitter<BarcodeScannedEvent>();
    @Output() closed = new EventEmitter<void>();

    allowedFormats = [
        BarcodeFormat.QR_CODE,

        // Common bill/barcode formats
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.CODE_93,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.ITF,
        BarcodeFormat.CODABAR
    ];

    scanResult: string | null = null;

    availableDevices: MediaDeviceInfo[] = [];
    currentDevice?: MediaDeviceInfo;

    hasPermission: boolean | null = null;

    private emitted = false;

    enabled = true;

    onScanComplete(result: Result | null | undefined): void {
        if (!result || this.emitted) return;

        const value = result.getText()?.trim();
        const format = result.getBarcodeFormat();

        if (!value) return;

        this.emitted = true;
        this.scanResult = value;

        if (format === BarcodeFormat.QR_CODE) {
            this.scanned.emit(value);
            return;
        }

        this.barcodeScanned.emit({
            value,
            format
        });
    }

    onCamerasFound(devices: MediaDeviceInfo[]) {
        this.availableDevices = devices;

        if (!this.currentDevice && devices.length > 0) {
            const backCam = devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];

            this.currentDevice = backCam;
        }
    }

    onPermissionResponse(has: boolean) {
        this.hasPermission = has;
    }

    clearResult() {
        this.scanResult = null;
        this.emitted = false;
        this.enabled = true;
    }

    onDeviceSelectChange(event: Event): void {
        const selectedDeviceId = (event.target as HTMLSelectElement).value;
        this.currentDevice = this.availableDevices.find((d) => d.deviceId === selectedDeviceId);
    }

    close() {
        this.enabled = false;
        this.closed.emit();
    }
}
