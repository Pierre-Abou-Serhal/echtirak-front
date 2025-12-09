import { Component } from '@angular/core';
import { Popover } from 'primeng/popover';
import { UserContextService } from '@/core/services/user-context.service';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-wallet-widget',
    imports: [Popover, AsyncPipe, DatePipe, DecimalPipe, CurrencyPipe, ProgressSpinner],
    templateUrl: './wallet-widget.component.html',
    styleUrl: './wallet-widget.component.scss'
})
export class WalletWidgetComponent {
    constructor(public userContext: UserContextService) {}
}
