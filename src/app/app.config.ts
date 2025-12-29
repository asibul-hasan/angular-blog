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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Chart, registerables } from 'chart.js';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomPreloadingStrategy } from './core/strategies/custom-preloading.strategy';

// Register all Chart.js components
Chart.register(...registerables);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
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

    NgxChartsModule,
    MessageService,
    MatDialogModule,

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