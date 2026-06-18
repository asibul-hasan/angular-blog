import { PreloadAllModules, withPreloading, withViewTransitions } from '@angular/router';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { httpLoaderInterceptor } from './core/interceptors/http-loader.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { CustomPreloadingStrategy } from './core/strategies/custom-preloading.strategy';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true // Improved performance
    }),
    // Performance optimizations
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withPreloading(CustomPreloadingStrategy), // Use custom preloading strategy for better performance
      withViewTransitions() // Enable smooth page transitions
    ),
    MessageService, // Ensure MessageService is provided at the app level

    // ✅ HttpClient with fetch + interceptors for SSR
    // Optimized HTTP client with performance improvements
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpLoaderInterceptor])
    ),

    // PrimeNG configuration
    providePrimeNG(),    // ✅ Enhanced hydration with HTTP cache
    // Enhanced hydration with performance optimizations
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: false // Only cache GET requests
      })
    ),
  ],
};