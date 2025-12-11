import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-landing-top-bar',
    imports: [ButtonDirective, Ripple, StyleClass, AppFloatingConfigurator, RouterLink, NgOptimizedImage],
    templateUrl: './landing-top-bar.component.html',
    styleUrl: './landing-top-bar.component.scss'
})
export class LandingTopBarComponent {
    constructor(public router: Router) {}

    protected readonly environment = environment;
}
