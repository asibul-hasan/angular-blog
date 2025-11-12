import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../storage.service';
import { initializeUserContext } from '../user-context';

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

// Added hasPermission method to support access control

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // AuthService class with hasPermission method for access control
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
    // Initialize user context with storage service
    initializeUserContext(this.storageService);

    // Initialize storage based on platform
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;

      // Initialize user from storage on browser
      const storedUser = this.storageService.getItem('currentUser');
      const storedToken = this.storageService.getItem('token');

      // Only set user if both token and user exist
      if (storedUser && storedToken) {
        try {
          this.currentUserSubject = new BehaviorSubject<User | null>(
            JSON.parse(storedUser)
          );
        } catch (e) {
          // Invalid JSON, clear storage
          this.storageService.removeItem('currentUser');
          this.storageService.removeItem('token');
          this.storageService.removeItem('refreshToken');
          this.currentUserSubject = new BehaviorSubject<User | null>(null);
        }
      } else {
        // No valid auth data, clear everything
        this.storageService.removeItem('currentUser');
        this.storageService.removeItem('token');
        this.storageService.removeItem('refreshToken');
        this.currentUserSubject = new BehaviorSubject<User | null>(null);
      }
    } else {
      // SSR: Provide a no-op fallback to avoid runtime errors
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

    // Start refresh timer if user is already logged in
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
    // Call server logout endpoint if needed
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

  // Refresh token method
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
        // If refresh token fails, logout user
        this.logout();
        return throwError(error);
      })
    );
  }

  // Auto-refresh token before it expires (1 hour)
  private startRefreshTokenTimer() {
    this.stopRefreshTokenTimer();
    // Refresh token 5 minutes before it expires (3600000ms = 1 hour)
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshTokenRequest().subscribe({
        next: () => console.log('Token refreshed successfully'),
        error: (error) => {
          console.log('Failed to refresh token', error);
          // If auto-refresh fails, logout user
          this.logout();
        }
      });
    }, 55 * 60 * 1000); // 55 minutes
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
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    console.error('An error occurred', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Check if the current user has a specific permission
   * @param module The module to check permissions for
   * @param permission The permission to check (create, edit, delete, view)
   * @returns Promise resolving to boolean indicating if user has permission
   */
  hasPermission(module: string, permission: string): Promise<boolean> {
    // For now, we'll implement a simple role-based permission check
    // In a real application, this would check against actual permissions
    const user = this.currentUserValue;
    if (!user) {
      return Promise.resolve(false);
    }

    // Admin users have all permissions
    if (user.role === 'admin') {
      return Promise.resolve(true);
    }

    // For other roles, we could implement more specific permission checks
    // For now, we'll allow basic permissions for all authenticated users
    return Promise.resolve(true);
  }
}