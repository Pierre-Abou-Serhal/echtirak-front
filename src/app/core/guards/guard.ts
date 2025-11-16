import { inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { CanMatchFn, Route, Router } from '@angular/router';
import { UserRole } from '@/core/enums/enum';

export const anonymousOnlyGuard: CanMatchFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isAuthenticated()) {
        return authService.homeUrlTree(router);
    }
    return true;
};

export const roleMatchGuard: CanMatchFn = (
    route: Route
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = (route.data?.['roles'] as UserRole[]) ?? [];
    if (!requiredRoles.length) {
        return true;
    }

    if (!authService.isAuthenticated()) {
        return router.parseUrl('/auth/sign-in');
    }

    return authService.hasRole(requiredRoles) ? true : router.parseUrl('/auth/sign-in');
};
