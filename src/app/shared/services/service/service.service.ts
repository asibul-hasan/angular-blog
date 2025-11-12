import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface Service {
    _id?: string;
    title: string;
    description: string;
    icon?: string;
    features?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({
    providedIn: 'root',
})
export class ServiceService {
    private apiUrl = environment.apiUrl + '/service';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Get all services
     */
    getServices(): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-service-list`);
    }

    /**
     * Get a single service by ID
     */
    getServiceById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-service/${id}`);
    }

    /**
     * Create a new service (admin only)
     */
    createService(service: Service): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.post(`${this.apiUrl}/create-service`, service);
        }
        return of(null);
    }

    /**
     * Update a service (admin only)
     */
    updateService(id: string, service: Partial<Service>): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.put(`${this.apiUrl}/edit-service/${id}`, service);
        }
        return of(null);
    }

    /**
     * Delete a service (admin only)
     */
    deleteService(id: string): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.delete(`${this.apiUrl}/delete-service/${id}`);
        }
        return of(null);
    }
}