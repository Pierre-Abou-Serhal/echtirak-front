import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserContextService } from '@/core/services/user-context.service';
import { Button } from 'primeng/button';
import { Overlay } from 'primeng/overlay';
import { Divider } from 'primeng/divider';
@Component({
    selector: 'app-warning-widget',
    imports: [CommonModule, Button, Overlay, Divider],
    templateUrl: './warning-widget.component.html',
    styleUrl: './warning-widget.component.scss',
    standalone: true
})
export class WarningWidgetComponent {
    overlayVisible = false;

    constructor(public userContext: UserContextService) {}

    toggle(): void {
        this.overlayVisible = !this.overlayVisible;
    }
}
