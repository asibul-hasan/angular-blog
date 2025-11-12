import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface PermissionCheckResponse {
    body: {
        hasPermission: boolean;
    };
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private apiUrl = environment.apiUrl + '/permission';
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    /**
     * Check if the current user has permission for a specific form
     * @param formRoute The route of the form (e.g., 'blogs', 'categories')
     * @param permission The permission to check (e.g., 'view', 'create', 'edit', 'delete')
     * @param companyId Optional company ID
     * @returns Observable with permission check result
     */
    checkPermission(formRoute: string, permission: string, companyId?: string): Observable<PermissionCheckResponse> {
        // Prepare request body
        const requestBody: any = {
            formRoute,
            permission
        };

        // Add company ID if provided
        if (companyId) {
            requestBody.companyId = companyId;
        } else {
            // Get company ID from local storage if not provided
            const storedCompanyId = localStorage.getItem('currentCompanyId');
            if (storedCompanyId) {
                requestBody.companyId = storedCompanyId;
            }
        }

        // Call the permission check API
        return this.http.post<PermissionCheckResponse>(
            `${this.apiUrl}/check`,
            requestBody
        );
    }

    /**
     * Check if the current user has permission for a specific form (Promise version)
     * @param formRoute The route of the form (e.g., 'blogs', 'categories')
     * @param permission The permission to check (e.g., 'view', 'create', 'edit', 'delete')
     * @param companyId Optional company ID
     * @returns Promise with boolean result
     */
    async hasPermission(formRoute: string, permission: string, companyId?: string): Promise<boolean> {
        try {
            const result = await firstValueFrom(this.checkPermission(formRoute, permission, companyId));
            return result?.body?.hasPermission || false;
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    /**
     * Check multiple permissions at once
     * @param formRoute The route of the form (e.g., 'blogs', 'categories')
     * @param permissions Array of permissions to check (e.g., ['view', 'create', 'edit', 'delete'])
     * @param companyId Optional company ID
     * @returns Promise with object containing permission results
     */
    async checkMultiplePermissions(formRoute: string, permissions: string[], companyId?: string): Promise<{ [key: string]: boolean }> {
        const results: { [key: string]: boolean } = {};

        try {
            for (const permission of permissions) {
                results[permission] = await this.hasPermission(formRoute, permission, companyId);
            }
            return results;
        } catch (error) {
            console.error('Error checking permissions:', error);
            // Return false for all permissions if there's an error
            permissions.forEach(permission => {
                results[permission] = false;
            });
            return results;
        }
    }
}