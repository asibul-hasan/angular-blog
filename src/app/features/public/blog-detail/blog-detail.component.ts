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

import { NotFoundComponent } from '../../../shared/components/404/404.component';

export interface BlogFaq {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, BlogCardComponent, RouterLink, NotFoundComponent],
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
  readonly isNotFound = signal<boolean>(false);
  readonly readingProgress = signal<number>(0);
  readonly headings = signal<{id: string, text: string}[]>([]);
  readonly faqs = signal<BlogFaq[]>([]);
  
  private scrollSub?: Subscription;

  toggleFaq(index: number) {
    this.faqs.update(list =>
      list.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }

  // Featured / Related blogs (hydrated on browser)
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

    // Only load full blog list on browser to prevent 700KB TransferState bloat on SSR
    if (isPlatformBrowser(this.platformId)) {
      this.blogStore.loadBlogs();
    }
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
    // Try cache first if available
    const cached = this.allBlogs().find((b: any) => b.slug === id || b._id === id);
    if (cached) {
      this.isNotFound.set(false);
      this.setBlog(cached);
      return;
    }

    this.apiService.getBlogBySlug(id).subscribe({
      next: (res: any) => {
        if (res && res.body && res.body[0]) {
          this.isNotFound.set(false);
          this.setBlog(res.body[0]);
        } else {
          this.handleNotFound(id);
        }
      },
      error: () => {
        this.handleNotFound(id);
      }
    });
  }

  private handleNotFound(id: string) {
    this.isNotFound.set(true);
    this.blog.set(null);
    this.seo.updateTags({
      title: 'Article Not Found',
      description: 'The requested blog article could not be found.',
      url: `https://infoaidtech.net/blog/${id}`,
      type: 'website'
    });
  }

  private setBlog(data: any) {
    if (data && data.blog_content) {
      data.blog_content = this.processEmbeddedSchema(data.blog_content);
    }
    this.blog.set(data);
    this.updateSeo(data);
    this.extractHeadings(data.blog_content);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  private processEmbeddedSchema(content: string): string {
    const match = content.match(/<p>\s*(\{\s*"@context"[\s\S]*?\})\s*<\/p>/i);
    if (match) {
      try {
        const schemaJson = JSON.parse(match[1]);
        this.seo.addJsonLd(schemaJson, 'blog-faq');

        if (schemaJson['@type'] === 'FAQPage' && Array.isArray(schemaJson.mainEntity)) {
          const faqItems: BlogFaq[] = schemaJson.mainEntity
            .map((item: any, idx: number) => ({
              question: item.name || '',
              answer: item.acceptedAnswer?.text || '',
              isOpen: idx === 0
            }))
            .filter((f: BlogFaq) => f.question && f.answer);
          this.faqs.set(faqItems);
        }
      } catch (err) {
        console.warn('Failed to parse embedded schema JSON', err);
      }
      return content.replace(match[0], '');
    } else {
      this.faqs.set([]);
    }
    return content;
  }

  private updateSeo(data: any) {
    const rawDesc = data.meta_description || data.description || data.short_desc || '';
    const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);

    this.seo.updateTags({
      title: data.title,
      description: cleanDesc,
      image: data.image,
      slug: data.slug,
      type: 'article',
      author: data.author || 'InfoAidTech Team',
      publishedDate: data.createdAt || data.publishedAt,
      modifiedDate: data.updatedAt || data.publishedDate || data.createdAt,
      tags: data.tags || []
    });

    this.seo.addBreadcrumbs([
      { name: 'Home', url: 'https://infoaidtech.net/' },
      { name: 'Blog', url: 'https://infoaidtech.net/blog' },
      { name: data.title, url: `https://infoaidtech.net/blog/${data.slug}` }
    ]);
  }

  private extractHeadings(content: string) {
    if (!content) {
      this.headings.set([]);
      return;
    }
    const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
    const items: { id: string; text: string }[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      if (text) {
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, text });
      }
    }
    this.headings.set(items.slice(0, 10));
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
