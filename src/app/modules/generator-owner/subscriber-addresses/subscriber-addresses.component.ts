import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { Table, TableModule } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Listbox } from 'primeng/listbox';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { AddressHint } from '@/core/dtos/dto';
import { formatSubscriberAddress } from '@/core/utils/utils';
import { BuildingBox, Generator, Subscriber } from '@/core/models/model';
import { GetBuildingBoxQrCodeRequest } from '@/core/services/api/request';

import { BuildingBoxSimulatorModalComponent } from '@/modules/generator-owner/subscriber-addresses/building-box-simulator-modal/building-box-simulator-modal.component';

type FieldName = 'City' | 'Street' | 'Building';
type QrDownloadMode = 'GENERATOR' | 'ADDRESS';
type QrDownloadFormat = 'PDF' | 'ZIP';

type AddressHintVm = AddressHint & { label: string };

@Component({
    selector: 'app-subscriber-addresses',
    standalone: true,
    imports: [FormsModule, TableModule, AutoComplete, InputText, Button, SelectButton, IconField, InputIcon, ButtonDirective, Dialog, Select, Listbox, Skeleton, Tooltip, BuildingBoxSimulatorModalComponent],
    templateUrl: './subscriber-addresses.component.html',
    styleUrl: './subscriber-addresses.component.scss'
})
export class SubscriberAddressesComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    private readonly COUNTRY = 'Lebanon';

    // ===== Table state =====
    addresses: AddressHintVm[] = [];
    selectedRow: AddressHintVm | null = null;
    picked?: AddressHintVm;

    loadingAddresses = false;
    totalRecords = 0;

    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // ===== Bulk update form =====
    fieldOptions = [
        { label: 'City', value: 'City' },
        { label: 'Street', value: 'Street' },
        { label: 'Building', value: 'Building' }
    ];

    bulk = {
        fieldName: 'City' as FieldName,
        city: '',
        street: '',
        oldValue: '',
        newValue: ''
    };

    contextCitySuggestions: string[] = [];
    contextStreetSuggestions: string[] = [];
    oldValueSuggestions: string[] = [];

    contextCityLoading = false;
    contextStreetLoading = false;
    oldValueLoading = false;

    submitting = false;

    // ===== Building box modal =====
    buildingBoxDialogVisible = false;
    selectedBuildingBoxToken: string | null = null;

    // ===== QR Download popup =====
    displayQrCodesDownloadDialog = false;

    qrDownloadMode: QrDownloadMode = 'GENERATOR';
    qrDownloadFormat: QrDownloadFormat = 'PDF';

    qrDownloadModeOptions = [
        { label: 'Generator', value: 'GENERATOR' },
        { label: 'Address', value: 'ADDRESS' }
    ];

    qrDownloadFormatOptions = [
        { label: 'PDF', value: 'PDF' },
        { label: 'ZIP', value: 'ZIP' }
    ];

    generators: Generator[] = [];
    generatorOptions: { label: string; value: number }[] = [];
    selectedGeneratorForQrDownload: number | null = null;
    generatorsLoading = false;

    qrAddress = {
        city: '',
        street: '',
        building: ''
    };

    qrCitySuggestions: string[] = [];
    qrStreetSuggestions: string[] = [];
    qrBuildingSuggestions: string[] = [];

    qrCityLoading = false;
    qrStreetLoading = false;
    qrBuildingLoading = false;

    isDownloadingQrCodes = false;

    ngOnInit(): void {
        this.loadAllHints();
        this.loadGenerators();
    }

    // ===== Load all hints =====
    loadAllHints(): void {
        this.loadingAddresses = true;

        this.generatorOwnerService
            .getAddressHints({})
            .pipe(finalize(() => (this.loadingAddresses = false)))
            .subscribe({
                next: (res) => {
                    this.addresses = (res.hints ?? []).map((h) => ({
                        ...h,
                        label: formatSubscriberAddress(h)
                    }));

                    this.totalRecords = this.addresses.length;
                    this.first = 0;
                },
                error: () => {
                    this.addresses = [];
                    this.totalRecords = 0;
                }
            });
    }

    loadGenerators(): void {
        this.generatorsLoading = true;

        this.generatorOwnerService
            .getGenerators()
            .pipe(finalize(() => (this.generatorsLoading = false)))
            .subscribe({
                next: (res) => {
                    this.generators = res.generators ?? [];

                    this.generatorOptions = this.generators.map((generator) => ({
                        label: `${generator.code} - ${generator.description || generator.location || 'Generator'}`,
                        value: generator.id
                    }));

                    if (this.generatorOptions.length === 1) {
                        this.selectedGeneratorForQrDownload = this.generatorOptions[0].value;
                    }
                },
                error: () => {
                    this.generators = [];
                    this.generatorOptions = [];
                    this.selectedGeneratorForQrDownload = null;
                    this.notificationService.error('Error', 'Failed to load generators.');
                }
            });
    }

    // ===== Table filter =====
    onGlobalFilter(table: Table, event: Event): void {
        const value = (event.target as HTMLInputElement).value ?? '';
        table.filterGlobal(value, 'contains');
    }

    clear(table: Table, searchInput: HTMLInputElement): void {
        table.clear();
        searchInput.value = '';
        table.filterGlobal('', 'contains');
    }

    pageChange(event: any): void {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    // ===== Row click => fill bulk context + old value =====
    pickAddress(a: AddressHintVm): void {
        this.picked = a;
        this.bulk.newValue = '';

        if (this.bulk.fieldName === 'City') {
            this.bulk.city = '';
            this.bulk.street = '';
            this.bulk.oldValue = a.city ?? '';
            return;
        }

        if (this.bulk.fieldName === 'Street') {
            this.bulk.city = a.city ?? '';
            this.bulk.street = '';
            this.bulk.oldValue = a.street ?? '';
            return;
        }

        this.bulk.city = a.city ?? '';
        this.bulk.street = a.street ?? '';
        this.bulk.oldValue = a.building ?? '';
    }

    // ===== Bulk form helpers =====
    private filterValues(values: string[], query: string): string[] {
        const q = (query || '').trim().toLowerCase();

        if (!q) return values.slice(0, 50);

        return values.filter((v) => v.toLowerCase().includes(q)).slice(0, 50);
    }

    bulkIsValid(): boolean {
        const oldV = this.bulk.oldValue?.trim();
        const newV = this.bulk.newValue?.trim();

        if (!oldV || !newV) return false;
        if (oldV === newV) return false;

        if (this.bulk.fieldName === 'Street' && !this.bulk.city.trim()) return false;
        if (this.bulk.fieldName === 'Building' && (!this.bulk.city.trim() || !this.bulk.street.trim())) return false;

        return true;
    }

    resetBulk(): void {
        this.bulk = {
            fieldName: this.bulk.fieldName,
            city: '',
            street: '',
            oldValue: '',
            newValue: ''
        };

        this.contextCitySuggestions = [];
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];

        this.selectedRow = null;
        this.picked = undefined;
    }

    onFieldChange(): void {
        const keepField = this.bulk.fieldName;

        this.bulk = {
            fieldName: keepField,
            city: '',
            street: '',
            oldValue: '',
            newValue: ''
        };

        this.contextCitySuggestions = [];
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];

        if (this.picked) {
            this.pickAddress(this.picked);
        }
    }

    onContextCityComplete(event: any): void {
        const q = (event.query || '').trim();

        this.contextCityLoading = true;

        this.generatorOwnerService
            .getCities({ country: this.COUNTRY })
            .pipe(finalize(() => (this.contextCityLoading = false)))
            .subscribe({
                next: (res) => (this.contextCitySuggestions = this.filterValues(res.values ?? [], q)),
                error: () => (this.contextCitySuggestions = [])
            });
    }

    onContextCityPicked(): void {
        this.bulk.street = '';
        this.bulk.oldValue = '';
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];
    }

    onContextStreetComplete(event: any): void {
        const q = (event.query || '').trim();
        const city = this.bulk.city.trim();

        if (!city) {
            this.contextStreetSuggestions = [];
            return;
        }

        this.contextStreetLoading = true;

        this.generatorOwnerService
            .getStreets({ country: this.COUNTRY, city })
            .pipe(finalize(() => (this.contextStreetLoading = false)))
            .subscribe({
                next: (res) => (this.contextStreetSuggestions = this.filterValues(res.values ?? [], q)),
                error: () => (this.contextStreetSuggestions = [])
            });
    }

    onContextStreetPicked(): void {
        this.bulk.oldValue = '';
        this.oldValueSuggestions = [];
    }

    onOldValueComplete(event: any): void {
        const q = (event.query || '').trim();

        this.oldValueLoading = true;

        const done = (vals: string[]) => {
            this.oldValueSuggestions = this.filterValues(vals ?? [], q);
            this.oldValueLoading = false;
        };

        const fail = () => {
            this.oldValueSuggestions = [];
            this.oldValueLoading = false;
        };

        if (this.bulk.fieldName === 'City') {
            this.generatorOwnerService.getCities({ country: this.COUNTRY }).subscribe({
                next: (res) => done(res.values ?? []),
                error: fail
            });
            return;
        }

        if (this.bulk.fieldName === 'Street') {
            const city = this.bulk.city.trim();

            if (!city) {
                fail();
                return;
            }

            this.generatorOwnerService.getStreets({ country: this.COUNTRY, city }).subscribe({
                next: (res) => done(res.values ?? []),
                error: fail
            });
            return;
        }

        const city = this.bulk.city.trim();
        const street = this.bulk.street.trim();

        if (!city || !street) {
            fail();
            return;
        }

        this.generatorOwnerService.getBuildings({ country: this.COUNTRY, city, street }).subscribe({
            next: (res) => done((res.items ?? []).map((buildingItem: BuildingBox) => buildingItem.building)),
            error: fail
        });
    }

    submitBulkUpdate(): void {
        if (!this.bulkIsValid()) return;

        this.submitting = true;

        this.generatorOwnerService
            .bulkUpdateAddresses({
                fieldName: this.bulk.fieldName,
                oldValue: this.bulk.oldValue.trim(),
                newValue: this.bulk.newValue.trim()
            })
            .pipe(finalize(() => (this.submitting = false)))
            .subscribe({
                next: () => {
                    this.notificationService.success('Successful', 'Addresses updated');
                    this.loadAllHints();
                    this.resetBulk();
                },
                error: () => this.notificationService.error('Error', 'Bulk update failed')
            });
    }

    onRowSelect(event: any): void {
        const a = event.data as AddressHintVm;
        this.pickAddress(a);
    }

    // ===== Building Box =====
    openBuildingBox(token: string): void {
        if (!token) {
            this.notificationService.warn('Missing QR Token', 'This address does not have a building box token.');
            return;
        }

        this.selectedBuildingBoxToken = token;
        this.buildingBoxDialogVisible = true;
    }

    onBuildingBoxOrderUpdated(subscribers: Subscriber[]): void {
        // Optional: refresh table if needed.
    }

    // ===== QR Download Dialog =====
    openQrCodesDownloadDialog(): void {
        this.displayQrCodesDownloadDialog = true;

        if (!this.generators.length && !this.generatorsLoading) {
            this.loadGenerators();
        }
    }

    onQrDownloadModeChanged(): void {
        this.qrCitySuggestions = [];
        this.qrStreetSuggestions = [];
        this.qrBuildingSuggestions = [];

        if (this.isQrDownloadGeneratorMode()) {
            this.qrAddress = {
                city: '',
                street: '',
                building: ''
            };
        }

        if (this.isQrDownloadAddressMode()) {
            this.selectedGeneratorForQrDownload = this.generatorOptions.length === 1 ? this.generatorOptions[0].value : null;
        }
    }

    isQrDownloadGeneratorMode(): boolean {
        return this.qrDownloadMode === 'GENERATOR';
    }

    isQrDownloadAddressMode(): boolean {
        return this.qrDownloadMode === 'ADDRESS';
    }

    canDownloadQrCodes(): boolean {
        if (this.isDownloadingQrCodes) return false;

        if (this.isQrDownloadGeneratorMode()) {
            return !!this.selectedGeneratorForQrDownload;
        }

        return !!this.qrAddress.city.trim();
    }

    onQrCityComplete(event: any): void {
        const q = (event.query || '').trim();

        this.qrCityLoading = true;

        this.generatorOwnerService
            .getCities({ country: this.COUNTRY })
            .pipe(finalize(() => (this.qrCityLoading = false)))
            .subscribe({
                next: (res) => (this.qrCitySuggestions = this.filterValues(res.values ?? [], q)),
                error: () => (this.qrCitySuggestions = [])
            });
    }

    onQrCityChanged(): void {
        this.qrAddress.city = (this.qrAddress.city || '').trim();
        this.qrAddress.street = '';
        this.qrAddress.building = '';
        this.qrStreetSuggestions = [];
        this.qrBuildingSuggestions = [];
    }

    onQrStreetComplete(event: any): void {
        const q = (event.query || '').trim();
        const city = this.qrAddress.city.trim();

        if (!city) {
            this.qrStreetSuggestions = [];
            return;
        }

        this.qrStreetLoading = true;

        this.generatorOwnerService
            .getStreets({ country: this.COUNTRY, city })
            .pipe(finalize(() => (this.qrStreetLoading = false)))
            .subscribe({
                next: (res) => (this.qrStreetSuggestions = this.filterValues(res.values ?? [], q)),
                error: () => (this.qrStreetSuggestions = [])
            });
    }

    onQrStreetChanged(): void {
        this.qrAddress.street = (this.qrAddress.street || '').trim();
        this.qrAddress.building = '';
        this.qrBuildingSuggestions = [];
    }

    onQrBuildingComplete(event: any): void {
        const q = (event.query || '').trim();
        const city = this.qrAddress.city.trim();
        const street = this.qrAddress.street.trim();

        if (!city || !street) {
            this.qrBuildingSuggestions = [];
            return;
        }

        this.qrBuildingLoading = true;

        this.generatorOwnerService
            .getBuildings({ country: this.COUNTRY, city, street })
            .pipe(finalize(() => (this.qrBuildingLoading = false)))
            .subscribe({
                next: (res) => {
                    const values = (res.items ?? []).map((buildingItem: BuildingBox) => buildingItem.building).filter(Boolean);

                    this.qrBuildingSuggestions = this.filterValues(values, q);
                },
                error: () => (this.qrBuildingSuggestions = [])
            });
    }

    onQrBuildingBlur(): void {
        this.qrAddress.building = (this.qrAddress.building || '').trim();
    }

    downloadQrCodes(): void {
        const request = this.buildQrCodeRequest();

        if (!request) return;

        this.isDownloadingQrCodes = true;

        const request$ = this.qrDownloadFormat === 'PDF' ? this.generatorOwnerService.getBuildingBoxQrCodePdf(request) : this.generatorOwnerService.getBuildingBoxQrCodeZip(request);

        request$.pipe(finalize(() => (this.isDownloadingQrCodes = false))).subscribe({
            next: (response) => {
                this.downloadBlobResponse(response, this.getQrDownloadFileName());
                this.displayQrCodesDownloadDialog = false;
            },
            error: () => {
                this.notificationService.error('Error', 'Failed to download QR codes.');
            }
        });
    }

    private buildQrCodeRequest(): GetBuildingBoxQrCodeRequest | null {
        if (this.isQrDownloadGeneratorMode()) {
            if (!this.selectedGeneratorForQrDownload) {
                this.notificationService.warn('Missing Generator', 'Please select a generator.');
                return null;
            }

            return {
                generatorId: this.selectedGeneratorForQrDownload,
                addressCountry: this.COUNTRY,
                addressCity: '',
                addressStreet: '',
                addressBuilding: ''
            };
        }

        const city = this.qrAddress.city.trim();
        const street = this.qrAddress.street.trim();
        const building = this.qrAddress.building.trim();

        if (!city) {
            this.notificationService.warn('Missing City', 'Please select or type a city.');
            return null;
        }

        return {
            generatorId: undefined,
            addressCountry: this.COUNTRY,
            addressCity: city,
            addressStreet: street,
            addressBuilding: building
        };
    }

    private downloadBlobResponse(response: HttpResponse<Blob>, fallbackFileName: string): void {
        const blob = response.body;

        if (!blob) {
            this.notificationService.error('Error', 'Downloaded file is empty.');
            return;
        }

        const contentDisposition = response.headers.get('content-disposition');
        const fileName = this.getFileNameFromContentDisposition(contentDisposition) || fallbackFileName;

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    private getFileNameFromContentDisposition(contentDisposition?: string | null): string | null {
        if (!contentDisposition) return null;

        const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
        if (utf8Match?.[1]) {
            return decodeURIComponent(utf8Match[1].replace(/["]/g, ''));
        }

        const normalMatch = /filename="?([^"]+)"?/i.exec(contentDisposition);
        if (normalMatch?.[1]) {
            return normalMatch[1];
        }

        return null;
    }

    private getQrDownloadFileName(): string {
        const extension = this.qrDownloadFormat.toLowerCase();

        if (this.isQrDownloadGeneratorMode()) {
            const generator = this.generators.find((g) => g.id === this.selectedGeneratorForQrDownload);
            const generatorName = generator ? `${generator.code}-${generator.description || generator.location || generator.id}` : 'generator';

            return `building-box-qr-${this.toSafeFileName(generatorName)}.${extension}`;
        }

        const addressName = [this.qrAddress.city, this.qrAddress.street, this.qrAddress.building].filter(Boolean).join('-');

        return `building-box-qr-${this.toSafeFileName(addressName)}.${extension}`;
    }

    private toSafeFileName(value: string): string {
        return (value || 'download')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-+/g, '-')
            .toLowerCase();
    }
}
