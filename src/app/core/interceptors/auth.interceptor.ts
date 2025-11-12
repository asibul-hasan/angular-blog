import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, BehaviorSubject, catchError, switchMap, filter, take } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token;

    // List of endpoints that should NOT include the token
    const skipAuth = req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh-token') || // Skip auth for refresh token endpoint
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
            // If error is 401 Unauthorized and we have a token, try to refresh it
            if (error instanceof HttpErrorResponse && error.status === 401 && token) {
                return handle401Error(req, next, authService);
            }

            return throwError(() => error);
        })
    );
};

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshTokenRequest().pipe(
            switchMap((response: any) => {
                isRefreshing = false;
                refreshTokenSubject.next(response.body.token);
                // Retry original request with new token
                return next(addTokenHeader(request, response.body.token));
            }),
            catchError((error) => {
                isRefreshing = false;
                // Logout user if refresh token fails
                authService.logout();
                return throwError(() => error);
            })
        );
    } else {
        // Wait for refresh token to complete and then retry original request
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next(addTokenHeader(request, token)))
        );
    }
}

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}