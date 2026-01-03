import { Component } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Chip } from 'primeng/chip';

@Component({
    selector: 'app-landing-highlights',
    imports: [Ripple, ButtonDirective, RouterLink, Chip],
    templateUrl: './landing-highlights.component.html',
    styleUrl: './landing-highlights.component.scss'
})
export class LandingHighlightsComponent {}
