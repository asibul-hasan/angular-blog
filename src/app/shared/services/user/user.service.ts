import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserCompany {
    company: string;
    role: string;
    isActive: boolean;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    avatar?: string;
    companies?: UserCompany[];
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = environment.apiUrl + '/auth';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Get all users (admin only)
     */
    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users`);
    }

    /**
     * Delete user
     */
    deleteUser(userId: string): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.delete(`${this.apiUrl}/users/${userId}`);
        }
        return of(null);
    }

    /**
     * Upload avatar to Cloudinary
     */
    uploadAvatar(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'blog-images');

        const cloudName = 'dfcir8epp';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        return this.http.post(url, formData);
    }

    /**
     * Get user permissions for a specific company
     */
    getUserPermissions(userId: string, companyId: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/access/permissions/${userId}/${companyId}`);
    }

    /**
     * Check if user has specific permission for a form
     */
    checkUserPermission(userId: string, companyId: string, formId: string, permission: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/access/check-permission/${userId}/${companyId}/${formId}/${permission}`);
    }
}