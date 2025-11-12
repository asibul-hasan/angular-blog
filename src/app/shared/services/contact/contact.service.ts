import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
    companyUrl?: string;
}

export interface ContactResponse {
    body: any;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = environment.apiUrl + '/contact';
    private http = inject(HttpClient);

    /**
     * Send a contact message
     * @param contactMessage The contact message to send
     * @returns Observable with the response
     */
    sendContactMessage(contactMessage: ContactMessage): Observable<ContactResponse> {
        return this.http.post<ContactResponse>(`${this.apiUrl}`, contactMessage);
    }
}