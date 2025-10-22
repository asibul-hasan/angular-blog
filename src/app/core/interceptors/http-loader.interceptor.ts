import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/services/loader/loader.service';
import { LOADER_CONTEXT } from './loader-context';

export const httpLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  if (req.context.get(LOADER_CONTEXT)) {
    loaderService.show();
    return next(req).pipe(finalize(() => loaderService.hide()));
  }

  return next(req);
};
