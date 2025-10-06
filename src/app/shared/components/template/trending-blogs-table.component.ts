import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trending-blogs-table',
  standalone: true,
  imports: [CommonModule],
  template: `<h3
      class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
    >
      Trending Blog Posts (Last 7 Days)
    </h3>

    <div class="overflow-x-auto">
      <table
        class="min-w-full text-left text-sm text-gray-600 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <thead
          class="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          <tr>
            <th scope="col" class="py-3 px-4 font-medium">Rank</th>
            <th scope="col" class="py-3 px-4 font-medium">Blog Title</th>
            <th scope="col" class="py-3 px-4 font-medium">Views</th>
            <th scope="col" class="py-3 px-4 font-medium">Engagement Rate</th>
            <th scope="col" class="py-3 px-4 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            *ngFor="let blog of trendingBlogs; let i = index"
            class="hover:bg-sky-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
          >
            <td class="py-3 px-4 font-semibold text-gray-900 dark:text-white">
              {{ i + 1 }}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-8 bg-gray-200 rounded-md flex-shrink-0"
                ></div>
                <span
                  class="font-medium hover:text-sky-600 transition-colors"
                  >{{ blog.title }}</span
                >
              </div>
            </td>
            <td class="py-3 px-4 text-gray-700 dark:text-gray-200">
              {{ blog.views | number }}
            </td>
            <td class="py-3 px-4">
              <span class="text-green-600 dark:text-green-400 font-medium">{{
                blog.engagementRate | percent
              }}</span>
            </td>
            <td class="py-3 px-4 text-right">
              <button
                class="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 text-xs font-medium"
              >
                View / Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
})
export class TrendingBlogsTableComponent implements OnInit {
  trendingBlogs: any[] = [];
  loading = true;
  error: string | null = null;

  //   constructor(private blogApiService: BlogApiService) {}

  ngOnInit(): void {
    // this.loadTrendingBlogs();
  }

  //   loadTrendingBlogs(): void {
  //     this.loading = true;
  //     this.error = null;
  //     this.blogApiService.getTrendingBlogs().subscribe({
  //       next: (response) => {
  //         this.trendingBlogs = response.body || [];
  //         this.loading = false;
  //       },
  //       error: (err) => {
  //         this.error = 'Failed to load trending blogs';
  //         this.loading = false;
  //         console.error('Error loading trending blogs:', err);
  //       },
  //     });
  //   }
}
