import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface CompanyAddress {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    timezone?: string;
}

export interface CompanyContact {
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
}

export interface CompanyMeta {
    tags?: string[];
    notes?: string;
}

export interface CompanyUser {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    role: string;
    isActive: boolean;
}

export interface Company {
    _id?: string;
    name: string;
    legalName?: string;
    type?: string;
    industry?: string;
    foundedDate?: Date;
    logoUrl?: string;
    status?: string;
    address?: CompanyAddress;
    contact?: CompanyContact;
    registrationNumber?: string;
    taxId?: string;
    currency?: string;
    fiscalYearStart?: Date;
    fiscalYearEnd?: Date;
    createdBy?: {
        _id: string;
        name: string;
        email: string;
    };
    users?: CompanyUser[];
    meta?: CompanyMeta;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CompanyStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
}

export interface CompanyUsersResponse {
    users: CompanyUser[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/company`;

    constructor(private http: HttpClient) { }

    // Company CRUD operations
    getCompanies(): Observable<{ body: Company[] }> {
        return this.http.get<{ body: Company[] }>(`${this.apiUrl}/get-company-list`);
    }

    getCompanyById(id: string): Observable<{ body: Company }> {
        return this.http.get<{ body: Company }>(`${this.apiUrl}/get-company/${id}`);
    }

    createCompany(company: Omit<Company, '_id'>): Observable<{ body: Company }> {
        return this.http.post<{ body: Company }>(`${this.apiUrl}/create-company`, company);
    }

    updateCompany(id: string, company: Partial<Company>): Observable<{ body: Company }> {
        return this.http.put<{ body: Company }>(`${this.apiUrl}/edit-company/${id}`, company);
    }

    deleteCompany(id: string): Observable<{ body: boolean }> {
        return this.http.delete<{ body: boolean }>(`${this.apiUrl}/delete-company/${id}`);
    }

    // Company user management
    addUserToCompany(companyId: string, userId: string, role: string): Observable<{ body: { company: Company, user: any } }> {
        return this.http.post<{ body: { company: Company, user: any } }>(`${this.apiUrl}/${companyId}/users`, { userId, role });
    }

    removeUserFromCompany(companyId: string, userId: string): Observable<{ body: { company: Company, user: any } }> {
        return this.http.delete<{ body: { company: Company, user: any } }>(`${this.apiUrl}/${companyId}/users/${userId}`);
    }

    updateUserRoleInCompany(companyId: string, userId: string, role: string): Observable<{ body: { company: Company, user: any } }> {
        return this.http.put<{ body: { company: Company, user: any } }>(`${this.apiUrl}/${companyId}/users/${userId}`, { role });
    }

    // User-friendly methods for company management
    /**
     * Get companies for a specific user
     */
    getUserCompanies(userId: string): Observable<{ body: Company[] }> {
        return this.http.get<{ body: Company[] }>(`${this.apiUrl}/get-company-list?userId=${userId}`);
    }

    /**
     * Get users in a company with pagination
     */
    getCompanyUsers(companyId: string, page: number = 1, limit: number = 10): Observable<{ body: CompanyUsersResponse }> {
        return this.http.get<{ body: CompanyUsersResponse }>(`${this.apiUrl}/${companyId}/users?page=${page}&limit=${limit}`);
    }

    /**
     * Activate/deactivate a user in a company
     */
    toggleUserStatus(companyId: string, userId: string, isActive: boolean): Observable<{ body: { company: Company, user: any } }> {
        return this.http.patch<{ body: { company: Company, user: any } }>(`${this.apiUrl}/${companyId}/users/${userId}/status`, { isActive });
    }

    /**
     * Search companies by name
     */
    searchCompanies(query: string): Observable<{ body: Company[] }> {
        return this.http.get<{ body: Company[] }>(`${this.apiUrl}/search?name=${query}`);
    }

    /**
     * Get company statistics
     */
    getCompanyStats(companyId: string): Observable<{ body: CompanyStats }> {
        return this.http.get<{ body: CompanyStats }>(`${this.apiUrl}/${companyId}/stats`);
    }

    /**
     * Invite user to company (would send email)
     */
    inviteUserToCompany(companyId: string, email: string, role: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${companyId}/invite`, { email, role });
    }

    /**
     * Update company logo
     */
    updateCompanyLogo(companyId: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'company-logos');

        const cloudName = 'dfcir8epp';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        return this.http.post(url, formData);
    }
}