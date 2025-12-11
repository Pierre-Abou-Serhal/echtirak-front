import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-landing-hero',
    imports: [ButtonDirective, Ripple],
    templateUrl: './landing-hero.component.html',
    styleUrl: './landing-hero.component.scss'
})
export class LandingHeroComponent {}
