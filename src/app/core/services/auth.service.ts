import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';
import { initializeUserContext } from './user-context';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isActive: boolean;
}

export interface AuthResponse {
    body: {
        user: User;
        token: string;
        refreshToken?: string;
    };
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
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private storage: Storage;
    private refreshTokenTimeout: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        initializeUserContext(this.storageService);

        if (isPlatformBrowser(this.platformId)) {
            this.storage = localStorage;
            const storedUser = this.storageService.getItem('currentUser');
            const storedToken = this.storageService.getItem('token');

            if (storedUser && storedToken) {
                try {
                    this.currentUserSubject = new BehaviorSubject<User | null>(
                        JSON.parse(storedUser)
                    );
                } catch (e) {
                    this.storageService.removeItem('currentUser');
                    this.storageService.removeItem('token');
                    this.storageService.removeItem('refreshToken');
                    this.currentUserSubject = new BehaviorSubject<User | null>(null);
                }
            } else {
                this.storageService.removeItem('currentUser');
                this.storageService.removeItem('token');
                this.storageService.removeItem('refreshToken');
                this.currentUserSubject = new BehaviorSubject<User | null>(null);
            }
        } else {
            this.storage = {
                getItem: () => null,
                setItem: () => { },
                removeItem: () => { },
                clear: () => { },
                key: () => null,
                length: 0,
            };
            this.currentUserSubject = new BehaviorSubject<User | null>(null);
        }

        this.currentUser = this.currentUserSubject.asObservable();

        if (this.isLoggedIn) {
            this.startRefreshTokenTimer();
        }
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return this.storageService.getItem('token');
    }

    private get refreshToken(): string | null {
        return this.storageService.getItem('refreshToken');
    }

    public get isLoggedIn(): boolean {
        return !!this.token && !!this.currentUserValue;
    }

    public get isAdmin(): boolean {
        return this.currentUserValue?.role === 'admin';
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
            tap((response) => this.setAuthData(response.body.user, response.body.token, response.body.refreshToken)),
            catchError(this.handleError)
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
            tap((response) => this.setAuthData(response.body.user, response.body.token, response.body.refreshToken)),
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
        this.storageService.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getProfile(): Observable<{ body: User; message: string }> {
        return this.http
            .get<{ body: User; message: string }>(`${this.API_URL}/profile`)
            .pipe(
                tap((response) => {
                    this.currentUserSubject.next(response.body);
                    this.storageService.setItem('currentUser', JSON.stringify(response.body));
                }),
                catchError(this.handleError)
            );
    }

    updateProfile(data: Partial<User>): Observable<{ body: User; message: string }> {
        return this.http
            .put<{ body: User; message: string }>(`${this.API_URL}/profile`, data)
            .pipe(
                tap((response) => {
                    this.currentUserSubject.next(response.body);
                    this.storageService.setItem('currentUser', JSON.stringify(response.body));
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
                return throwError(error);
            })
        );
    }

    private startRefreshTokenTimer() {
        this.stopRefreshTokenTimer();
        this.refreshTokenTimeout = setTimeout(() => {
            this.refreshTokenRequest().subscribe({
                next: () => console.log('Token refreshed successfully'),
                error: (error) => {
                    console.log('Failed to refresh token', error);
                    this.logout();
                }
            });
        }, 55 * 60 * 1000);
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }

    private setAuthData(user: User, token: string, refreshToken?: string): void {
        this.storageService.setItem('token', token);
        if (refreshToken) {
            this.storageService.setItem('refreshToken', refreshToken);
        }
        this.storageService.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
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
        const user = this.currentUserValue;
        if (!user) {
            return Promise.resolve(false);
        }

        if (user.role === 'admin') {
            return Promise.resolve(true);
        }

        return Promise.resolve(true);
    }
}