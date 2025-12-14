import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '@/core/services/layout.service';
import { MenuService } from '@/core/services/menu.service';
import { MenuItem } from 'primeng/api';
import { UserContextService } from '@/core/services/user-context.service';
import { WarningWidgetComponent } from '@/layout/generator-owner/warning-widget/warning-widget.component';
import { AuthService } from '@/core/services/auth.service';
import { UserRole } from '@/core/enums/enum';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, WarningWidgetComponent],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar [profileMenu]="profileMenu"></app-topbar>
        <app-sidebar></app-sidebar>

        <!-- Generator owner Global UI components -->
        @if (authService.getRole() === UserRole.GENERATOR_OWNER) {
            <div class="fixed top-20 right-4 z-50">
                <app-warning-widget></app-warning-widget>
            </div>
        }

        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    profileMenu: MenuItem[] = [];

    private unreadSub?: Subscription;
    private lastUnread = 0;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private ar: ActivatedRoute,
        private menuService: MenuService,
        private userContext: UserContextService,
        public authService: AuthService
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
            this.pushActiveMenu();
        });
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }

        this.unreadSub?.unsubscribe();
    }

    // call once on first render (add ngOnInit)
    ngOnInit() {
        this.pushActiveMenu();
        this.userContext.loadGlobalContext(); // Will load global UI data available across all components

        this.unreadSub = this.userContext.generatorOwnerAnnouncementUnreadCount$.subscribe((count) => {
            this.lastUnread = count ?? 0;
            this.patchAnnouncementsBadge(this.lastUnread);
            console.log(this.lastUnread);
        });
    }

    private pushActiveMenu() {
        // Walk down to the deepest active child and read data.menu
        let r: ActivatedRoute | null = this.ar;
        while (r?.firstChild) r = r.firstChild;

        const data = r?.snapshot.data ?? {};
        const menu = data['menu'] as MenuItem[];
        const profileMenu = data['profileMenu'] as MenuItem[];

        this.menuService.set(menu);
        this.profileMenu = profileMenu ?? [];

        this.patchAnnouncementsBadge(this.lastUnread);
    }

    private patchAnnouncementsBadge(unread: number) {
        const items = this.menuService.items(); // read signal value
        const updated = this.withAnnouncementsBadge(items, unread);
        this.menuService.set(updated);
    }

    private withAnnouncementsBadge(items: MenuItem[], unread: number): MenuItem[] {
        const badge = unread > 0 ? String(unread) : undefined;

        return items.map((section) => ({
            ...section,
            items: section.items?.map((child) => {
                // Only announcement menu item will get a badge
                if (child.routerLink[0] !== '/app/generator-owner/announcements') return child;

                return {
                    ...child,
                    badge
                };
            })
        }));
    }

    protected readonly UserRole = UserRole;
}
