import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;

    // List of endpoints that should NOT include the token
    const skipAuth = req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('cloudinary.com') ||
        req.url.includes('generativelanguage.googleapis.com') ||
        // Allow public GET requests for blogs and categories
        (req.method === 'GET' && (
            req.url.includes('/blog/get-blog') ||
            req.url.includes('/category/get-category')
        ));

    // Add Authorization header if token exists and endpoint is not excluded
    if (token && !skipAuth) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // If error is 401 Unauthorized and we have a token, logout user
            if (error instanceof HttpErrorResponse && error.status === 401 && token) {
                authService.logout();
            }

            return throwError(() => error);
        })
    );
};
