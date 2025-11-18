import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterLink],
    template: ` <div class="layout-footer">
        {{ currentDate.getFullYear() }}
        <a target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline" routerLink="/">{{ environment.appName }}</a>
    </div>`
})
export class AppFooter {
    currentDate = new Date();
    protected readonly environment = environment;
}
