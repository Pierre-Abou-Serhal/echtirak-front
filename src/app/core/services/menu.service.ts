import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MenuService {
    private _items = signal<MenuItem[]>([]);
    readonly items = this._items.asReadonly();

    set(items: MenuItem[]) {
        this._items.set(items ?? []);
    }
}
