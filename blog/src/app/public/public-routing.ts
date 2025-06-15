import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list').then(m => m.BlogList)
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./blog-detail/blog-detail').then(m => m.BlogDetail)
  }
];
