import { Component, inject } from '@angular/core';

import { Popover } from 'primeng/popover';

import { UserContextService } from '@/core/services/user-context.service';
import {
    ExtraFeesManagerComponent
} from '@/layout/generator-owner/extra-fees-widget/extra-fees-manager/extra-fees-manager.component';

@Component({
    selector: 'app-extra-fees-widget',
    standalone: true,
    imports: [Popover, ExtraFeesManagerComponent, ExtraFeesManagerComponent],
    templateUrl: './extra-fees-widget.component.html',
    styleUrl: './extra-fees-widget.component.scss'
})
export class ExtraFeesWidgetComponent {
    private readonly userContext = inject(UserContextService);

    onToggle(event: Event, op: Popover): void {
        this.userContext.loadExtraFees();
        op.toggle(event);
    }
}
