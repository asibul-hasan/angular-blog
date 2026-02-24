import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Skip guard during SSR
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // Use auth service to check if user is admin
    if (authService.isAdmin) {
        return true;
    }

    // Redirect non-admin users to home page
    router.navigate(['/']);
    return false;
};