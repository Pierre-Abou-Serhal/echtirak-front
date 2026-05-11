import { Component, EventEmitter, Output } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-qr-scanner',
    standalone: true,
    imports: [ZXingScannerModule, Button],
    templateUrl: './qr-scanner.component.html',
    styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent {
    @Output() scanned = new EventEmitter<string>();
    @Output() closed = new EventEmitter<void>();

    allowedFormats = [BarcodeFormat.QR_CODE];

    scanResult: string | null = null;

    availableDevices: MediaDeviceInfo[] = [];
    currentDevice?: MediaDeviceInfo;

    hasPermission: boolean | null = null;

    enabled = true;

    /**
     * Improves quality on many phones.
     * If your ngx-scanner version does not support [videoConstraints],
     * remove this property and the HTML binding.
     */
    videoConstraints: MediaTrackConstraints = {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
    };

    private emitted = false;

    /**
     * Stability check:
     * require the same QR value to be detected twice before emitting.
     */
    private lastScannedValue: string | null = null;
    private sameValueCount = 0;
    private readonly requiredStableReads = 2;

    onScanSuccess(value: string | null | undefined): void {
        if (!value || this.emitted) return;

        const cleanValue = value.trim();
        if (!cleanValue) return;

        if (this.lastScannedValue === cleanValue) {
            this.sameValueCount++;
        } else {
            this.lastScannedValue = cleanValue;
            this.sameValueCount = 1;
        }

        if (this.sameValueCount < this.requiredStableReads) return;

        this.emitted = true;
        this.enabled = false;
        this.scanResult = cleanValue;

        this.scanned.emit(cleanValue);
    }

    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.availableDevices = devices;

        if (!this.currentDevice && devices.length > 0) {
            const backCamera = devices.find((device) => /back|rear|environment/i.test(device.label)) ?? devices[devices.length - 1];

            this.currentDevice = backCamera;
        }
    }

    onPermissionResponse(hasPermission: boolean): void {
        this.hasPermission = hasPermission;
    }

    clearResult(): void {
        this.scanResult = null;
        this.emitted = false;
        this.enabled = true;

        this.lastScannedValue = null;
        this.sameValueCount = 0;
    }

    onDeviceSelectChange(event: Event): void {
        const selectedDeviceId = (event.target as HTMLSelectElement).value;

        this.currentDevice = this.availableDevices.find((device) => device.deviceId === selectedDeviceId);

        this.clearResult();
    }

    close(): void {
        this.enabled = false;
        this.closed.emit();
    }
}
