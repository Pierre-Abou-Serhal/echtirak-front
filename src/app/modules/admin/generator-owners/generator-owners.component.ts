import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '@/core/services/admin.service';
import { AdminGeneratorOwnerProfile } from '@/core/models/model';
import { GetGeneratorOwnersResponse } from '@/core/services/api/response';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import * as Papa from 'papaparse';
import { InputIcon } from 'primeng/inputicon';
import { Dialog } from 'primeng/dialog';
import {
    GeneratorOwnerManagementComponent
} from '@/modules/admin/generator-owners/generator-owner-management/generator-owner-management.component';
import { NotificationService } from '@/core/services/notification.service';

@Component({
    selector: 'app-generator-owners.component',
    imports: [ReactiveFormsModule, TableModule, Button, IconField, InputText, InputIcon, Dialog, GeneratorOwnerManagementComponent],
    templateUrl: './generator-owners.component.html',
    styleUrl: './generator-owners.component.scss'
})
export class GeneratorOwnersComponent implements OnInit {
    private readonly adminService: AdminService = inject(AdminService);
    private readonly notificationService = inject(NotificationService);

    generatorOwners: AdminGeneratorOwnerProfile[] = [];
    isGeneratorOwnersLoading: boolean = false;

    rowsPerPageOptions = [10, 20, 50, 100];
    first: number = 0;
    rows: number = 10;
    selectGeneratorOwners: AdminGeneratorOwnerProfile[] = [];

    ngOnInit() {
        this.loadGeneratorOwners();
    }

    loadGeneratorOwners(): void {
        this.isGeneratorOwnersLoading = true;

        this.adminService.getGeneratorOwners().subscribe({
            next: (response: GetGeneratorOwnersResponse) => {
                this.generatorOwners = response.owners;
                this.isGeneratorOwnersLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isGeneratorOwnersLoading = false;
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
        return this.first + this.rows >= this.generatorOwners.length;
    }

    isFirstPage(): boolean {
        return this.first === 0;
    }

    exportToCsv() {
        if (!this.generatorOwners?.length) return;

        let listToExport: AdminGeneratorOwnerProfile[] = this.generatorOwners;

        if (this.selectGeneratorOwners.length > 0) {
            listToExport = this.selectGeneratorOwners;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generator-owners.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // TODO: implement once ready
    reactivateGeneratorOwner(go: AdminGeneratorOwnerProfile) {
        console.log(go);
    }

    // TODO: implement once ready
    deactivateGeneratorOwner(go: AdminGeneratorOwnerProfile) {
        console.log(go);
    }

    // Update/Create GO Modal
    isGoDialogVisible = false;
    selectedGo?: AdminGeneratorOwnerProfile; // undefined => create

    openCreateGo() {
        this.selectedGo = undefined; // create mode
        this.isGoDialogVisible = true;
    }

    editGeneratorOwner(go: AdminGeneratorOwnerProfile) {
        this.selectedGo = go; // edit mode
        this.isGoDialogVisible = true;
    }

    closeGoDialog() {
        this.isGoDialogVisible = false;
    }

    updateGoList(profile?: AdminGeneratorOwnerProfile) {
        if (profile) {
            const idx = this.findIndexById(profile.id);

            if (idx !== -1) {
                this.generatorOwners[idx] = profile;
            } else {
                this.generatorOwners.push(profile);
            }

            this.generatorOwners = [...this.generatorOwners];

            this.notificationService.success('Successful', `Generator Owner ${idx !== -1 ? 'Updated' : 'Created' } Successfully`);
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.generatorOwners.length; i++) {
            if (this.generatorOwners[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
}
