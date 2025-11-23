import { Component, OnInit } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-qr-scanner',
    standalone: true,
    imports: [ZXingScannerModule, FormsModule],
    templateUrl: './qr-scanner.component.html',
    styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent implements OnInit {
    qrResult: string | null = null;
    hasPermission = false;
    availableDevices: MediaDeviceInfo[] = [];
    currentDevice: MediaDeviceInfo | undefined;

    ngOnInit() {
        console.log('test');
    }

    allowedFormats = [BarcodeFormat.QR_CODE];

    onScanSuccess(result: string) {
        this.qrResult = result;
        console.log('QR result:', result);
        // here you can navigate, call an API, etc.
    }

    onCamerasFound(devices: MediaDeviceInfo[]) {
        console.log('Cameras found:', devices);
        this.availableDevices = devices;
        if (!this.currentDevice && devices.length > 0) {
            // pick first device by default (often the back cam on mobile)
            this.currentDevice = devices[0];
        }
    }

    onPermissionResponse(has: boolean) {
        console.log('Permission Response:', has);
        this.hasPermission = has;
    }

    clearResult() {
        this.qrResult = null;
    }

    onDeviceSelectChange(selectedValue: Event): void {
        const selectedDeviceId = (selectedValue.target as HTMLSelectElement).value;
        this.currentDevice = this.availableDevices.find(
            (device) => device.deviceId === selectedDeviceId
        );
    }
}
