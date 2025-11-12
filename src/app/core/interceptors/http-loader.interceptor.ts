import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/services/loader/loader.service';

export const httpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Skip loader for chatbot API calls (show typing animation instead)
  const isChatbotApi = req.url.includes('api-inference.huggingface.co') ||
    req.url.includes('/chatbot/chat');

  if (isChatbotApi) {
    // Don't show global loader for chatbot requests
    return next(req);
  }

  // Show loader for all other HTTP requests
  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
