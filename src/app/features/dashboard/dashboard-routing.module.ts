import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
// import { BlogEditComponent } from './blog-editor/blog-editor.component';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blog/create', component: BlogCreateComponent },
      // { path: 'blog/edit/:id', component: BlogEditComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'profile', component: UserProfileComponent },

      // Wildcard route for 404 handling
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
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
