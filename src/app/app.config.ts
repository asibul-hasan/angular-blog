import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpLoaderInterceptor } from './http-loader-interceptor';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { provideAnimations } from '@angular/platform-browser/animations';

// Import Chart.js components
import { Chart, registerables } from 'chart.js';
import { MessageService } from 'primeng/api';

// Register all Chart.js components
Chart.register(...registerables);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([httpLoaderInterceptor])),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling()
    ),
    NgxChartsModule,
    MessageService,
  ],
};
