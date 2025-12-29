import { inject, PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    Router,
    CanActivateFn,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserContextService } from '../services/user-context.service';

export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userContextService = inject(UserContextService);
    const platformId = inject(PLATFORM_ID);

    // Skip guard during SSR
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // Check if user has valid token and is logged in via UserContextService
    if (authService.token && userContextService.isLoggedIn()) {
        const currentUser = userContextService.user();
        // Check if route requires admin role using current user data
        if (
            route.data['roles'] &&
            route.data['roles'].indexOf(currentUser.userRole) === -1
        ) {
            router.navigate(['/']);
            return false;
        }
        return true;
    }

    // Not logged in, redirect to login with return url
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
    });
    return false;
};

// Legacy class-based guard (deprecated but kept for compatibility)

@Injectable({
    providedIn: 'root',
})
export class AuthGuardClass implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private userContextService: UserContextService, // Inject UserContextService
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Skip guard during SSR
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        // Check if user has valid token and is logged in via UserContextService
        if (this.authService.token && this.userContextService.isLoggedIn()) {
            const currentUser = this.userContextService.user();
            // Check if route requires admin role using current user data
            if (
                route.data['roles'] &&
                route.data['roles'].indexOf(currentUser.userRole) === -1
            ) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }

        // Not logged in, redirect to login with return url
        this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
        });
        return false;
    }
}
