import { Component, inject, Input, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bill, KvaReading, Lookup } from '@/core/models/model';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { GenerateBillsFromKVAReadingsResponse, GetKVAReadingsPerGeneratorResponse, GetLookupResponse, UpdateKVAReadingResponse } from '@/core/services/api/response';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { KvaReadingStatus, LookupDomain } from '@/core/enums/enum';
import { Tag } from 'primeng/tag';
import { GenerateBillsFromKVAReadingsRequest, UpdateKVAReadingRequest } from '@/core/services/api/request';
import { NotificationService } from '@/core/services/notification.service';
import { DecimalPipe, NgClass } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { SelectOptionStrValue } from '@/core/dtos/dto';
import { OverlayListenerOptions, OverlayOptions } from 'primeng/api';

@Component({
    selector: 'app-metered-bill-generation',
    imports: [FormsModule, Button, IconField, InputIcon, InputText, TableModule, Tag, NgClass, DecimalPipe, InputNumber, Select],
    templateUrl: './metered-bill-generation.component.html',
    styleUrl: './metered-bill-generation.component.scss'
})
export class MeteredBillGenerationComponent implements OnInit {
    generatorId: number = 0;

    // Input setter. used to change value from parent
    @Input({ alias: 'generatorId', required: true }) set _generatorId(value: number) {
        this.generatorId = value;
        this.loadKvaReadings();
    }

    // Output generated bills from kva readings
    generatedBills = output<Bill[]>();

    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    notificationService: NotificationService = inject(NotificationService);

    kvaReadings: KvaReading[] = [];
    selectedKvaReadings: KvaReading[] = [];
    isKvaReadingLoading = false;
    rowsPerPageOptions = [10, 20, 50, 100];
    first = 0;
    rows = 10;

    // Edit inside table
    clonedKvaReading: { [id: string]: KvaReading } = {};

    // Update KvaReadings vars
    isKvaReadingSaving: boolean = false;
    @ViewChild('dt') table!: Table;

    kvaReadingStatuses: SelectOptionStrValue[] = [];

    isBillsGenerating: boolean = false;

    ngOnInit() {
        this.generatorOwnerService.getLookup({ domain: LookupDomain.KVA_READING_STATUS }).subscribe({
            next: (response: GetLookupResponse) => {
                this.kvaReadingStatuses = response.items.map((lookup: Lookup) => ({
                    value: lookup.code,
                    label: lookup.code
                }));
            },
            error: (err) => {
                console.log(err);
                this.kvaReadingStatuses = [];
            }
        });
    }

    loadKvaReadings() {
        this.isKvaReadingLoading = true;
        this.kvaReadings = [];

        this.generatorOwnerService
            .getKVAReadingsPerGenerator({
                generatorId: this.generatorId
            })
            .subscribe({
                next: (response: GetKVAReadingsPerGeneratorResponse) => {
                    this.kvaReadings = response.readings;
                    this.isKvaReadingLoading = false;

                    console.log(this.generatorId);
                    console.log(this.kvaReadings);
                },
                error: (err) => {
                    console.log(err);
                    this.kvaReadings = [];
                    this.isKvaReadingLoading = false;
                }
            });
    }

    // Data table functions
    pageChange(event: any) {
        this.first = event.first ?? this.first;
        this.rows = event.rows ?? this.rows;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
    }

    next() {
        if (this.isLastPage()) return;
        this.first = this.first + this.rows;
    }

    prev() {
        this.first = Math.max(0, this.first - this.rows);
    }

    reset() {
        this.first = 0;
    }

    isLastPage(): boolean {
        return this.first + this.rows >= this.kvaReadings.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.kvaReadings?.length) return;

        let listToExport: KvaReading[] = this.kvaReadings;

        if (this.selectedKvaReadings.length > 0) {
            listToExport = this.selectedKvaReadings;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kva-readings.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    rowClass(kvaReading: KvaReading) {
        return { '!bg-yellow-100 dark:!bg-yellow-950': kvaReading.hasDuplicatePendingReadings };
    }

    getBillSeverity(statusCode: string) {
        switch (statusCode) {
            case KvaReadingStatus.PENDING:
                return 'info';

            case KvaReadingStatus.BILLED:
                return 'success';

            case KvaReadingStatus.CANCELLED:
                return 'danger';

            default:
                return null;
        }
    }

    // Edit inside table functions
    onRowEditInit(kvaReading: KvaReading) {
        // Keep a clone so we can revert on cancel or error
        this.clonedKvaReading[kvaReading.id] = { ...kvaReading };
    }

    onRowEditSave(kvaReading: KvaReading) {
        this.updateKvaReading(kvaReading);
    }

    onRowEditCancel(kvaReading: KvaReading, index: number) {
        // user canceled → revert from clone
        const original = this.clonedKvaReading[kvaReading.id];
        if (original) {
            this.kvaReadings[index] = original;
            delete this.clonedKvaReading[kvaReading.id];
        }
        this.table.cancelRowEdit(kvaReading);
    }

    updateKvaReading(kvaReading: KvaReading) {
        console.log('kva reading to update', kvaReading);

        this.isKvaReadingSaving = true;

        let request: UpdateKVAReadingRequest = {
            id: kvaReading.id,
            kvaReading: kvaReading.kvaReading,
            status: kvaReading.status
        };

        this.generatorOwnerService.updateKVAReading(request).subscribe({
            next: (response: UpdateKVAReadingResponse) => {
                this.notificationService.success('Successful', 'KWH reading updated successfully');

                if (response.reading.status === KvaReadingStatus.PENDING) {
                    this.kvaReadings[this.findIndexById(response.reading.id)] = response.reading;
                } else {
                    this.kvaReadings.splice(this.findIndexById(response.reading.id), 1);
                }

                this.isKvaReadingSaving = false;
                this.table.cancelRowEdit(kvaReading);
            },
            error: (err) => {
                console.log(err);
                this.isKvaReadingSaving = false;
                this.table.cancelRowEdit(kvaReading);
            }
        });
    }

    generateBills() {
        if (this.selectedKvaReadings.length > 0) {
            this.isBillsGenerating = true;

            let request: GenerateBillsFromKVAReadingsRequest = {
                kvaReadingIds: this.selectedKvaReadings.map((i) => i.id)
            };

            console.log(request);

            this.generatorOwnerService.generateBillsFromKVAReadings(request).subscribe({
                next: (response: GenerateBillsFromKVAReadingsResponse) => {
                    this.generatedBills.emit( response.bills.map((bill, index) => ({
                        ...bill,
                        id: index + 1
                    })));

                    console.log(this.generatedBills);

                    this.isBillsGenerating = false;
                },
                error: (err) => {
                    console.log(err);
                    this.generatedBills.emit([]);
                    this.isBillsGenerating = false;
                }
            });
        } else {
            this.notificationService.warn('Warning', 'Please select KWH readings to generate their bills');
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.kvaReadings.length; i++) {
            if (this.kvaReadings[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getOverlayOptions(): OverlayOptions {
        return {
            listener: (event: Event, options?: OverlayListenerOptions) => {
                if (options?.type === 'scroll') {
                    return false;
                }
                return options?.valid;
            }
        };
    }

    protected readonly KvaReadingStatus = KvaReadingStatus;
}
