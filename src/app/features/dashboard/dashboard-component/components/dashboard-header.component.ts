import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type TimeframeFilter = '7d' | '30d' | '90d' | 'ytd';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800/80">
      <!-- Left: Welcome & Live Status -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">{{ userName || 'Admin' }}</span>
          </h1>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational
          </span>
        </div>
        <p class="text-slate-400 text-sm flex items-center gap-2">
          <span>Enterprise Management Overview</span>
          <span class="text-slate-600">•</span>
          <span class="text-slate-400">{{ todayFormatted }}</span>
          <span class="text-slate-600">•</span>
          <span class="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{{ userRole || 'Administrator' }}</span>
        </p>
      </div>

      <!-- Right: Timeframe Switcher & Quick Action -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Timeframe Pills -->
        <div class="inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            type="button"
            *ngFor="let opt of timeframeOptions"
            (click)="selectTimeframe(opt.id)"
            [class]="currentTimeframe === opt.id 
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
              : 'text-slate-400 hover:text-slate-200 font-medium'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Quick Create Dropdown Menu -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleMenu()"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <i class="fa-solid fa-plus text-sm"></i>
            <span>Quick Action</span>
            <i class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200" [class.rotate-180]="isMenuOpen()"></i>
          </button>

          <!-- Dropdown popup -->
          <div
            *ngIf="isMenuOpen()"
            (click)="isMenuOpen.set(false)"
            class="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <a
              routerLink="/dashboard/blog-management/blog/create"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-colors"
            >
              <div class="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <i class="fa-solid fa-newspaper text-xs"></i>
              </div>
              <div>
                <div>Write Blog Post</div>
                <div class="text-[10px] font-normal text-slate-400">Publish content & SEO guide</div>
              </div>
            </a>

            <a
              routerLink="/dashboard/job-management/job/create"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-colors"
            >
              <div class="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <i class="fa-solid fa-briefcase text-xs"></i>
              </div>
              <div>
                <div>Post Job Opening</div>
                <div class="text-[10px] font-normal text-slate-400">Recruit talent & interns</div>
              </div>
            </a>

            <a
              routerLink="/dashboard/intern-management/task-review"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-colors"
            >
              <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <i class="fa-solid fa-check-double text-xs"></i>
              </div>
              <div>
                <div>Review Submissions</div>
                <div class="text-[10px] font-normal text-slate-400">Approve domain tasks</div>
              </div>
            </a>

            <a
              routerLink="/dashboard/intern-management/list"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-colors"
            >
              <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i class="fa-solid fa-user-graduate text-xs"></i>
              </div>
              <div>
                <div>Track Interns</div>
                <div class="text-[10px] font-normal text-slate-400">View progress & batches</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent {
  @Input() userName = '';
  @Input() userRole = '';
  @Input() currentTimeframe: TimeframeFilter = '30d';
  @Output() timeframeChange = new EventEmitter<TimeframeFilter>();

  isMenuOpen = signal(false);

  timeframeOptions: { id: TimeframeFilter; label: string }[] = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'ytd', label: 'Year To Date' },
  ];

  get todayFormatted(): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  selectTimeframe(id: TimeframeFilter): void {
    this.currentTimeframe = id;
    this.timeframeChange.emit(id);
  }
}
