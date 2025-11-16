import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/app.layout';
import { NotFoundComponent } from '@/static/not-found/not-found.component';
import { anonymousOnlyGuard, roleMatchGuard } from '@/core/guards/guard';
import { UserRole } from '@/core/enums/enum';
import { HomeComponent } from '@/static/home/home.component';
import { AccessDeniedComponent } from '@/static/access-denied/access-denied.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/modules/auth/auth.routes'),
        canMatch: [anonymousOnlyGuard],
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
                loadChildren: () =>
                    import('./app/modules/generator-owner/generator-owner.routes')
                        .then((route) => route.GENERATOR_OWNER_ROUTES)
            },
        ]
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent,
    },
    { path: '**', component: NotFoundComponent }
];
