import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

export const screenNameInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    const screenName = getScreenNameFromRoute(router.routerState.snapshot.root) || getRouteTemplate(router.routerState.snapshot.root) || 'Unknown Screen';

    const clonedRequest = req.clone({
        setHeaders: {
            'X-Screen-Name': screenName
        }
    });

    return next(clonedRequest);
};

function getScreenNameFromRoute(route: ActivatedRouteSnapshot): string | null {
    let current: ActivatedRouteSnapshot | null = route;
    let screenName: string | null = null;

    while (current) {
        const value = current.data?.['screenName'];

        if (value) {
            screenName = String(value);
        }

        current = current.firstChild ?? null;
    }

    return screenName;
}

function getRouteTemplate(route: ActivatedRouteSnapshot): string | null {
    const parts: string[] = [];

    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
        const path = current.routeConfig?.path;

        if (path) {
            parts.push(path);
        }

        current = current.firstChild ?? null;
    }

    return parts.length > 0 ? '/' + parts.join('/') : null;
}
