import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/core/services/layout.service';
import { environment } from '../../../environments/environment';
import { Toast } from 'primeng/toast';
import { Menu } from 'primeng/menu';
import { AuthService } from '@/core/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Toast, Menu, NgOptimizedImage],
    template: ` <p-toast />
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/auth/sign-in">
                    <img ngSrc="/logo/logo.svg" alt="Echtirak Logo" height="40" width="40" priority />
                    <span>{{ appName }}</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <!-- PROFILE MENU (dynamic) -->
                <p-menu #profileMenuRef [model]="profileMenuModel" [popup]="true" appendTo="body"> </p-menu>

                @if (profileMenuModel.length) {
                    <button type="button" class="layout-topbar-action" (click)="profileMenuRef.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                }
            </div>
        </div>`
})
export class AppTopbar implements OnChanges {
    @Input() profileMenu: MenuItem[] | null = null;

    profileMenuModel: MenuItem[] = [];

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('profileMenu' in changes) {
            this.buildProfileMenuModel();
        }
    }

    private buildProfileMenuModel(): void {
        const items = this.profileMenu ?? [];
        const result: MenuItem[] = [...items];

        if (items.length) {
            result.push({ separator: true });
        }

        result.push({
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        });

        this.profileMenuModel = result;
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    async logout() {
        await this.authService.logout();
    }

    appName: string = environment.appName;
}
