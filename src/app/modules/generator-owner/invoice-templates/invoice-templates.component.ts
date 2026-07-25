import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { InvoiceTemplateCode } from '@/core/enums/enum';
import { GetInvoiceTemplateSampleRequest, UpdateInvoiceTemplateRequest } from '@/core/services/api/request';
import { GetInvoiceTemplatesResponse, UpdateInvoiceTemplateResponse } from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { InvoiceTemplate, InvoiceTemplatePreference } from '@/core/models/model';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface LanguageOption {
    label: string;
    value: string;
    disabled: boolean;
}

@Component({
    selector: 'app-invoice-templates',
    standalone: true,
    imports: [FormsModule, Button, Dialog, SelectButton, Skeleton, Tag, ToggleSwitch],
    templateUrl: './invoice-templates.component.html'
})
export class InvoiceTemplatesComponent implements OnInit, OnDestroy {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);

    private readonly notificationService = inject(NotificationService);

    private readonly sanitizer = inject(DomSanitizer);

    private readonly destroyRef = inject(DestroyRef);

    preference: InvoiceTemplatePreference | null = null;
    templates: InvoiceTemplate[] = [];

    selectedTemplateCode = '';
    languageCode = 'en';
    includeBillCollectorExtension = true;

    loading = false;
    loadFailed = false;
    saving = false;
    previewing = false;

    previewDialogVisible = false;
    previewUrl: SafeResourceUrl | null = null;
    previewFileName = 'invoice-template-sample.pdf';

    readonly skeletonTemplates = [1, 2, 3, 4, 5, 6];

    failedImageTemplateCodes = new Set<string>();

    private previewObjectUrl: string | null = null;

    ngOnInit(): void {
        this.loadTemplates();
    }

    ngOnDestroy(): void {
        this.revokePreviewUrl();
    }

    get selectedTemplate(): InvoiceTemplate | null {
        return this.templates.find((template) => template.code === this.selectedTemplateCode) ?? null;
    }

    get savedTemplate(): InvoiceTemplate | null {
        if (!this.preference) {
            return null;
        }

        return this.templates.find((template) => template.code === this.preference?.billTemplateCode) ?? null;
    }

    get languageOptions(): LanguageOption[] {
        return [
            {
                label: 'English',
                value: 'en',
                disabled: false
            },
            {
                label: 'العربية',
                value: 'ar',
                disabled: this.selectedTemplate?.supportsArabic !== true
            }
        ];
    }

    get effectiveIncludeExtension(): boolean {
        return this.selectedTemplate?.supportsExtension === true && this.includeBillCollectorExtension;
    }

    get hasUnsavedChanges(): boolean {
        if (!this.preference || !this.selectedTemplate) {
            return false;
        }

        return this.selectedTemplateCode !== this.preference.billTemplateCode || this.languageCode !== this.preference.languageCode || this.effectiveIncludeExtension !== this.preference.includeBillCollectorExtension;
    }

    get canSave(): boolean {
        return !this.loading && !this.saving && !this.previewing && this.selectedTemplate?.isActive === true && this.hasUnsavedChanges;
    }

    get extensionTitle(): string {
        return this.isOfficeTemplate(this.selectedTemplateCode) ? 'Include tear-off extension' : 'Include QR collection stub';
    }

    get extensionDescription(): string {
        return this.isOfficeTemplate(this.selectedTemplateCode) ? 'Adds a detachable section that can be kept after bill collection.' : 'Adds a compact QR stub designed for portable thermal printing.';
    }

    loadTemplates(): void {
        if (this.loading) {
            return;
        }

        this.loading = true;
        this.loadFailed = false;

        this.generatorOwnerService
            .getInvoiceTemplates()
            .pipe(
                finalize(() => {
                    this.loading = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: GetInvoiceTemplatesResponse) => {
                    this.applyScreen(response.screen);
                },
                error: (error) => {
                    console.error(error);

                    this.preference = null;
                    this.templates = [];
                    this.loadFailed = true;

                    this.notificationService.error('Loading Failed', 'Failed to load invoice templates.');
                }
            });
    }

    selectTemplate(template: InvoiceTemplate): void {
        if (!template.isActive || this.saving || this.previewing) {
            return;
        }

        this.selectedTemplateCode = template.code;

        if (!template.supportsArabic && this.languageCode === 'ar') {
            this.languageCode = 'en';
        }

        if (!template.supportsExtension) {
            this.includeBillCollectorExtension = false;
        }
    }

    onLanguageChanged(): void {
        if (this.languageCode === 'ar' && this.selectedTemplate?.supportsArabic !== true) {
            this.languageCode = 'en';

            this.notificationService.warn('Arabic Not Supported', 'The selected template does not support Arabic.');
        }
    }

    resetChanges(): void {
        if (!this.preference || this.saving || this.previewing) {
            return;
        }

        this.selectedTemplateCode = this.preference.billTemplateCode;

        this.languageCode = this.preference.languageCode || 'en';

        this.includeBillCollectorExtension = this.preference.includeBillCollectorExtension;
    }

    savePreference(): void {
        if (!this.canSave || !this.selectedTemplate) {
            return;
        }

        const request = this.buildRequest();

        this.saving = true;

        this.generatorOwnerService
            .updateInvoiceTemplate(request)
            .pipe(
                finalize(() => {
                    this.saving = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: UpdateInvoiceTemplateResponse) => {
                    this.applyScreen(response.screen);

                    this.notificationService.success('Template Updated', 'Your invoice template preference was saved.');
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.error('Save Failed', 'Failed to update the invoice template.');
                }
            });
    }

    previewSample(): void {
        if (!this.selectedTemplate || !this.selectedTemplate.isActive || this.previewing || this.saving) {
            return;
        }

        const request: GetInvoiceTemplateSampleRequest = this.buildRequest();

        this.previewing = true;

        this.generatorOwnerService
            .getInvoiceTemplateSample(request)
            .pipe(
                finalize(() => {
                    this.previewing = false;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response) => {
                    const blob = response.body;

                    if (!blob || blob.size === 0) {
                        this.notificationService.warn('Empty Preview', 'The sample PDF is empty.');
                        return;
                    }

                    const pdfBlob =
                        blob.type === 'application/pdf'
                            ? blob
                            : new Blob([blob], {
                                  type: 'application/pdf'
                              });

                    this.revokePreviewUrl();

                    this.previewObjectUrl = URL.createObjectURL(pdfBlob);

                    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewObjectUrl);

                    this.previewFileName = `${this.selectedTemplateCode}` + `-${this.languageCode}-sample.pdf`;

                    this.previewDialogVisible = true;
                },
                error: (error) => {
                    console.error(error);

                    this.notificationService.error('Preview Failed', 'Failed to generate the sample PDF.');
                }
            });
    }

    downloadPreview(): void {
        if (!this.previewObjectUrl) {
            return;
        }

        const anchor = document.createElement('a');

        anchor.href = this.previewObjectUrl;
        anchor.download = this.previewFileName;
        anchor.click();
        anchor.remove();
    }

    closePreview(): void {
        this.previewDialogVisible = false;
        this.revokePreviewUrl();
    }

    onPreviewImageError(templateCode: string): void {
        this.failedImageTemplateCodes.add(templateCode);
    }

    hasPreviewImage(template: InvoiceTemplate): boolean {
        return !!template.previewImageUrl?.trim() && !this.failedImageTemplateCodes.has(template.code);
    }

    isDraftSelected(template: InvoiceTemplate): boolean {
        return template.code === this.selectedTemplateCode;
    }

    isSavedSelection(template: InvoiceTemplate): boolean {
        return template.code === this.preference?.billTemplateCode;
    }

    isMiniTemplate(templateCode: string): boolean {
        return templateCode.endsWith('_MINI');
    }

    getTemplateFormat(template: InvoiceTemplate): string {
        if (this.isOfficeTemplate(template.code)) {
            return 'Office A4';
        }

        if (template.code === InvoiceTemplateCode.PORTABLE_80MM || template.code === InvoiceTemplateCode.PORTABLE_80_MINI) {
            return 'Portable 80 mm';
        }

        return 'Portable 58 mm';
    }

    getPageDimensions(template: InvoiceTemplate): string {
        const width = this.formatMillimeters(template.pageWidthMm);

        const height = template.pageHeightMm > 0 ? this.formatMillimeters(template.pageHeightMm) : 'Variable';

        return `${width} × ${height} mm`;
    }

    getTemplateFeatureText(template: InvoiceTemplate): string {
        const size = this.getTemplateFormat(template);

        const content = this.isMiniTemplate(template.code) ? 'Mini content · USD only' : 'Full content · USD and LBP';

        return `${size} · ${content}`;
    }

    getExtensionType(template: InvoiceTemplate): string {
        if (!template.supportsExtension) {
            return 'No extension';
        }

        return this.isOfficeTemplate(template.code) ? 'Tear-off extension' : 'QR collection stub';
    }

    getAvailabilitySeverity(template: InvoiceTemplate): TagSeverity {
        return template.isActive ? 'success' : 'secondary';
    }

    private buildRequest(): UpdateInvoiceTemplateRequest {
        return {
            billTemplateCode: this.selectedTemplateCode,
            languageCode: this.languageCode,
            includeBillCollectorExtension: this.effectiveIncludeExtension
        };
    }

    private applyScreen(screen: { preference: InvoiceTemplatePreference; templates: InvoiceTemplate[] }): void {
        this.preference = screen.preference;

        this.templates = [...(screen.templates ?? [])].sort((first, second) => first.sortOrder - second.sortOrder);

        this.failedImageTemplateCodes.clear();

        this.selectedTemplateCode = screen.preference.billTemplateCode;

        this.languageCode = screen.preference.languageCode || 'en';

        this.includeBillCollectorExtension = screen.preference.includeBillCollectorExtension;

        const selected = this.selectedTemplate;

        if (!selected && this.templates.length > 0) {
            const fallback = this.templates.find((template) => template.isActive && template.isSelected) ?? this.templates.find((template) => template.isActive) ?? this.templates[0];

            this.selectedTemplateCode = fallback.code;
        }

        if (this.languageCode === 'ar' && this.selectedTemplate?.supportsArabic !== true) {
            this.languageCode = 'en';
        }

        if (this.selectedTemplate?.supportsExtension !== true) {
            this.includeBillCollectorExtension = false;
        }
    }

    private isOfficeTemplate(templateCode: string): boolean {
        return templateCode === InvoiceTemplateCode.STANDARD_A4 || templateCode === InvoiceTemplateCode.STANDARD_A4_MINI;
    }

    private formatMillimeters(value: number): string {
        return Number.isInteger(value) ? String(value) : value.toFixed(1);
    }

    private revokePreviewUrl(): void {
        if (this.previewObjectUrl) {
            URL.revokeObjectURL(this.previewObjectUrl);
        }

        this.previewObjectUrl = null;
        this.previewUrl = null;
    }
}
