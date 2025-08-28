// app.routes.ts (No change needed here for this specific error)
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/public/public-module').then((m) => m.PublicModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./components/dashboard/dashboard-module').then(
        (m) => m.DashboardModule
      ),
  },
  { path: '**', redirectTo: '' },
];
