import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BlogApiService } from '../../services/blog/blog.service';
import { BlogStoreService } from '../../../core/services/blog-store.service';

@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="kpi-grid">
    <!-- Card 1 - Total Blog Posts -->
    <div class="kpi-card kpi-card-purple">
      <div class="kpi-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="kpi-content">
        <div class="kpi-label">Total Blog Posts</div>
        <div class="kpi-value">{{ totalBlogPosts }}</div>
        <div class="kpi-footer">All Time Count</div>
      </div>
      <div class="kpi-glow kpi-glow-purple"></div>
    </div>

    <!-- Card 2 - Published Blogs -->
    <div class="kpi-card kpi-card-green">
      <div class="kpi-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="kpi-content">
        <div class="kpi-label">Published Blogs</div>
        <div class="kpi-value">{{ totalPublishedBlogs }}</div>
        <div class="kpi-footer">
          <span class="kpi-trend kpi-trend-up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            +3.2%
          </span>
          vs. last month
        </div>
      </div>
      <div class="kpi-glow kpi-glow-green"></div>
    </div>

    <!-- Card 3 - Drafts & Review -->
    <div class="kpi-card kpi-card-amber">
      <div class="kpi-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="kpi-content">
        <div class="kpi-label">Drafts & Review</div>
        <div class="kpi-value">{{ totalDrafts }}</div>
        <button class="kpi-button">Review Drafts →</button>
      </div>
      <div class="kpi-glow kpi-glow-amber"></div>
    </div>

    <!-- Card 4 - With Images -->
    <div class="kpi-card kpi-card-blue">
      <div class="kpi-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="kpi-content">
        <div class="kpi-label">With Images</div>
        <div class="kpi-value">{{ totalWithImages }}</div>
        <div class="kpi-progress">
          <div class="kpi-progress-label">{{ totalWithImagesPercentage.toFixed(1) }}% Ratio</div>
          <div class="kpi-progress-bar">
            <div class="kpi-progress-fill" [style.width.%]="totalWithImagesPercentage"></div>
          </div>
        </div>
      </div>
      <div class="kpi-glow kpi-glow-blue"></div>
    </div>

    <!-- Card 5 - Text-Only Posts -->
    <div class="kpi-card kpi-card-red">
      <div class="kpi-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="kpi-content">
        <div class="kpi-label">Text-Only Posts</div>
        <div class="kpi-value">{{ totalTextOnlyPosts }}</div>
        <div class="kpi-footer">{{ totalTextOnlyPostsPercentage.toFixed(1) }}% of Total</div>
      </div>
      <div class="kpi-glow kpi-glow-red"></div>
    </div>
  </div>
  
  <style>
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .kpi-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .kpi-card:hover::before {
      opacity: 1;
    }

    .kpi-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      transition: transform 0.4s ease;
    }

    .kpi-card:hover .kpi-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .kpi-card-purple .kpi-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }

    .kpi-card-green .kpi-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    }

    .kpi-card-amber .kpi-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
    }

    .kpi-card-blue .kpi-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    .kpi-card-red .kpi-icon {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    }

    .kpi-icon svg {
      color: white;
    }

    .kpi-content {
      position: relative;
      z-index: 1;
    }

    .kpi-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .kpi-footer {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 600;
    }

    .kpi-trend-up {
      color: #10b981;
    }

    .kpi-trend svg {
      width: 14px;
      height: 14px;
    }

    .kpi-button {
      margin-top: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .kpi-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(5px);
    }

    .kpi-progress {
      margin-top: 0.75rem;
    }

    .kpi-progress-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }

    .kpi-progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      overflow: hidden;
    }

    .kpi-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 10px;
      transition: width 1s ease;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    .kpi-glow {
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.3;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }

    .kpi-card:hover .kpi-glow {
      opacity: 0.5;
    }

    .kpi-glow-purple {
      background: #667eea;
      top: -20px;
      right: -20px;
    }

    .kpi-glow-green {
      background: #10b981;
      top: -20px;
      right: -20px;
    }

    .kpi-glow-amber {
      background: #f59e0b;
      top: -20px;
      right: -20px;
    }

    .kpi-glow-blue {
      background: #3b82f6;
      top: -20px;
      right: -20px;
    }

    .kpi-glow-red {
      background: #ef4444;
      top: -20px;
      right: -20px;
    }

    @media (max-width: 768px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }

      .kpi-value {
        font-size: 2rem;
      }
    }
  </style>`,
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

  constructor(
    private apiService: BlogApiService,
    private blogStore: BlogStoreService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.onload();
  }

  onload() {
    // Use BlogStoreService instead of direct API call
    this.blogStore.loadBlogs();
    this.blogs = this.blogStore.blogs();

    if (this.blogs.length === 0) {
      // If no blogs loaded yet, wait a bit and try again
      setTimeout(() => {
        this.blogs = this.blogStore.blogs();
        this.calculateMetrics();
      }, 100);
    } else {
      this.calculateMetrics();
    }
  }

  calculateMetrics() {
    // Calculate actual counts
    let totalBlogPosts = this.blogs.length;
    let totalPublishedBlogs = this.blogs.filter(
      (blog) => blog.isPublished
    ).length;
    let totalDrafts = this.blogs.filter((blog) => !blog.isPublished).length;
    let totalWithImages = this.blogs.filter((blog) => blog.image).length;
    let totalTextOnlyPosts = this.blogs.filter((blog) => !blog.image).length;
    let totalWithImagesPercentage = totalBlogPosts > 0 ? (totalWithImages / totalBlogPosts) * 100 : 0;
    let totalTextOnlyPostsPercentage = totalBlogPosts > 0 ? (totalTextOnlyPosts / totalBlogPosts) * 100 : 0;

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
