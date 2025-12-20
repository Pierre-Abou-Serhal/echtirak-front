import { Component, DestroyRef, ViewChild, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdminService } from '@/core/services/admin.service';
import { NotificationService } from '@/core/services/notification.service';

// DTOs / Models (adjust paths)
import { GetSmsTemplatesQueryParams, UpsertSmsTemplateRequest } from '@/core/services/api/request';

import { GetGeneratorOwnersResponse, GetSmsTemplatesResponse, UpsertSmsTemplateResponse } from '@/core/services/api/response';

import { SmsTemplate } from '@/core/models/model';

// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tag } from 'primeng/tag';
import { SelectOptionNumValue, SelectOptionStrValue } from '@/core/dtos/dto';
import * as Papa from 'papaparse';

@Component({
    selector: 'app-sms-templates.component',
    standalone: true,
    imports: [DatePipe, ReactiveFormsModule, TableModule, Button, Dialog, Message, InputText, Textarea, Select, ToggleSwitch, Tag],
    templateUrl: './sms-templates.component.html',
    styleUrl: './sms-templates.component.scss'
})
export class SmsTemplatesComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly notificationService = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);

    @ViewChild('dt') table!: Table;

    // Data
    templates: SmsTemplate[] = [];
    selectedTemplates: SmsTemplate[] = [];
    loading = false;

    // Filters (API requires generatorOwnerUserId)
    filterForm = this.fb.group({
        generatorOwnerUserId: [null as number | null, Validators.required],
        isActive: [null as boolean | null], // optional client filter
        language: [null as string | null], // optional client filter
        keyword: [''] // optional client filter (name/body search)
    });

    // Dialog state
    isDialogOpen = false;
    isSaving = false;
    selectedTemplateId = -1;

    // Delete state
    deletingId: number | null = null;

    // Dialog form
    templateForm: FormGroup = this.fb.group({
        name: [null, [Validators.required, Validators.maxLength(120)]],
        nameAr: [null],
        body: [null, [Validators.required, Validators.maxLength(4000)]],
        bodyAr: [null],
        language: ['EN', Validators.required],
        isActive: [true, Validators.required]
    });

    readonly languageOptions: SelectOptionStrValue[] = [
        { label: 'English', value: 'EN' },
        { label: 'Arabic', value: 'AR' }
    ];

    readonly activeOptions = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
    ];

    generatorOwners: SelectOptionNumValue[] = [];
    isGeneratorOwnersLoading = true;

    ngOnInit() {
        this.adminService.getGeneratorOwners().subscribe({
            next: (res: GetGeneratorOwnersResponse) => {
                this.generatorOwners = res.owners.map((go) => {
                    return {
                        label: `${go.username} - ${go.firstName} ${go.lastName}`.trim(),
                        value: go.id
                    };
                });
                this.isGeneratorOwnersLoading = false;
            },
            error: (err) => {
                console.log(err);
                this.isGeneratorOwnersLoading = false;
            }
        });
    }

    // ---------- Load ----------
    async loadTemplates() {
        this.filterForm.markAllAsTouched();
        if (!this.filterForm.valid) return;

        const generatorOwnerUserId = this.filterForm.get('generatorOwnerUserId')?.value as number;

        this.loading = true;
        try {
            const qp: GetSmsTemplatesQueryParams = { generatorOwnerUserId };

            const res: GetSmsTemplatesResponse = await firstValueFrom(this.adminService.getSmsTemplates(qp).pipe(finalize(() => (this.loading = false))));

            this.templates = res.templates ?? [];
            this.applyClientFilters(); // apply keyword/language/isActive on loaded data
        } catch (err) {
            console.log(err);
            this.loading = false;
            this.templates = [];
            this.notificationService.error('Error', 'Failed to load SMS templates.');
        }
    }

    // Optional: client-side filtering (nice UX)
    private applyClientFilters() {
        // NOTE: we keep original by reloading from server when needed
        // If you want, we can store "allTemplates" separately.
        const keyword = (this.filterForm.get('keyword')?.value ?? '').trim().toLowerCase();
        const isActive = this.filterForm.get('isActive')?.value as boolean | null;
        const language = this.filterForm.get('language')?.value as string | null;

        let list = [...this.templates];

        if (isActive !== null && isActive !== undefined) {
            list = list.filter((x) => x.isActive === isActive);
        }
        if (language) {
            list = list.filter((x) => (x.language ?? '').toUpperCase() === language.toUpperCase());
        }
        if (keyword) {
            list = list.filter((x) => (x.name ?? '').toLowerCase().includes(keyword) || (x.nameAr ?? '').toLowerCase().includes(keyword) || (x.body ?? '').toLowerCase().includes(keyword) || (x.bodyAr ?? '').toLowerCase().includes(keyword));
        }

        this.templates = list;
    }

    resetFilters() {
        const goId = this.filterForm.get('generatorOwnerUserId')?.value ?? null;
        this.filterForm.reset({
            generatorOwnerUserId: goId,
            isActive: null,
            language: null,
            keyword: ''
        });

        // Reload fresh from server to restore full list
        if (goId) this.loadTemplates();
    }

    // ---------- Dialog ----------
    openNew() {
        this.selectedTemplateId = -1;

        this.templateForm.reset({
            name: null,
            nameAr: null,
            body: null,
            bodyAr: null,
            language: 'EN',
            isActive: true
        });

        this.isDialogOpen = true;
    }

    editTemplate(t: SmsTemplate) {
        this.selectedTemplateId = t.id;

        this.templateForm.reset({
            name: t.name,
            nameAr: t.nameAr ?? null,
            body: t.body,
            bodyAr: t.bodyAr ?? null,
            language: t.language ?? 'EN',
            isActive: t.isActive ?? true
        });

        this.isDialogOpen = true;
    }

    hideDialog() {
        this.isDialogOpen = false;
    }

    isInvalid(controlName: string) {
        const c = this.templateForm.get(controlName);
        return c?.invalid && (c.touched || this.isSaving);
    }

    private findIndexById(id: number): number {
        return this.templates.findIndex((x) => x.id === id);
    }

    async saveTemplate() {
        this.isSaving = true;
        this.templateForm.markAllAsTouched();

        if (!this.templateForm.valid) {
            this.isSaving = false;
            return;
        }

        const generatorOwnerUserId = this.filterForm.get('generatorOwnerUserId')?.value;
        if (!generatorOwnerUserId) {
            this.notificationService.error('Error', 'GeneratorOwnerUserId is required.');
            this.isSaving = false;
            return;
        }

        const req: UpsertSmsTemplateRequest = {
            id: this.selectedTemplateId,
            generatorOwnerUserId: generatorOwnerUserId as number,
            name: this.templateForm.get('name')?.value,
            nameAr: this.templateForm.get('nameAr')?.value,
            body: this.templateForm.get('body')?.value,
            bodyAr: this.templateForm.get('bodyAr')?.value,
            language: this.templateForm.get('language')?.value,
            isActive: this.templateForm.get('isActive')?.value
        };

        try {
            const res: UpsertSmsTemplateResponse = await firstValueFrom(this.adminService.upsertSmsTemplate(req));

            const saved = res.template;

            if (this.selectedTemplateId === -1) {
                this.templates = [...this.templates, saved];
                this.notificationService.success('Successful', 'SMS Template Added');
            } else {
                const idx = this.findIndexById(saved.id);
                if (idx !== -1) this.templates[idx] = saved;
                this.templates = [...this.templates];
                this.notificationService.success('Successful', 'SMS Template Updated');
            }

            this.isSaving = false;
            this.isDialogOpen = false;
        } catch (err) {
            console.log(err);
            this.isSaving = false;
            this.notificationService.error('Error', 'Failed to save template.');
        }
    }

    deleteTemplate(t: SmsTemplate) {
        this.deletingId = t.id;

        this.adminService
            .deleteSmsTemplate(t.id)
            .pipe(
                finalize(() => (this.deletingId = null)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.templates = this.templates.filter((x) => x.id !== t.id);
                    this.notificationService.success('Successful', 'Template deleted.');
                },
                error: (err) => {
                    console.log(err);
                    this.notificationService.error('Error', 'Failed to delete template.');
                }
            });
    }

    // ---------- UI helpers ----------
    activeSeverity(isActive: boolean) {
        return isActive ? 'success' : 'secondary';
    }

    languageSeverity(lang: string) {
        const v = (lang ?? '').toUpperCase();
        if (v === 'AR') return 'warn';
        if (v === 'EN') return 'info';
        return 'secondary';
    }

    // optional overlay option like your announcements (if you need it)
    getOverlayOptions() {
        return {
            listener: (event: Event, options?: any) => {
                if (options?.type === 'scroll') return false;
                return options?.valid;
            }
        };
    }

    exportToCsv() {
        if (!this.templates?.length) return;

        let listToExport: SmsTemplate[] = this.templates;

        if (this.selectedTemplates.length > 0) {
            listToExport = this.selectedTemplates;
        }

        const csv = Papa.unparse(listToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sms-templates.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}
