import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, of, throwError } from 'rxjs';
import { LoaderService } from '../../shared/services/loader/loader.service';

export const httpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Skip loader for chatbot API calls (show typing animation instead)
  const isChatbotApi =
    // req.url.includes('api-inference.huggingface.co') ||
    req.url.includes('/chatbot/chat') || req.url.includes('/gemini/chat');

  // Skip loader for non-critical API calls to reduce blocking time
  const isNonCritical = req.url.includes('/analytics') ||
    req.url.includes('/tracking') ||
    req.url.includes('/metrics');

  if (isChatbotApi || isNonCritical) {
    // Don't show global loader for non-critical requests
    return next(req);
  }

  // Show loader for all other HTTP requests with performance optimization
  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide()),
    catchError(error => {
      loaderService.hide(); // Ensure loader is hidden on error
      return throwError(() => error);
    })
  );
};
