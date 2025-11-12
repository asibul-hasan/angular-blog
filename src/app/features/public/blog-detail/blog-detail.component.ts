import { Component, Inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { SocialLinksService } from '../../../shared/services/social-links/social-links.service';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { SocialIcon } from '../../../shared/components/template/social-icon-card.component';
import { BlogCardComponent } from '../../../shared/components/template/blog-card.component';
import { BlogStoreService } from '../../../core/services/blog-store.service';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, SocialIcon, BlogCardComponent],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  blogId: string = '';
  blog: any = null;
  readTime: number = 0;
  socialLinks: any[] = [];

  // Featured blogs (from store)
  readonly allBlogs = computed(() => this.blogStore.blogs());
  readonly featuredBlogs = computed(() => {
    const current = this.blog;
    const all = this.allBlogs();
    if (!current) return all.slice(0, 3);
    // Filter out current blog and get 3 random blogs
    return all.filter((b: any) => b._id !== current._id && b.slug !== current.slug).slice(0, 3);
  });

  defaultImg =
    "'https://res.cloudinary.com/dfcir8epp/image/upload/v1755703537/FFFFFF_hi6y3z.svg'";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: BlogApiService,
    private socialLinksService: SocialLinksService,
    private seo: SeoService,
    private blogStore: BlogStoreService,
    private viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.socialLinks = this.socialLinksService.getSocialLinks();
  }




  ngOnInit() {
    // Scroll to top IMMEDIATELY on init (before API call)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    // Load featured blogs
    this.blogStore.loadBlogs();

    // Get blog slug from route
    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');
      if (slug) {
        this.loadBlog(slug);
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }

  loadBlog(slug: string) {
    // First, try to find blog in the store (instant load)
    const allBlogs = this.allBlogs();
    const cachedBlog = allBlogs.find((b: any) => b.slug === slug || b._id === slug);

    if (cachedBlog) {
      // Found in cache - instant load!
      this.blog = cachedBlog;
      this.updateBlogMetadata();
      return;
    }

    // Not in cache - fetch from API
    // Try by ID first (more reliable), then fallback to slug
    this.apiService.getBlogById(slug).subscribe({
      next: (res: any) => {
        if (res.body && res.body.length > 0) {
          this.blog = res.body[0];
          this.updateBlogMetadata();
        } else {
          // Try by slug as fallback
          this.tryLoadBySlug(slug);
        }
      },
      error: (err: any) => {
        console.warn('getBlogById failed, trying slug...', err);
        this.tryLoadBySlug(slug);
      },
    });
  }

  tryLoadBySlug(slug: string) {
    this.apiService.getBlogBySlug(slug).subscribe({
      next: (res: any) => {
        if (res.body && res.body.length > 0) {
          this.blog = res.body[0];
          this.updateBlogMetadata();
        } else {
          console.error('Blog not found');
          this.router.navigate(['/blog']);
        }
      },
      error: (err: any) => {
        console.error('Blog not found by slug either:', err);
        this.router.navigate(['/blog']);
      },
    });
  }

  updateBlogMetadata() {
    // Update SEO
    this.seo.updateTags({
      title: this.blog.title,
      description: this.blog.meta_description,
      image: this.blog.image ?? this.defaultImg,
      slug: this.blog.slug,
      type: 'article',
      author: this.blog.author,
      publishedDate: this.blog.publishedAt,
      modifiedDate: this.blog.updatedAt,
      tags: this.blog.tags,
    });

    this.calculateReadingTime(this.blog.blog_content);
  }
  calculateReadingTime(content: string) {
    const wpm = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wpm);
    return (this.readTime = minutes);
  }

  navigateToBlog(blog: any) {
    if (blog?.slug) {
      // Scroll to top immediately before navigation
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      this.router.navigate(['/blog', blog.slug]);
    }
  }
}
