import { Component } from '@angular/core';
import { LandingTopBarComponent } from '@/static/landing/landing-top-bar/landing-top-bar.component';
import { LandingHeroComponent } from '@/static/landing/landing-hero/landing-hero.component';
import { LandingFeaturesComponent } from '@/static/landing/landing-features/landing-features.component';
import { LandingHighlightsComponent } from '@/static/landing/landing-highlights/landing-highlights.component';
import { LandingPricingComponent } from '@/static/landing/landing-pricing/landing-pricing.component';
import { LandingFooterComponent } from '@/static/landing/landing-footer/landing-footer.component';

@Component({
    selector: 'app-landing.component',
    imports: [LandingTopBarComponent, LandingHeroComponent, LandingFeaturesComponent, LandingHighlightsComponent, LandingPricingComponent, LandingFooterComponent],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {}
