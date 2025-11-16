import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@/core/services/auth.service';
import { SignInRequest } from '@/core/services/api/request';
import { SignInResponse } from '@/core/services/api/response';
import { firstValueFrom } from 'rxjs';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule, Message],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    authService: AuthService = inject(AuthService);
    signInForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.signInForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required]]
        });
    }

    appName: string = environment.appName;
    signingIn: boolean = false;

    async signIn() {
        this.signingIn = true;
        this.signInForm.markAllAsTouched();

        if (!this.signInForm.valid) {
            this.signingIn = false;
            return;
        }

        let signInRequest: SignInRequest = {
            username: this.signInForm.value.username,
            password: this.signInForm.value.password
        };

        try {
            const response: SignInResponse = await firstValueFrom(this.authService.signIn(signInRequest));
            this.authService.setSession(response.user, response.token);
            await this.authService.redirectUserByRole();
            this.signingIn = false;
        } catch (error) {
            console.log(error);
            this.signingIn = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.signInForm.get(controlName);
        return control?.invalid && (control.touched || this.signingIn);
    }
}
