// import { Routes } from '@angular/router';
// import { LoginPage } from './auth/login/login';

// export const appRoutes: Routes = [
//   { path: 'login', component: LoginPage },
//   {
//     path: 'dashboard',
//     loadChildren: () => import('./dashboard/dashboard-routing').then(m => m.routes)
//   },
//   // {
//   //   path: '',
//   //   loadChildren: () => import('./public/public-routing').then(m => m.routes)
//   // }
// ];
import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './public/public-routing';

export const routes: Routes = [
  {
    path: '',
    children: PUBLIC_ROUTES,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard-routing').then((m) => m.DASHBOARD_ROUTES),
  },
];
