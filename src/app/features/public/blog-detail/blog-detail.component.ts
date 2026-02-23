import {
  Component, inject, signal, computed, PLATFORM_ID, AfterViewInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { BlogCardComponent } from '../../../shared/components/template/blog-card.component';
import { BlogStoreService } from '../../../core/services/blog-store.service';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, BlogCardComponent, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(BlogApiService);
  private readonly seo = inject(SeoService);
  private readonly blogStore = inject(BlogStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly blog = signal<any>(null);
  readonly readingProgress = signal<number>(0);
  readonly headings = signal<{id: string, text: string}[]>([]);
  
  private scrollSub?: Subscription;

  // Featured / Related blogs
  readonly allBlogs = computed(() => this.blogStore.blogs());
  readonly relatedBlogs = computed(() => {
    const current = this.blog();
    if (!current) return this.allBlogs().slice(0, 3);
    return this.allBlogs()
      .filter((b: any) => b._id !== current._id && b.slug !== current.slug)
      .slice(0, 3);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBlogData(id);
      }
    });
    this.blogStore.loadBlogs();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollSub = fromEvent(window, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          this.calculateProgress();
        });
    }
  }

  ngOnDestroy() {
    this.scrollSub?.unsubscribe();
  }

  private loadBlogData(id: string) {
    // Try cache first
    const cached = this.allBlogs().find((b: any) => b.slug === id || b._id === id);
    if (cached) {
      this.setBlog(cached);
      return;
    }

    this.apiService.getBlogBySlug(id).subscribe({
      next: (res: any) => {
        if (res.body && res.body[0]) {
          this.setBlog(res.body[0]);
        }
      }
    });
  }

  private setBlog(data: any) {
    this.blog.set(data);
    this.updateSeo(data);
    this.extractHeadings(data.blog_content);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  private updateSeo(data: any) {
    this.seo.updateTags({
      title: data.title,
      description: data.meta_description || data.short_desc,
      image: data.image,
      slug: data.slug,
      type: 'article',
      author: data.author,
      publishedDate: data.publishedAt
    });
  }

  private extractHeadings(content: string) {
    // Simple mock logic for TOC
    const headings = [
      { id: 'intro', text: 'Introduction' },
      { id: 'key-concepts', text: 'Key Concepts' },
      { id: 'strategy', text: 'Future Strategy' },
      { id: 'conclusion', text: 'Conclusion' }
    ];
    this.headings.set(headings);
  }

  private calculateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    this.readingProgress.set(Math.min(100, Math.max(0, progress)));
  }

  getCategoryName(id: string): string {
    return 'Technology'; // Fallback
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  navigateToBlog(blog: any) {
    this.router.navigate(['/blog', blog.slug]);
  }
}
