import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Table, TableModule } from 'primeng/table';
import { AutoComplete } from 'primeng/autocomplete';
import { InputText } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { SubscriberAddress } from '@/core/dtos/dto';
import { formatSubscriberAddress } from '@/core/utils/utils';

type FieldName = 'City' | 'Street' | 'Building';
type AddressHintVm = SubscriberAddress & { label: string };

@Component({
    selector: 'app-subscriber-addresses',
    standalone: true,
    imports: [FormsModule, TableModule, AutoComplete, InputText, Button, SelectButton, IconField, InputIcon, ButtonDirective],
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

    // Context suggestions
    contextCitySuggestions: string[] = [];
    contextStreetSuggestions: string[] = [];
    oldValueSuggestions: string[] = [];

    contextCityLoading = false;
    contextStreetLoading = false;
    oldValueLoading = false;

    submitting = false;

    ngOnInit(): void {
        this.loadAllHints();
    }

    // ===== Load all hints (table data) =====
    loadAllHints() {
        this.loadingAddresses = true;

        // query omitted => backend returns all hints
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

    // ===== Table filter =====
    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value ?? '';
        table.filterGlobal(value, 'contains');
    }

    clear(table: Table, searchInput: HTMLInputElement) {
        table.clear();

        // clear the text in the input
        searchInput.value = '';

        table.filterGlobal('', 'contains');
    }

    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    // ===== Row click => fill bulk context + old value =====
    pickAddress(a: AddressHintVm) {
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

        // Building
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

    resetBulk() {
        this.bulk = { fieldName: this.bulk.fieldName, city: '', street: '', oldValue: '', newValue: '' };
        this.contextCitySuggestions = [];
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];
        this.picked = undefined;

        this.selectedRow = null;
        this.picked = undefined;
    }

    onFieldChange() {
        // reset everything except the chosen field
        const keepField = this.bulk.fieldName;
        this.bulk = { fieldName: keepField, city: '', street: '', oldValue: '', newValue: '' };

        this.contextCitySuggestions = [];
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];

        // if a row is already picked, re-apply it for the new field
        if (this.picked) {
            this.pickAddress(this.picked);
        }
    }

    // ===== Context City (Street/Building) =====
    onContextCityComplete(event: any) {
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

    onContextCityPicked() {
        // city change affects street + old values
        this.bulk.street = '';
        this.bulk.oldValue = '';
        this.contextStreetSuggestions = [];
        this.oldValueSuggestions = [];
    }

    // ===== Context Street (Building only) =====
    onContextStreetComplete(event: any) {
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

    onContextStreetPicked() {
        this.bulk.oldValue = '';
        this.oldValueSuggestions = [];
    }

    // ===== Old value (depends on selected field) =====
    onOldValueComplete(event: any) {
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

        // Building
        const city = this.bulk.city.trim();
        const street = this.bulk.street.trim();
        if (!city || !street) {
            fail();
            return;
        }

        this.generatorOwnerService.getBuildings({ country: this.COUNTRY, city, street }).subscribe({
            next: (res) => done(res.values ?? []),
            error: fail
        });
    }

    // ===== Submit bulk update =====
    submitBulkUpdate() {
        if (!this.bulkIsValid()) return;

        this.submitting = true;

        // You need this method in your service:
        // bulkUpdateAddresses({ fieldName, oldValue, newValue })
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
                    this.loadAllHints(); // refresh table
                    this.resetBulk();
                },
                error: () => this.notificationService.error('Error', 'Bulk update failed')
            });
    }

    onRowSelect(event: any) {
        const a = event.data as AddressHintVm;
        this.pickAddress(a);
    }
}
