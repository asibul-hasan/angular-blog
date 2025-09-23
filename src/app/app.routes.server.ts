import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { BlogApiService } from './shared/services/blog/blog';
import { firstValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
interface Blog {
  slug: string;
  // add other fields if needed
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const blogApiService = inject(BlogApiService);

      try {
        const res = await firstValueFrom<HttpResponse<Blog[]>>(
          blogApiService.getBlogs()
        );

        const blogs = res.body ?? [];

        // Filter out blogs with invalid slugs
        const validParams = blogs
          .filter(
            (blog) =>
              blog.slug &&
              typeof blog.slug === 'string' &&
              blog.slug.trim().length > 0
          )
          .map((blog) => ({ id: blog.slug }));

        console.log(`Generated ${validParams.length} valid blog routes`);
        return validParams;
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
