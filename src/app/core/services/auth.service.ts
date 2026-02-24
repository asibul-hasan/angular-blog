import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { UserContextService, UserInfo, UserCompany } from './user-context.service';

export type User = UserInfo;

export interface AuthResponse {
    body: any;
    TOKEN?: string;
    refreshToken?: string;
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface RefreshTokenResponse {
    body: {
        token: string;
        refreshToken?: string;
    };
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly API_URL = `${(environment as any).apiUrl}/auth`;
    private http = inject(HttpClient);
    private router = inject(Router);
    private storageService = inject(StorageService);
    private userContextService = inject(UserContextService);

    private refreshTokenTimeout: any;

    constructor() {
        if (this.isLoggedIn) {
            this.startRefreshTokenTimer();
        }
    }

    public get token(): string | null {
        return this.storageService.getItem('token');
    }

    private get refreshToken(): string | null {
        return this.storageService.getItem('refreshToken');
    }

    public get isLoggedIn(): boolean {
        return !!this.token && this.userContextService.isLoggedIn();
    }

    public get isAdmin(): boolean {
        return this.userContextService.isAdmin();
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
            tap((response) => this.setAuthData(response.body, response.TOKEN, response.refreshToken)),
            catchError(this.handleError)
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
            tap((response) => this.setAuthData(response.body, response.TOKEN, response.refreshToken)),
            catchError(this.handleError)
        );
    }

    logout(): void {
        if (this.token) {
            this.http.post(`${this.API_URL}/logout`, {}).subscribe({
                error: (err) => console.log('Logout error:', err)
            });
        }
        this.stopRefreshTokenTimer();
        this.storageService.removeItem('token');
        this.storageService.removeItem('refreshToken');
        this.userContextService.setCurrentUser(null);
        this.router.navigate(['/login']);
    }

    getProfile(): Observable<{ body: any; message: string }> {
        return this.http
            .get<{ body: any; message: string }>(`${this.API_URL}/profile`)
            .pipe(
                tap((response) => {
                    const rawUser = response.body?.user || response.body;
                    this.userContextService.setCurrentUser(this.mapUser(rawUser));
                }),
                catchError(this.handleError)
            );
    }

    updateProfile(data: Partial<User>): Observable<{ body: any; message: string }> {
        return this.http
            .put<{ body: any; message: string }>(`${this.API_URL}/profile`, data)
            .pipe(
                tap((response) => {
                    const rawUser = response.body?.user || response.body;
                    this.userContextService.setCurrentUser(this.mapUser(rawUser));
                }),
                catchError(this.handleError)
            );
    }

    changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(
            `${this.API_URL}/change-password`,
            { currentPassword, newPassword }
        ).pipe(
            catchError(this.handleError)
        );
    }

    refreshTokenRequest(): Observable<RefreshTokenResponse> {
        const refreshToken = this.refreshToken;
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        return this.http.post<RefreshTokenResponse>(
            `${this.API_URL}/refresh-token`,
            { refreshToken }
        ).pipe(
            tap(response => {
                this.storageService.setItem('token', response.body.token);
                if (response.body.refreshToken) {
                    this.storageService.setItem('refreshToken', response.body.refreshToken);
                }
                this.startRefreshTokenTimer();
            }),
            catchError(error => {
                this.logout();
                return throwError(() => error);
            })
        );
    }

    private startRefreshTokenTimer() {
        // Disabled: Backend issues 30-day JWT tokens and no longer uses 55m rotation.
        // Attempting to refresh was hitting a 404 endpoint and forcefully logging users out.
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }

    private mapUser(rawUser: any): User {
        if (!rawUser) return null as any;
        return {
            userId: rawUser._id || rawUser.userId,
            userName: rawUser.name || rawUser.userName,
            email: rawUser.email,
            userRole: rawUser.role || rawUser.userRole,
            avatar: rawUser.avatar,
            isActive: rawUser.isActive !== false,
            companies: rawUser.companies || [],
        };
    }

    private setAuthData(body: any, fallbackToken?: string, fallbackRefreshToken?: string): void {
        const token = body?.token || fallbackToken;
        const refreshToken = body?.refreshToken || fallbackRefreshToken;
        const rawUser = body?.user || body;

        if (token) {
            this.storageService.setItem('token', token);
        }
        if (refreshToken) {
            this.storageService.setItem('refreshToken', refreshToken);
        }
        this.userContextService.setCurrentUser(this.mapUser(rawUser));
        this.startRefreshTokenTimer();
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error?.message) {
                errorMessage += `\nDetails: ${error.error.message}`;
            }
        }
        console.error('An error occurred', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    hasPermission(module: string, permission: string): Promise<boolean> {
        const user = this.userContextService.user();
        if (!user) {
            return Promise.resolve(false);
        }

        if (user.userRole === 'admin') {
            return Promise.resolve(true);
        }

        // Add more complex permission logic here if needed
        return Promise.resolve(true);
    }
}
