import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/app.layout';
import { NotFoundComponent } from '@/static/not-found/not-found.component';
import { anonymousOnlyGuard, roleMatchGuard } from '@/core/guards/guard';
import { UserRole } from '@/core/enums/enum';
import { AccessDeniedComponent } from '@/static/access-denied/access-denied.component';
import {
    GetBillsByCodeComponent
} from '@/static/get-bills-by-code/get-bills-by-code.component/get-bills-by-code.component';
import { LandingComponent } from '@/static/landing/landing.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/modules/auth/auth.routes'),
        canMatch: [anonymousOnlyGuard]
    },
    {
        path: 'app',
        component: AppLayout,
        children: [
            {
                path: 'generator-owner',
                canMatch: [roleMatchGuard],
                data: {
                    roles: [UserRole.GENERATOR_OWNER]
                },
                loadChildren: () => import('./app/modules/generator-owner/generator-owner.routes').then((route) => route.GENERATOR_OWNER_ROUTES)
            },
            {
                path: 'bill-collector',
                canMatch: [roleMatchGuard],
                data: {
                    roles: [UserRole.BILL_COLLECTOR]
                },
                loadChildren: () => import('./app/modules/bill-collector/bill-collector.routes').then((route) => route.BILL_COLLECTOR_ROUTES)
            },
            {
                path: 'admin',
                canMatch: [roleMatchGuard],
                data: {
                    roles: [UserRole.ADMIN]
                },
                loadChildren: () => import('./app/modules/admin/admin.routes').then((route) => route.ADMIN_ROUTES)
            }
        ]
    },
    {
        path: 'gbc/:code',
        component: GetBillsByCodeComponent
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent
    },
    { path: '**', component: NotFoundComponent }
];
