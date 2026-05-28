import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { NotificationService } from '@/core/services/notification.service';
import { UserContextService } from '@/core/services/user-context.service';

import { ExtraFee } from '@/core/models/model';
import { UpsertExtraFeeRequest } from '@/core/services/api/request';

@Component({
    selector: 'app-extra-fees-manager',
    standalone: true,
    imports: [AsyncPipe, DatePipe, FormsModule, ReactiveFormsModule, Button, InputText, ProgressSpinner, ConfirmDialogModule],
    templateUrl: './extra-fees-manager.component.html',
    styleUrl: './extra-fees-manager.component.scss',
    providers: [ConfirmationService]
})
export class ExtraFeesManagerComponent implements OnInit {
    private readonly generatorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly fb = inject(FormBuilder);

    public readonly userContext = inject(UserContextService);

    /**
     * Keep this true when using the manager inside dialogs/pages.
     * The top-nav widget can also keep it true; duplicate refreshes are not harmful.
     */
    @Input() loadOnInit = true;

    /**
     * Useful later in SubscribersComponent:
     * - feeCreated can auto-select the new fee.
     * - feeDeleted can remove the deleted fee from selectedExtraFeeIds.
     * - feesChanged is a generic refresh signal.
     */
    @Output() feeCreated = new EventEmitter<ExtraFee>();
    @Output() feeDeleted = new EventEmitter<number>();
    @Output() feesChanged = new EventEmitter<void>();

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

    ngOnInit(): void {
        if (this.loadOnInit) {
            this.userContext.loadExtraFees();
        }
    }

    startCreate(): void {
        this.isCreating = true;
        this.createForm.reset({ name: null });

        // Close edit if open
        this.cancelEdit();
    }

    cancelCreate(): void {
        this.isCreating = false;
        this.createForm.reset({ name: null });
    }

    async create(): Promise<void> {
        this.isSavingCreate = true;
        this.createForm.markAllAsTouched();

        if (!this.createForm.valid) {
            this.isSavingCreate = false;
            return;
        }

        const name = String(this.createForm.get('name')?.value ?? '').trim();

        const req: UpsertExtraFeeRequest = {
            id: -1,
            name
        };

        try {
            const response = await firstValueFrom(this.generatorOwnerService.upsertExtraFee(req));

            this.notificationService.success('Successful', 'Extra fee added');

            this.userContext.loadExtraFees();

            const createdFee = this.extractExtraFeeFromResponse(response, name);

            if (createdFee?.id) {
                this.feeCreated.emit(createdFee);
            }

            this.feesChanged.emit();

            this.isCreating = false;
            this.createForm.reset({ name: null });
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to add extra fee');
        } finally {
            this.isSavingCreate = false;
        }
    }

    startEdit(fee: ExtraFee): void {
        if (!fee?.id) return;

        this.editingId = fee.id;
        this.editDraftName = (fee.name ?? '').trim();

        // Close create if open
        this.isCreating = false;
        this.createForm.reset({ name: null });
    }

    cancelEdit(): void {
        this.editingId = null;
        this.editDraftName = '';
    }

    async saveEdit(fee: ExtraFee): Promise<void> {
        if (!fee?.id) return;

        const newName = (this.editDraftName ?? '').trim();

        if (newName.length < 2) {
            this.notificationService.error('Error', 'Name must be at least 2 characters');
            return;
        }

        if (newName.length > 100) {
            this.notificationService.error('Error', 'Name must not exceed 100 characters');
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

            this.userContext.loadExtraFees();
            this.feesChanged.emit();

            this.cancelEdit();
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to update extra fee');
        } finally {
            this.isSavingEdit = false;
        }
    }

    confirmDelete(fee: ExtraFee): void {
        if (!fee?.id) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${fee.name ?? ''}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                void this.deleteFee(fee.id!);
            }
        });
    }

    private async deleteFee(id: number): Promise<void> {
        this.isDeletingId = id;

        try {
            await firstValueFrom(this.generatorOwnerService.deleteExtraFee(id));

            this.notificationService.success('Successful', 'Extra fee deleted');

            this.userContext.loadExtraFees();

            this.feeDeleted.emit(id);
            this.feesChanged.emit();

            if (this.editingId === id) {
                this.cancelEdit();
            }
        } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Failed to delete extra fee');
        } finally {
            this.isDeletingId = null;
        }
    }

    isInvalidCreate(controlName: string): boolean {
        const control = this.createForm.get(controlName);
        return !!(control?.invalid && (control.touched || this.isSavingCreate));
    }

    trackById(index: number, item: ExtraFee): number | string {
        return item.id ?? index;
    }

    private extractExtraFeeFromResponse(response: unknown, fallbackName: string): ExtraFee | null {
        const raw = response as any;

        /**
         * Supports multiple possible API response shapes:
         * 1. { extraFee: { id, name } }
         * 2. { item: { id, name } }
         * 3. { fee: { id, name } }
         * 4. { id, name }
         */
        const possibleFee = raw?.extraFee ?? raw?.item ?? raw?.fee ?? raw;

        if (!possibleFee || typeof possibleFee !== 'object') {
            return null;
        }

        if (possibleFee.id == null) {
            return null;
        }

        return {
            ...possibleFee,
            name: possibleFee.name ?? fallbackName
        } as ExtraFee;
    }
}
