import { Component } from '@angular/core';
import { Chip } from 'primeng/chip';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-landing-features',
    imports: [Chip, ButtonDirective, Ripple, RouterLink],
    templateUrl: './landing-features.component.html',
    styleUrl: './landing-features.component.scss'
})
export class LandingFeaturesComponent {}
