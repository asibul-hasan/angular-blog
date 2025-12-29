import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Use auth service to check if user is admin
    if (authService.isAdmin) {
        return true;
    }

    // Redirect non-admin users to home page
    router.navigate(['/']);
    return false;
};