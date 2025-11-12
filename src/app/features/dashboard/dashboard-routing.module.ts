import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { AdminGuard } from '../../core/guards/admin.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      {
        path: 'blog-management',
        loadChildren: () => import('./modules/blog-management/blog-management.routes').then(m => m.BLOG_MANAGEMENT_ROUTES)
      },
      {
        path: 'job-management',
        loadChildren: () => import('./modules/job-management/job-management.routes').then(m => m.JOB_MANAGEMENT_ROUTES)
      },
      {
        path: 'user-management',
        loadChildren: () => import('./modules/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      },
      // Wildcard route for 404 handling - should show a proper 404 page instead of redirecting
      {
        path: '**',
        loadComponent: () =>
          import('../../shared/components/404/404.component').then(m => m.NotFoundComponent)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }


// import { Routes } from '@angular/router';

// export const dashboardRoutes: Routes = [
//   {
//     path: '',
//     loadComponent: () =>
//       import('./dashboard-layout/dashboard-layout.component')
//         .then(c => c.DashboardLayoutComponent),
//     children: [
//       {
//         path: '',
//         loadComponent: () =>
//           import('./dashboard-component/dashboard.component')
//             .then(c => c.DashboardComponent),
//         pathMatch: 'full',
//       },
//       {
//         path: 'dashboard',
//         loadComponent: () =>
//           import('./dashboard-component/dashboard.component')
//             .then(c => c.DashboardComponent),
//       },
//       {
//         path: 'blogs',
//         loadComponent: () => import('./blogs/blogs.component').then(c => c.BlogsComponent),
//       },
//       {
//         path: 'blog/create',
//         loadComponent: () =>
//           import('./blog-create/blog-create.component').then(c => c.BlogCreateComponent),
//       },
//       {
//         path: 'blog/edit/:id',
//         loadComponent: () =>
//           import('./blog-edit/blog-edit.component').then(c => c.BlogEditComponent),
//       },
//       {
//         path: 'categories',
//         loadComponent: () =>
//           import('./categories/categories.component').then(c => c.CategoriesComponent),
//       },
//       {
//         path: 'profile',
//         loadComponent: () =>
//           import('./user-profile/user-profile.component').then(c => c.UserProfileComponent),
//       },
//       {
//         path: '**',
//         redirectTo: 'dashboard',
//       },
//     ],
//   },
// ];
