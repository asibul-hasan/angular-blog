import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GA4TopPage, GA4TrafficSource } from '../../../../shared/services/analytics/analytics.service';

export interface TrendingArticle {
  id: string;
  rank: number;
  title: string;
  category: string;
  views: number;
  engagementRate: number;
  slug?: string;
}

export interface UserSessionTelemetry {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  loginTime: string;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard-telemetry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 6 Columns: Top Pages & Traffic Channels (Live GA4) -->
      <div class="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-bold text-white tracking-tight">Content Impressions & Reach</h2>
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">GA4 Live</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Top performing routes and traffic acquisition sources</p>
            </div>

            <!-- Tab Switcher -->
            <div class="inline-flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <button
                type="button"
                (click)="activeContentTab.set('pages')"
                [class]="activeContentTab() === 'pages' ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                Top Pages
              </button>
              <button
                type="button"
                (click)="activeContentTab.set('sources')"
                [class]="activeContentTab() === 'sources' ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                Traffic Channels
              </button>
              <button
                type="button"
                (click)="activeContentTab.set('articles')"
                [class]="activeContentTab() === 'articles' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                Blog Posts
              </button>
            </div>
          </div>

          <!-- Content Tab 1: Top Pages from GA4 -->
          <div *ngIf="activeContentTab() === 'pages'">
            <div *ngIf="topPages.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left text-xs divide-y divide-slate-800">
                <thead>
                  <tr class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th class="py-2 px-3 font-semibold w-8">#</th>
                    <th class="py-2 px-3 font-semibold">Page / Application</th>
                    <th class="py-2 px-3 font-semibold text-right">Views (GA4)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let page of topPages" class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-2.5 px-3 font-bold text-slate-400">
                      <span class="w-5 h-5 rounded-md flex items-center justify-center text-[10px]" [ngClass]="{
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30': page.rank === 1,
                        'bg-slate-700/50 text-slate-300': page.rank === 2,
                        'bg-amber-800/30 text-amber-500': page.rank === 3,
                        'text-slate-500': page.rank > 3
                      }">
                        {{ page.rank }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3">
                      <div class="font-bold text-white max-w-[280px] sm:max-w-md truncate hover:text-purple-300 transition-colors">
                        {{ page.title }}
                      </div>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-sky-400">
                      {{ page.views | number }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="topPages.length === 0" class="py-8 text-center text-slate-400 text-xs">
              Synchronizing top page reports from GA4...
            </div>
          </div>

          <!-- Content Tab 2: Traffic Acquisition Channels from GA4 -->
          <div *ngIf="activeContentTab() === 'sources'">
            <div *ngIf="trafficSources.length > 0" class="space-y-3 py-1">
              <div
                *ngFor="let ch of trafficSources"
                class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <i [class]="ch.source === 'Direct' ? 'fa-solid fa-arrow-pointer text-sky-400' : ch.source.includes('Search') ? 'fa-solid fa-magnifying-glass text-emerald-400' : 'fa-solid fa-link text-purple-400'"></i>
                    <span class="font-bold text-white">{{ ch.source }} Traffic</span>
                  </div>
                  <div class="flex items-center gap-3 text-slate-300">
                    <span class="font-mono">{{ ch.users }} visitors</span>
                    <span class="font-mono text-sky-400">{{ ch.views }} views</span>
                    <span class="font-bold text-white">{{ ch.percentage }}%</span>
                  </div>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    class="h-1.5 rounded-full transition-all duration-700"
                    [ngClass]="ch.source === 'Direct' ? 'bg-sky-400' : ch.source.includes('Search') ? 'bg-emerald-400' : 'bg-purple-400'"
                    [style.width.%]="ch.percentage"
                  ></div>
                </div>
              </div>
            </div>

            <div *ngIf="trafficSources.length === 0" class="py-8 text-center text-slate-400 text-xs">
              Fetching traffic acquisition channels from GA4...
            </div>
          </div>

          <!-- Content Tab 3: Blog Posts from MongoDB -->
          <div *ngIf="activeContentTab() === 'articles'">
            <div *ngIf="trendingArticles.length > 0" class="overflow-x-auto">
              <table class="min-w-full text-left text-xs divide-y divide-slate-800">
                <thead>
                  <tr class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                    <th class="py-2 px-3 font-semibold w-8">#</th>
                    <th class="py-2 px-3 font-semibold">Article Title</th>
                    <th class="py-2 px-3 font-semibold">Category</th>
                    <th class="py-2 px-3 font-semibold text-right">Views</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  <tr *ngFor="let article of trendingArticles" class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-2.5 px-3 font-bold text-slate-400">
                      {{ article.rank }}
                    </td>
                    <td class="py-2.5 px-3">
                      <div class="font-bold text-white max-w-[200px] truncate hover:text-purple-300 transition-colors">
                        {{ article.title }}
                      </div>
                    </td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {{ article.category }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-200">
                      {{ article.views | number }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="trendingArticles.length === 0" class="py-8 text-center text-slate-400 text-xs">
              Loading 33 published articles from MongoDB Atlas...
            </div>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Google Analytics 4 Data API • Property 483080897</span>
          </div>
          <a
            routerLink="/dashboard/blog-management/blogs"
            class="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            All 33 Blogs →
          </a>
        </div>
      </div>

      <!-- 6 Columns: Security & Active Sessions Telemetry -->
      <div class="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 class="text-base font-bold text-white tracking-tight">Active Sessions & Security</h2>
              <p class="text-xs text-slate-400 mt-0.5">Admin access telemetry and authenticated nodes</p>
            </div>
            <a
              routerLink="/dashboard/settings/user-access-management"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Access Matrix →
            </a>
          </div>

          <div class="space-y-3">
            <div
              *ngFor="let session of sessions"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-all text-xs"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" [ngClass]="session.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'">
                  <i [class]="session.device.includes('Mac') || session.device.includes('Linux') || session.device.includes('Windows') ? 'fa-solid fa-laptop text-sm' : 'fa-solid fa-mobile-screen text-sm'"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-white">{{ session.browser }} on {{ session.device }}</span>
                    <span
                      *ngIf="session.isActive"
                      class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      Current Node
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span class="font-mono">{{ session.ipAddress }}</span>
                    <span>•</span>
                    <span>{{ session.location }}</span>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <div class="text-[10px] text-slate-400">{{ session.loginTime }}</div>
                <div class="text-[10px] font-semibold" [ngClass]="session.isActive ? 'text-emerald-400' : 'text-slate-500'">
                  {{ session.isActive ? 'Active Now' : 'Expired' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 text-slate-400">
            <i class="fa-solid fa-shield-halved text-emerald-400"></i>
            <span>TLS 1.3 · Encrypted JWT Cookie</span>
          </div>
          <a
            routerLink="/dashboard/user-management/my-profile"
            class="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Session Settings
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTelemetryComponent {
  activeContentTab = signal<'pages' | 'sources' | 'articles'>('pages');

  @Input() topPages: GA4TopPage[] = [];
  @Input() trafficSources: GA4TrafficSource[] = [];
  @Input() trendingArticles: TrendingArticle[] = [];
  @Input() sessions: UserSessionTelemetry[] = [];
}
