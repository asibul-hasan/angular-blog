import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface LoginActivity {
    _id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    loginTime: Date;
    logoutTime?: Date;
    isActive: boolean;
    sessionDuration?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginActivityResponse {
    body: LoginActivity;
    message: string;
}

export interface LoginActivitiesResponse {
    body: {
        activities: LoginActivity[];
        totalPages: number;
        currentPage: number;
        totalActivities: number;
    };
    message: string;
}

export interface ActiveSessionsResponse {
    body: LoginActivity[];
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoginActivityService {
    private apiUrl = environment.apiUrl + '/login-activity';
    private http = inject(HttpClient);

    /**
     * Get current user's login activities
     * @param page Page number (default: 1)
     * @param limit Number of items per page (default: 10)
     * @returns Observable with login activities
     */
    getMyLoginActivities(page: number = 1, limit: number = 10): Observable<LoginActivitiesResponse> {
        return this.http.get<LoginActivitiesResponse>(`${this.apiUrl}/me?page=${page}&limit=${limit}`);
    }

    /**
     * Get current user's active sessions
     * @returns Observable with active sessions
     */
    getActiveSessions(): Observable<ActiveSessionsResponse> {
        return this.http.get<ActiveSessionsResponse>(`${this.apiUrl}/active`);
    }

    /**
     * Terminate a session
     * @param sessionId Session ID to terminate
     * @returns Observable with termination result
     */
    terminateSession(sessionId: string): Observable<LoginActivityResponse> {
        return this.http.delete<LoginActivityResponse>(`${this.apiUrl}/${sessionId}`);
    }
}