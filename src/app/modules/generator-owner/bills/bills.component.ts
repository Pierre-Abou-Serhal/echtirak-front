import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-bills.component',
    imports: [TableModule],
    templateUrl: './bills.component.html',
    styleUrl: './bills.component.scss'
})
export class BillsComponent {}
