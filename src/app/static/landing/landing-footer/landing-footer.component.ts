import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-landing-footer',
    imports: [NgOptimizedImage],
    templateUrl: './landing-footer.component.html',
    styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
    constructor(public router: Router) {}

    protected readonly environment = environment;
}
