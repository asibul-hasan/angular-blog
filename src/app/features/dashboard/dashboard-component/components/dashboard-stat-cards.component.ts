import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface DashboardMetrics {
  activeInterns: number;
  internGrowth: string;
  pendingSubmissions: number;
  pendingSubmissionsUrgent: boolean;
  totalApplications: number;
  shortlistedCount: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: string;
  engagementRate: string;
}

@Component({
  selector: 'app-dashboard-stat-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Card 1: Active Interns -->
      <div class="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/30 p-5 shadow-lg shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Active Interns</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white tracking-tight mb-1">
            {{ metrics.activeInterns }}
          </div>
          <p class="text-xs text-slate-400 mb-3">Enrolled in 5 domains</p>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="text-emerald-400 font-bold flex items-center gap-1">
              <i class="fa-solid fa-arrow-trend-up text-[10px]"></i>
              {{ metrics.internGrowth }}
            </span>
            <span class="text-slate-500 text-[10px]">82% active</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full w-[82%] transition-all duration-1000"></div>
          </div>
        </div>
      </div>

      <!-- Card 2: Pending Task Reviews (Urgent) -->
      <div class="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 p-5 shadow-lg shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Pending Reviews</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-white tracking-tight">{{ metrics.pendingSubmissions }}</span>
            <span *ngIf="metrics.pendingSubmissions > 0" class="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">Needs Action</span>
            <span *ngIf="metrics.pendingSubmissions === 0" class="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">All Clear</span>
          </div>
          <p class="text-xs text-slate-400 mb-3">Tasks awaiting evaluation</p>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <a
            routerLink="/dashboard/intern-management/task-review"
            class="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5 transform duration-200"
          >
            <span>Review Queue</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
          <span class="text-[10px] text-slate-500">Live Queue</span>
        </div>
      </div>

      <!-- Card 3: Job Applications -->
      <div class="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/30 p-5 shadow-lg shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors"></div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Applicants</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-briefcase text-sm"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white tracking-tight mb-1">
            {{ metrics.totalApplications }}
          </div>
          <p class="text-xs text-slate-400 mb-3">Across active careers</p>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-sky-400 font-bold flex items-center gap-1">
            <i class="fa-solid fa-user-check text-[10px]"></i>
            {{ metrics.shortlistedCount }} Shortlisted
          </span>
          <a
            routerLink="/dashboard/job-management/job-applications"
            class="text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            View Pipeline
          </a>
        </div>
      </div>

      <!-- Card 4: Published Articles -->
      <div class="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/30 p-5 shadow-lg shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Content Library</span>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-newspaper text-sm"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white tracking-tight mb-1">
            {{ metrics.publishedBlogs }}
          </div>
          <p class="text-xs text-slate-400 mb-3">Articles published live</p>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-purple-400 font-bold flex items-center gap-1">
            <i class="fa-solid fa-pen-nib text-[10px]"></i>
            {{ metrics.draftBlogs }} In Review
          </span>
          <a
            routerLink="/dashboard/blog-management/blogs"
            class="text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            Browse
          </a>
        </div>
      </div>

      <!-- Card 5: Platform Traffic & Reach (Powered by Google Analytics 4) -->
      <div class="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/30 p-5 shadow-lg shadow-black/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors"></div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">GA4 Traffic</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live</span>
            </div>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-chart-column text-sm"></i>
            </div>
          </div>
          <div class="text-3xl font-black text-white tracking-tight mb-1">
            {{ metrics.totalViews }}
          </div>
          <p class="text-xs text-slate-400 mb-3">GA4 Property 483080897</p>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-teal-400 font-bold flex items-center gap-1">
            <i class="fa-solid fa-chart-line text-[10px]"></i>
            {{ metrics.engagementRate }}
          </span>
          <span class="text-[10px] text-slate-400 font-medium">51 Readers</span>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatCardsComponent {
  @Input() metrics: DashboardMetrics = {
    activeInterns: 16,
    internGrowth: '+100%',
    pendingSubmissions: 0,
    pendingSubmissionsUrgent: false,
    totalApplications: 2,
    shortlistedCount: 1,
    publishedBlogs: 33,
    draftBlogs: 0,
    totalViews: '147',
    engagementRate: '19.1%',
  };
}

