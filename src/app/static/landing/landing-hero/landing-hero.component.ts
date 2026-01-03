import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-landing-hero',
    imports: [ButtonDirective, Ripple, RouterLink],
    templateUrl: './landing-hero.component.html',
    styleUrl: './landing-hero.component.scss'
})
export class LandingHeroComponent {}
