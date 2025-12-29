import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/public/public-routing-module').then(
        (m) => m.PublicRoutingModule
      ),
    data: {
      preload: true, // Preload public routes for better performance
      preloadPriority: 'high', // High priority for immediate loading
      preloadDelay: 1000 // 1 second delay before preloading
    }
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard-routing.module').then(
        (m) => m.DashboardRoutingModule
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/404/404.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
