import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PermissionService } from '../services/permission/permission.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(
        private permissionService: PermissionService,
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        // Get required data from route data
        const requiredForm = route.data['form'];
        const requiredPermission = route.data['permission'];

        // Check if user is logged in
        if (!this.authService.isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
        }

        // Check if required data is provided
        if (!requiredForm || !requiredPermission) {
            console.error('Permission guard: Missing required data', {
                form: requiredForm,
                permission: requiredPermission
            });
            return false;
        }

        // Check permission
        return this.permissionService.checkPermission(requiredForm, requiredPermission).pipe(
            map(response => {
                if (response.body?.hasPermission) {
                    return true;
                } else {
                    // Redirect to unauthorized page or home
                    this.router.navigate(['/unauthorized']);
                    return false;
                }
            }),
            catchError(() => {
                // In case of error, deny access
                this.router.navigate(['/unauthorized']);
                return of(false);
            })
        );
    }
}