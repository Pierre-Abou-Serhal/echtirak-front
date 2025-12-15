import { Component, EventEmitter, Output } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-qr-scanner',
    standalone: true,
    imports: [ZXingScannerModule, FormsModule, Button],
    templateUrl: './qr-scanner.component.html',
    styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent {
    @Output() scanned = new EventEmitter<string>();
    @Output() closed = new EventEmitter<void>();

    allowedFormats = [BarcodeFormat.QR_CODE];

    qrResult: string | null = null;

    availableDevices: MediaDeviceInfo[] = [];
    currentDevice?: MediaDeviceInfo;

    // permission state: null = not answered yet
    hasPermission: boolean | null = null;

    // prevent emitting multiple times
    private emitted = false;

    enabled = true;

    onScanSuccess(result: string) {
        if (!result || this.emitted) return;

        this.emitted = true;
        this.qrResult = result.trim();

        // emit once; parent usually closes dialog
        this.scanned.emit(this.qrResult);
    }

    onCamerasFound(devices: MediaDeviceInfo[]) {
        this.availableDevices = devices;

        if (!this.currentDevice && devices.length > 0) {
            // Prefer back camera if possible
            const backCam = devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1]; // often last is back camera on phones

            this.currentDevice = backCam;
        }
    }

    onPermissionResponse(has: boolean) {
        this.hasPermission = has;
    }

    clearResult() {
        this.qrResult = null;
        this.emitted = false;
    }

    onDeviceSelectChange(event: Event): void {
        const selectedDeviceId = (event.target as HTMLSelectElement).value;
        this.currentDevice = this.availableDevices.find((d) => d.deviceId === selectedDeviceId);
    }

    close() {
        this.enabled = false; // stop scanning
        this.closed.emit();
    }
}
