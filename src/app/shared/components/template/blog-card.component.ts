import { ChangeDetectionStrategy, Component, computed, input, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { BlogApiService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-blog-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NgOptimizedImage],
  template: `
    <div
      (click)="onLinkClick()"
      class="group relative flex flex-col overflow-hidden rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer h-full"
      style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06)"
      aria-label="Blog Card"
    >
      <!-- Hover Glow -->
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px] z-0"
           style="background:linear-gradient(140deg,rgba(247,97,121,0.08),transparent)"></div>

      <!-- Image Container -->
      <div class="relative h-64 overflow-hidden z-10 m-2 rounded-[24px]">
        <img
          [ngSrc]="imgUrl()"
          [alt]="title()"
          fill
          class="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
        />
        <div class="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
           <span class="px-3 py-1 bg-[#f76179]/90 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
              {{ categoryName() }}
           </span>
        </div>
      </div>

      <!-- Content -->
      <div class="px-8 pb-8 pt-4 flex flex-col flex-1 z-10">
        <!-- Date & Read Time -->
        <div class="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          <span>{{ publishedAt() }}</span>
          <span class="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
          <span>{{ blog()?.readTime || 5 }} min</span>
        </div>

        <h3
          class="text-2xl font-black mb-4 text-white leading-[1.2] tracking-tight group-hover:text-[#f76179] transition-colors line-clamp-2"
        >
          {{ title() }}
        </h3>

        <p class="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
          {{ description() }}
        </p>

        <!-- Footer -->
        <div class="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#f76179] to-[#1e3e62] flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-[#f76179]/20">IA</div>
            <span class="text-xs font-bold text-gray-300">InfoAidTech</span>
          </div>
          <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#f76179] group-hover:border-[#f76179] transition-colors shadow-lg">
            <svg class="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlogCardComponent {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly blog = input.required<any>();

  readonly imgUrl = computed(() =>
    this.blog()?.image ??
    'https://res.cloudinary.com/dfcir8epp/image/upload/v1755703537/FFFFFF_hi6y3z.svg'
  );

  readonly title = computed(() => this.blog()?.title ?? 'Untitled Protocol');
  
  readonly publishedAt = computed(() => {
    const raw = this.blog()?.publishedAt || this.blog()?.createdAt;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  });

  readonly categoryName = computed(() => this.blog()?.category?.name || 'Technology');

  readonly description = computed(() => {
    const desc = this.blog()?.short_desc ?? this.blog()?.description ?? 'No data provided';
    if (typeof desc === 'string') {
      let text = desc.replace(/<[^>]*>/g, '');
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
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      this.router.navigate([`/blog/${slug}`]);
    }
  }
}
