import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { BlogApiService } from './shared/services/blog/blog';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const blogApiService = inject(BlogApiService);
      try {
        const response = await blogApiService.getBlogs().toPromise();
        return response?.data?.map((blog: any) => ({ id: blog._id })) ?? [];
      } catch (err) {
        console.error('❗ Failed to fetch blog IDs', err);
        return [];
      }
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
