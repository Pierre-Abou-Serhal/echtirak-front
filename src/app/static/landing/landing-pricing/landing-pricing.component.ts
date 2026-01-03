import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-landing-pricing',
    imports: [ButtonDirective, Divider, Ripple, RouterLink, PrimeTemplate, FormsModule, InputText, Dialog, Tooltip, InputNumber, Textarea],
    templateUrl: './landing-pricing.component.html',
    styleUrl: './landing-pricing.component.scss'
})
export class LandingPricingComponent {
    quoteDialogVisible: boolean = false;
    protected readonly alert = alert;
}
