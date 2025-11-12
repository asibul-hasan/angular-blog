import { ChangeDetectionStrategy, Component, computed, input, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { BlogApiService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  template: `
    <div
      class="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 
             hover:border-pink-500/40 backdrop-blur-lg transition-all duration-500 hover:-translate-y-1 
             shadow-lg shadow-black/30 hover:shadow-pink-600/20 max-w-sm"
      aria-label="Blog Card"
    >
      <!-- Image -->
      <div class="relative h-56 overflow-hidden">
        <img
          ngSrc="{{ imgUrl() }}"
          alt="{{ title() }}"
          width="400"
          height="300"
          class="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"
        ></div>
      </div>

      <!-- Content -->
      <div class="p-5 flex flex-col grow text-gray-300">
        <h2
          class="text-xl font-semibold mb-2 text-white line-clamp-2 group-hover:text-pink-400 transition-colors"
        >
          {{ title() }}
        </h2>

        <p class="text-gray-400 text-sm grow line-clamp-3">{{ description() }}</p>

        <button
          type="button"
          (click)="onLinkClick()"
          class="mt-4 py-2 px-4 self-start rounded-lg bg-pink-600 text-white font-medium text-sm 
                 shadow-lg shadow-pink-500/20 hover:bg-pink-500 hover:shadow-pink-500/40 
                 focus:ring-2 focus:ring-pink-500/50 focus:outline-none active:scale-95 transition-all"
        >
          Read More →
        </button>
      </div>
    </div>
  `,
})
export class BlogCardComponent {
  // private readonly router = inject(Router);
  // private readonly api = inject(BlogApiService);

  constructor(private readonly api: BlogApiService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  readonly blog = input.required<any>();

  readonly imgUrl = computed(() =>
    this.blog()?.image ??
    'https://res.cloudinary.com/dfcir8epp/image/upload/v1755703537/FFFFFF_hi6y3z.svg'
  );

  readonly title = computed(() => this.blog()?.title ?? 'Untitled');
  readonly description = computed(() => {
    const desc = this.blog()?.short_desc ?? 'No description available';
    // Strip HTML tags and decode HTML entities to prevent hydration mismatch
    if (typeof desc === 'string') {
      // For SSR safety, use regex to strip tags and decode common entities
      let text = desc.replace(/<[^>]*>/g, ''); // Remove HTML tags

      // Decode common HTML entities
      text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&apos;/g, "'");

      return text.trim();
    }
    return desc;
  });
  readonly slug = computed(() => this.blog()?.slug ?? null);

  onLinkClick(): void {
    const slug = this.slug();
    if (slug) {
      // Scroll to top IMMEDIATELY before navigation
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      this.router.navigate([`/blog/${slug}`], {
        state: { blog: this.blog() },
      });
    } else {
      console.error('Blog slug is missing');
    }
  }
}
