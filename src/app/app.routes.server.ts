import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'blog/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'careers/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'internship/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
