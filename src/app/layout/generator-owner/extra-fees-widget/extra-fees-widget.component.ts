import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { Popover } from 'primeng/popover';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { UserContextService } from '@/core/services/user-context.service';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { ExtraFee } from '@/core/models/model';
import { UpsertExtraFeeRequest } from '@/core/services/api/request';

@Component({
    selector: 'app-extra-fees-widget',
    standalone: true,
    imports: [Popover, Button, InputText, ProgressSpinner, ReactiveFormsModule, AsyncPipe, DatePipe, ConfirmDialogModule, FormsModule],
    templateUrl: './extra-fees-widget.component.html',
    styleUrl: './extra-fees-widget.component.scss',
    providers: [ConfirmationService] // local instance for this widget
})
export class ExtraFeesWidgetComponent {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly confirmationService = inject(ConfirmationService);
    public readonly userContext = inject(UserContextService);

    private fb = inject(FormBuilder);

    // Inline create
    isCreating = false;
    isSavingCreate = false;
    createForm: FormGroup = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });

    // Inline edit
    editingId: number | null = null;
    editDraftName = '';
    isSavingEdit = false;

    // Delete loading state
    isDeletingId: number | null = null;

    onToggle(event: Event, op: Popover) {
        this.userContext.loadExtraFees();
        op.toggle(event);
    }

    startCreate() {
        this.isCreating = true;
        this.createForm.reset({ name: null });
    }

    cancelCreate() {
        this.isCreating = false;
        this.createForm.reset({ name: null });
    }

    async create() {
        this.isSavingCreate = true;
        this.createForm.markAllAsTouched();

        if (!this.createForm.valid) {
            this.isSavingCreate = false;
            return;
        }

        const name = String(this.createForm.get('name')?.value ?? '').trim();

        const req: UpsertExtraFeeRequest = { id: -1, name };

        try {
            const res = await firstValueFrom(this.generatorOwnerService.upsertExtraFee(req));

            this.notificationService.success('Successful', 'Extra fee added');

            // refresh list
            this.userContext.loadExtraFees();

            this.isSavingCreate = false;
            this.isCreating = false;
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to add extra fee');
            this.isSavingCreate = false;
        }
    }

    startEdit(fee: ExtraFee) {
        if (!fee?.id) return;

        this.editingId = fee.id;
        this.editDraftName = (fee.name ?? '').trim();

        // close create if open
        this.isCreating = false;
    }

    cancelEdit() {
        this.editingId = null;
        this.editDraftName = '';
    }

    async saveEdit(fee: ExtraFee) {
        if (!fee?.id) return;

        const newName = (this.editDraftName ?? '').trim();
        if (newName.length < 2) {
            this.notificationService.error('Error', 'Name must be at least 2 characters');
            return;
        }

        this.isSavingEdit = true;

        const req: UpsertExtraFeeRequest = {
            id: fee.id,
            name: newName
        };

        try {
            await firstValueFrom(this.generatorOwnerService.upsertExtraFee(req));

            this.notificationService.success('Successful', 'Extra fee updated');

            // refresh list
            this.userContext.loadExtraFees();

            this.isSavingEdit = false;
            this.cancelEdit();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to update extra fee');
            this.isSavingEdit = false;
        }
    }

    confirmDelete(fee: ExtraFee) {
        if (!fee?.id) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${fee.name ?? ''}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => this.deleteFee(fee.id!)
        });
    }

    private async deleteFee(id: number) {
        this.isDeletingId = id;

        try {
            // NOTE: using your service method name as-is (deleteExtraFeet)
            await firstValueFrom(this.generatorOwnerService.deleteExtraFee(id));

            this.notificationService.success('Successful', 'Extra fee deleted');

            // refresh list
            this.userContext.loadExtraFees();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to delete extra fee');
        } finally {
            this.isDeletingId = null;
        }
    }

    isInvalidCreate(controlName: string) {
        const c = this.createForm.get(controlName);
        return !!(c?.invalid && (c.touched || this.isSavingCreate));
    }

    trackById(_: number, item: ExtraFee) {
        return item.id;
    }
}
