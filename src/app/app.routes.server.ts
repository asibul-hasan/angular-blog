import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:id',
    renderMode: RenderMode.Server, // SSR only (no prerendering)
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender, // all other routes prerender
  },
];
