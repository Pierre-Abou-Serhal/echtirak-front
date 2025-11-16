import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        {{currentDate.getFullYear()}}
        <a href="https://echtirak.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">{{environment.appName}}</a>
    </div>`
})
export class AppFooter {
    currentDate = new Date();
    protected readonly environment = environment;
}
