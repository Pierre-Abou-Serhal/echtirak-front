import { Component, inject, OnInit } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    GetGeneratorOwnerProfileResponse
} from '@/core/services/api/response';
import { GeneratorOwnerService } from '@/core/services/generator-owner.service';
import { UpdateGeneratorOwnerProfileRequest } from '@/core/services/api/request';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Avatar } from 'primeng/avatar';
import { NotificationService } from '@/core/services/notification.service';

@Component({
    selector: 'app-profile.component',
    imports: [InputText, Message, ReactiveFormsModule, Button, Skeleton, Avatar],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    standalone: true
})
export class ProfileComponent implements OnInit {
    generatorOwnerService: GeneratorOwnerService = inject(GeneratorOwnerService);
    private readonly notificationService = inject(NotificationService);

    profileForm: FormGroup;
    loading: boolean = true;
    saving: boolean = false;

    constructor(private fb: FormBuilder) {
        this.profileForm = this.fb.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            businessName: [null, [Validators.required]],
            phoneNumber: [null, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.generatorOwnerService.getProfile().subscribe({
            next: (response: GetGeneratorOwnerProfileResponse) => {
                this.profileForm.get('firstName')?.setValue(response.profile.firstName);
                this.profileForm.get('lastName')?.setValue(response.profile.lastName);
                this.profileForm.get('businessName')?.setValue(response.profile.businessName);
                this.profileForm.get('phoneNumber')?.setValue(response.profile.phoneNumber);

                this.loading = false;
            },
            error: (err) => {
                console.log(err);

                this.loading = false;
            }
        });
    }

    async onSave() {
        this.saving = true;
        this.profileForm.markAllAsTouched();

        if (!this.profileForm.valid) {
            this.saving = false;
            return;
        }

        let updateProfileRequest: UpdateGeneratorOwnerProfileRequest = {
            firstName: this.profileForm.get('firstName')?.value,
            lastName: this.profileForm.get('lastName')?.value,
            businessName: this.profileForm.get('businessName')?.value,
            phoneNumber: this.profileForm.get('phoneNumber')?.value
        };

        try {
            await firstValueFrom(this.generatorOwnerService.updateProfile(updateProfileRequest));

            this.notificationService.success(
                'Successful',
                'Profile updated successfully',);

            this.saving = false;
        } catch (error) {
            console.log(error);
            this.saving = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.profileForm.get(controlName);
        return control?.invalid && (control.touched || this.saving);
    }
}
