import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BlogApiService } from '../../services/blog/blog.service';

@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="grid sm:grid-cols-5 lg:grid-cols-5 gap-6">
    <!-- Card 1 -->
    <div
      class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-indigo-500 transition duration-300 hover:shadow-2xl"
    >
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Total Blog Posts
      </div>
      <div class="flex items-center justify-between mt-1">
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">
          {{ totalBlogPosts }}
        </div>
        <svg
          class="h-10 w-10 text-indigo-500/10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        ></svg>
      </div>
      <div class="text-xs text-gray-400 mt-2">All Time Count</div>
    </div>

    <!-- Card 2 -->
    <div
      class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-green-500 transition duration-300 hover:shadow-2xl"
    >
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Published Blogs
      </div>
      <div class="flex items-center justify-between mt-1">
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">
          {{ totalPublishedBlogs }}
        </div>
        <span class="text-sm text-green-500 font-semibold flex items-center">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          ></svg>
          +3.2%
        </span>
      </div>
      <div class="text-xs text-gray-400 mt-2">vs. last month</div>
    </div>

    <!-- Card 3 -->
    <div
      class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-amber-500 transition duration-300 hover:shadow-2xl"
    >
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Drafts & Review
      </div>
      <div class="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
        {{ totalDrafts }}
      </div>
      <button
        class="mt-3 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 px-3 rounded-lg transition-colors"
      >
        Review Drafts
      </button>
    </div>

    <!-- Card 4 -->
    <div
      class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-sky-500 transition duration-300 hover:shadow-2xl"
    >
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        With Images
      </div>
      <div class="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
        {{ totalWithImages }}
      </div>
      <div class="mt-2">
        <div class="text-xs text-sky-600 dark:text-sky-400 font-semibold mb-1">
          {{ totalWithImagesPercentage.toFixed(2) }}% Ratio
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            class="h-2 rounded-full bg-sky-500"
            [ngStyle]="{ width: totalWithImagesPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Card 5 -->
    <div
      class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-red-500 transition duration-300 hover:shadow-2xl"
    >
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Text-Only Posts
      </div>
      <div class="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
        {{ totalTextOnlyPosts }}
      </div>
      <div class="text-xs text-red-500 mt-3">
        {{ totalTextOnlyPostsPercentage.toFixed(2) }}% of Total
      </div>
    </div>
  </div> `,
})
export class KpiCardComponent implements OnInit {
  totalBlogPosts: number = 0;
  blogs: any[] = [];
  totalPublishedBlogs: number = 0;
  totalDrafts: number = 0;
  totalWithImages: number = 0;
  totalWithImagesPercentage: number = 0;
  totalTextOnlyPosts: number = 0;
  totalTextOnlyPostsPercentage: number = 0;
  publishedPercentageCurVsPrevMonth: number = 0;

  constructor(private apiService: BlogApiService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.onload();
  }

  onload() {
    this.apiService.getBlogs().subscribe((data: any) => {
      this.blogs = data.body;

      // Calculate actual counts
      let totalBlogPosts = this.blogs.length;
      let totalPublishedBlogs = this.blogs.filter(
        (blog) => blog.isPublished
      ).length;
      let totalDrafts = this.blogs.filter((blog) => !blog.isPublished).length;
      let totalWithImages = this.blogs.filter((blog) => blog.image).length;
      let totalTextOnlyPosts = this.blogs.filter((blog) => !blog.image).length;
      let totalWithImagesPercentage = (totalWithImages / totalBlogPosts) * 100;
      let totalTextOnlyPostsPercentage =
        (totalTextOnlyPosts / totalBlogPosts) * 100;

      if (isPlatformBrowser(this.platformId)) {
        // Animate all counts
        this.animateCount(totalBlogPosts, 'totalBlogPosts', 1000);
        this.animateCount(totalPublishedBlogs, 'totalPublishedBlogs', 1000);
        this.animateCount(totalDrafts, 'totalDrafts', 1000);
        this.animateCount(totalWithImages, 'totalWithImages', 1000);
        this.animateCount(totalTextOnlyPosts, 'totalTextOnlyPosts', 1000);
        this.animateCount(
          totalWithImagesPercentage,
          'totalWithImagesPercentage',
          1000
        );
        this.animateCount(
          totalTextOnlyPostsPercentage,
          'totalTextOnlyPostsPercentage',
          1000
        );
        this.animateCount(
          this.publishedPercentageCurVsPrevMonth,
          'publishedPercentageCurVsPrevMonth',
          1000
        );
      }
    });
  }

  animateCount(target: number, displayVar: string, duration: number) {
    let start = 0;
    const stepTime = 16; // ~60fps
    const increment = target / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(counter);
      }
      // Dynamically update the right display variable
      (this as any)[displayVar] = Math.floor(start);
    }, stepTime);
  }
}
