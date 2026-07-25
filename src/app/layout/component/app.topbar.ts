import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/core/services/layout.service';
import { environment } from '../../../environments/environment';
import { Toast } from 'primeng/toast';
import { Menu } from 'primeng/menu';
import { AuthService } from '@/core/services/auth.service';
import { UserRole } from '@/core/enums/enum';
import { WalletWidgetComponent } from '@/layout/generator-owner/wallet-widget/wallet-widget.component';
import { ExtraFeesWidgetComponent } from '@/layout/generator-owner/extra-fees-widget/extra-fees-widget.component';
import { BillCollectorBillingPeriodService } from '@/core/services/bill-collector-billing-period.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import {
    BillingPeriodDialogComponent
} from '@/modules/bill-collector/billing-period-dialog/billing-period-dialog.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Toast, Menu, NgOptimizedImage, WalletWidgetComponent, ExtraFeesWidgetComponent],
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
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()" aria-label="Toggle dark mode">
                        <i
                            [ngClass]="{
                                pi: true,
                                'pi-moon': layoutService.isDarkTheme(),
                                'pi-sun': !layoutService.isDarkTheme()
                            }"
                        ></i>
                    </button>
                    <!--                    <div class="relative">-->
                    <!--                        <button-->
                    <!--                            class="layout-topbar-action layout-topbar-action-highlight"-->
                    <!--                            pStyleClass="@next"-->
                    <!--                            enterFromClass="hidden"-->
                    <!--                            enterActiveClass="animate-scalein"-->
                    <!--                            leaveToClass="hidden"-->
                    <!--                            leaveActiveClass="animate-fadeout"-->
                    <!--                            [hideOnOutsideClick]="true"-->
                    <!--                        >-->
                    <!--                            <i class="pi pi-palette"></i>-->
                    <!--                        </button>-->
                    <!--                        <app-configurator />-->
                    <!--                    </div>-->
                    <!-- Generator owner Global UI components -->
                    @if (authService.getRole() === UserRole.GENERATOR_OWNER) {
                        <app-wallet-widget></app-wallet-widget>
                        <app-extra-fees-widget></app-extra-fees-widget>
                    }

                    @if (showBillingPeriodButton) {
                        <button
                            type="button"
                            class="layout-topbar-action billing-period-action"
                            [class.billing-period-action--missing]="!billingPeriodService.configured()"
                            [class.billing-period-action--old]="billingPeriodService.configured() && !billingPeriodService.isCurrentMonth()"
                            [title]="billingPeriodService.configured() ? 'Billing period: ' + billingPeriodService.label() : 'Set billing period'"
                            [attr.aria-label]="billingPeriodService.configured() ? 'Change billing period. Current period is ' + billingPeriodService.label() : 'Set billing period'"
                            (click)="openBillingPeriodDialog()"
                        >
                            <i class="pi pi-calendar"></i>

                            <span class="billing-period-action__label">
                                @if (billingPeriodService.configured()) {
                                    {{ billingPeriodService.label() }}
                                } @else {
                                    Set period
                                }
                            </span>

                            @if (!billingPeriodService.configured()) {
                                <span class="billing-period-action__indicator"></span>
                            }
                        </button>
                    }
                </div>

                <!-- PROFILE MENU (dynamic) -->
                <p-menu #profileMenuRef [model]="profileMenuModel" [popup]="true" appendTo="body"> </p-menu>

                @if (profileMenuModel.length) {
                    <button type="button" class="layout-topbar-action" (click)="profileMenuRef.toggle($event)">
                        <i class="pi pi-user"></i>
                    </button>
                }
            </div>
        </div>`,
    styles: [
        `
            .billing-period-action {
                width: auto;
                min-width: 2.5rem;
                padding-inline: 0.75rem;
                gap: 0.5rem;
                border-radius: 999px;
            }

            .billing-period-action__label {
                max-width: 9rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .billing-period-action--missing {
                color: var(--p-red-500);
                border: 1px solid var(--p-red-300);
            }

            .billing-period-action--old {
                color: var(--p-orange-500);
                border: 1px solid var(--p-orange-300);
            }

            .billing-period-action__indicator {
                width: 0.45rem;
                height: 0.45rem;
                border-radius: 999px;
                background: var(--p-red-500);
            }

            @media (max-width: 640px) {
                .billing-period-action {
                    width: 2.5rem;
                    padding-inline: 0;
                }

                .billing-period-action__label {
                    display: none;
                }
            }
        `
    ],
    providers: [DialogService]
})
export class AppTopbar implements OnChanges, OnDestroy {
    @Input() profileMenu: MenuItem[] | null = null;

    profileMenuModel: MenuItem[] = [];

    constructor(
        public layoutService: LayoutService,
        public authService: AuthService,
        public billingPeriodService: BillCollectorBillingPeriodService,
        private readonly dialogService: DialogService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('profileMenu' in changes) {
            this.buildProfileMenuModel();
        }
    }

    private buildProfileMenuModel(): void {
        const items = this.profileMenu ?? [];
        const result: MenuItem[] = [];

        // Add "signed in as" header
        result.push({
            label: `${this.authService.getUsername?.() ?? '—'}`, // adapt to your AuthService
            //icon: 'pi pi-sign-in',
            disabled: true
        });

        result.push({ separator: true });

        result.push(...items);

        if (items.length) result.push({ separator: true });

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

    private billingPeriodDialogRef?: DynamicDialogRef;

    get showBillingPeriodButton(): boolean {
        return this.authService.getRole() === UserRole.BILL_COLLECTOR && this.authService.autoBillOnReading();
    }

    openBillingPeriodDialog(): void {
        this.billingPeriodDialogRef?.close();

        const dialogRef = this.dialogService.open(BillingPeriodDialogComponent, {
            header: 'Billing Period',
            modal: true,
            closable: true,
            draggable: false,
            resizable: false,
            dismissableMask: false,
            width: '95vw',
            style: {
                maxWidth: '460px'
            },
            breakpoints: {
                '640px': '95vw'
            },
            contentStyle: {
                overflow: 'visible'
            }
        });

        this.billingPeriodDialogRef = dialogRef;

        dialogRef.onClose.pipe(take(1)).subscribe(() => {
            if (this.billingPeriodDialogRef === dialogRef) {
                this.billingPeriodDialogRef = undefined;
            }
        });
    }

    ngOnDestroy(): void {
        this.billingPeriodDialogRef?.close();
    }

    appName: string = environment.appName;
    protected readonly UserRole = UserRole;
}
