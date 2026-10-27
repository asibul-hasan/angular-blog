import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface ContactMessage {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    serviceInterest?: string;
    message: string;
    companyUrl?: string;
    status?: 'unread' | 'read' | 'replied' | 'archived';
    adminNotes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactResponse {
    body: any;
    message: string;
}

export interface ContactListResponse {
    body: ContactMessage[];
    total: number;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = environment.apiUrl + '/contact';
    private http = inject(HttpClient);

    /**
     * Send a contact message (Public)
     */
    sendContactMessage(contactMessage: ContactMessage): Observable<ContactResponse> {
        return this.http.post<ContactResponse>(`${this.apiUrl}`, contactMessage);
    }

    /**
     * Get all contact messages with optional filters (Admin)
     */
    getContactMessages(status?: string, search?: string): Observable<ContactListResponse> {
        let params = new HttpParams();
        if (status && status !== 'all') {
            params = params.set('status', status);
        }
        if (search && search.trim()) {
            params = params.set('search', search.trim());
        }
        return this.http.get<ContactListResponse>(`${this.apiUrl}`, { params });
    }

    /**
     * Get single contact message by ID (Admin)
     */
    getContactMessageById(id: string): Observable<{ body: ContactMessage; message: string }> {
        return this.http.get<{ body: ContactMessage; message: string }>(`${this.apiUrl}/${id}`);
    }

    /**
     * Update message status and/or admin notes (Admin)
     */
    updateMessageStatus(id: string, status: string, adminNotes?: string): Observable<{ body: ContactMessage; message: string }> {
        return this.http.patch<{ body: ContactMessage; message: string }>(`${this.apiUrl}/${id}/status`, {
            status,
            adminNotes,
        });
    }

    /**
     * Delete contact message (Admin)
     */
    deleteContactMessage(id: string): Observable<ContactResponse> {
        return this.http.delete<ContactResponse>(`${this.apiUrl}/${id}`);
    }
}