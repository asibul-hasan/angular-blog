import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdmin) {
        return true;
    }

    // Redirect non-admin users to home page
    router.navigate(['/']);
    return false;
};
