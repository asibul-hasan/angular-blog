import { Component, Inject, OnInit, PLATFORM_ID, computed, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlogCardComponent } from '../../../shared/components/template/blog-card.component';
import { BlogStoreService } from '../../../core/services/blog-store.service';
import { UpperSectionComponent } from '../../../shared/components/template/cards/page-upper-section.component';
import { Router } from '@angular/router';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { LoaderService } from '../../../shared/services/loader/loader.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, UpperSectionComponent, BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogList implements OnInit {
  // Selected category signal
  readonly selectedCategory = signal<number | null>(null);

  // Store references
  readonly allBlogs = computed(() => this.blogStore.blogs());
  readonly categories = computed(() => this.blogStore.categories());

  // Filtered blogs based on selected category
  readonly blogs = computed(() => {
    const category = this.selectedCategory();
    const allBlogs = this.allBlogs();

    if (category === null) {
      return allBlogs; // Show all blogs
    }

    // Filter blogs by category
    return allBlogs.filter((blog: any) => blog.categoryId === category || blog.category?.id === category);
  });

  // Featured blog (first blog or first in selected category)
  readonly featuredBlog = computed(() => {
    const filteredBlogs = this.blogs();
    return filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  });

  // Check if blogs are loading
  readonly isLoading = computed(() => this.allBlogs().length === 0);

  readonly buttonText = 'Read More';

  constructor(private readonly blogStore: BlogStoreService,
    private router: Router, private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object,
    private loader: LoaderService
  ) {

    let origin = '';

    if (isPlatformBrowser(this.platformId)) {
      // ✅ Only access `window` in the browser
      origin = window.location.origin;
    }

    // use meta services
    this.seo.updateTags({
      title: 'Insights on IT, Software & Digital Marketing Trends',
      description:
        'Stay updated with the latest insights, trends, and tips in software development, IT solutions, digital marketing, and tech innovations on the InfoAidTech blog.',
      image:
        'https://res.cloudinary.com/dfcir8epp/image/upload/v1755605323/Infoaidtech-logo_l5uyf9.png',
      slug: origin, // ✅ safe to pass (empty on server)
      type: 'website',
    });

  }

  ngOnInit() {
    // Load data on component initialization
    this.blogStore.loadBlogs();
    this.blogStore.loadCategories();
  }

  selectCategory(id: number | null) {
    this.selectedCategory.set(id);
  }

  // Helper to get category name by id
  getCategoryName(categoryId: number): string {
    const category = this.categories().find((cat: any) => cat.id === categoryId);
    return category?.name || 'Technology';
  }

  // Helper to get active blogs count for display
  getActiveBlogsCount(): number {
    return this.blogs().length;
  }

  // Count blogs by category
  countBlogsByCategory(categoryId: number): number {
    return this.allBlogs().filter(
      (blog: any) => blog.categoryId === categoryId || blog.category?.id === categoryId
    ).length;
  }

  // Format date helper
  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return d.toLocaleDateString('en-US', options);
  }

  // Navigate to blog detail
  navigateToBlog(blog: any) {
    // You can implement navigation logic here
    // For example: this.router.navigate(['/blog', blog.slug]);
    console.log('Navigate to blog:', blog);
  }

  // Track by function for better performance
  trackByBlogId(index: number, blog: any): any {
    return blog._id || blog.id || index;
  }

  // Load more blogs (pagination)
  loadMoreBlogs() {
    // Implement pagination logic here
    console.log('Load more blogs');
  }
}