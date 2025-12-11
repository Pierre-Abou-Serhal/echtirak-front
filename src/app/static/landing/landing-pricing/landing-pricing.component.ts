import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-landing-pricing',
    imports: [ButtonDirective, Divider, Ripple],
    templateUrl: './landing-pricing.component.html',
    styleUrl: './landing-pricing.component.scss'
})
export class LandingPricingComponent {}
