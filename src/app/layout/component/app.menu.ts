import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuService } from '@/core/services/menu.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for(item of model(); track $index; let i = $index){
            <ng-container>
                @if(!item.separator){
                    <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                }
                @if(item.separator){
                    <li class="menu-separator"></li>
                }
            </ng-container>
        }
    </ul> `
})
export class AppMenu {
    private menu = inject(MenuService);
    model = computed<MenuItem[]>(() => this.menu.items());
}
