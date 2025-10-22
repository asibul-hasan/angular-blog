import { PreloadAllModules, withPreloading } from '@angular/router';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { httpLoaderInterceptor } from './core/interceptors/http-loader.interceptor';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Chart, registerables } from 'chart.js';
import { MessageService } from 'primeng/api';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

// Register all Chart.js components
Chart.register(...registerables);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    // provideBrowserGlobalErrorListeners(), // Commented out for SSR compatibility
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ✅ HttpClient with fetch + interceptors for SSR
    provideHttpClient(
      withFetch(), // <--- add this
      withInterceptors([httpLoaderInterceptor])
    ),

    provideRouter(
      routes,
      withInMemoryScrolling(),
      withPreloading(PreloadAllModules)
    ),

    NgxChartsModule,
    MessageService,
    provideClientHydration(withEventReplay()),
  ],
};
