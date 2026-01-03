import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-landing-footer',
    imports: [NgOptimizedImage, ButtonDirective, Ripple, RouterLink],
    templateUrl: './landing-footer.component.html',
    styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
    constructor(public router: Router) {}

    protected readonly environment = environment;

    fullyear: number = new Date().getFullYear();
}
