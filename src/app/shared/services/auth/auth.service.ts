// src/app/auth/services/auth.service.ts (Updated with environment)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  public get isLoggedIn(): boolean {
    return !!this.token && !!this.currentUserValue;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response) => {
        this.setAuthData(response.body.user, response.body.token);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap((response) => {
        this.setAuthData(response.body.user, response.body.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<{ body: User; message: string }> {
    return this.http
      .get<{ body: User; message: string }>(`${this.API_URL}/profile`)
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.body);
          localStorage.setItem('currentUser', JSON.stringify(response.body));
        })
      );
  }

  updateProfile(
    data: Partial<User>
  ): Observable<{ body: User; message: string }> {
    return this.http
      .put<{ body: User; message: string }>(`${this.API_URL}/profile`, data)
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.body);
          localStorage.setItem('currentUser', JSON.stringify(response.body));
        })
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.API_URL}/change-password`,
      {
        currentPassword,
        newPassword,
      }
    );
  }

  private setAuthData(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
