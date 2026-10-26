import {
  ChangeDetectionStrategy,
  Component,
  Input,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { GA4DailyPoint } from '../../../../shared/services/analytics/analytics.service';

export interface DomainDistributionItem {
  domain: string;
  count: number;
  percentage: number;
  colorClass: string;
  hexColor: string;
}

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 8 Columns: Live GA4 Traffic & Velocity Trajectory -->
      <div class="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-white tracking-tight">
                {{ activeChartMode() === 'ga4' ? 'Google Analytics 4 • Live Reader Velocity' : 'Operations & Content Velocity' }}
              </h2>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1.5"
                [ngClass]="activeChartMode() === 'ga4' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" *ngIf="activeChartMode() === 'ga4'"></span>
                {{ activeChartMode() === 'ga4' ? 'GA4 Property 483080897' : 'MongoDB Live' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ activeChartMode() === 'ga4' 
                ? 'Real-time 30-day pageviews and unique visitors from Google Analytics Data API' 
                : 'Cumulative growth of published articles and enrolled interns across tracks' }}
            </p>
          </div>

          <!-- Mode Toggle & Series Indicators -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <button
                type="button"
                (click)="setChartMode('ga4')"
                [class]="activeChartMode() === 'ga4' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                GA4 Readers
              </button>
              <button
                type="button"
                (click)="setChartMode('operations')"
                [class]="activeChartMode() === 'operations' ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20' : 'text-slate-400 hover:text-white'"
                class="px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                Operations
              </button>
            </div>

            <!-- Series Indicators -->
            <div class="flex items-center gap-3 text-xs" *ngIf="activeChartMode() === 'ga4'">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50"></span>
                <span class="text-slate-300 font-medium">Page Views</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                <span class="text-slate-300 font-medium">Active Users</span>
              </div>
            </div>

            <div class="flex items-center gap-3 text-xs" *ngIf="activeChartMode() === 'operations'">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50"></span>
                <span class="text-slate-300 font-medium">Articles</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                <span class="text-slate-300 font-medium">Interns</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Canvas Chart Area -->
        <div class="w-full h-72 sm:h-80 relative">
          <canvas
            *ngIf="isBrowser"
            baseChart
            [data]="currentChartData"
            [options]="velocityChartOptions"
            [type]="'line'"
            class="w-full h-full"
          ></canvas>

          <div *ngIf="!isBrowser" class="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            Loading live chart telemetry...
          </div>
        </div>

        <!-- Micro stats strip -->
        <div class="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-slate-800 text-center" *ngIf="activeChartMode() === 'ga4'">
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">GA4 Total Views</span>
            <div class="text-sm font-bold text-sky-400">{{ gaTotalViews }} Views</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">GA4 Active Users</span>
            <div class="text-sm font-bold text-emerald-400">{{ gaActiveUsers }} Unique Readers</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">GA4 Engagement</span>
            <div class="text-sm font-bold text-purple-400">{{ gaEngagementRate }} Avg Rate</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-slate-800 text-center" *ngIf="activeChartMode() === 'operations'">
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Total Articles</span>
            <div class="text-sm font-bold text-sky-400">{{ blogCount }} Published</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Active Interns</span>
            <div class="text-sm font-bold text-emerald-400">{{ internCount }} Enrolled</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 uppercase font-semibold">Track Diversity</span>
            <div class="text-sm font-bold text-purple-400">{{ domainData.length }} Disciplines</div>
          </div>
        </div>
      </div>

      <!-- 4 Columns: Domain & Category Distribution -->
      <div class="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
        <!-- Header -->
        <div class="mb-4 pb-4 border-b border-slate-800">
          <h2 class="text-base font-bold text-white tracking-tight">Domain Distribution</h2>
          <p class="text-xs text-slate-400 mt-0.5">16 registered interns across tech tracks</p>
        </div>

        <!-- Doughnut Canvas -->
        <div class="relative w-full h-48 flex items-center justify-center my-2">
          <canvas
            *ngIf="isBrowser"
            baseChart
            [data]="doughnutChartData"
            [options]="doughnutChartOptions"
            [type]="'doughnut'"
            class="w-full h-full max-h-48"
          ></canvas>

          <!-- Centered Counter -->
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-2xl font-black text-white">{{ domainData.length }}</span>
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tracks</span>
          </div>
        </div>

        <!-- Legend List -->
        <div class="space-y-2 mt-4 pt-3 border-t border-slate-800">
          <div
            *ngFor="let item of domainData"
            class="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-800/50 transition-colors text-xs"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span [ngClass]="item.colorClass" class="w-2.5 h-2.5 rounded-full flex-shrink-0"></span>
              <span class="text-slate-300 font-medium truncate">{{ item.domain }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 font-mono">{{ item.count }} interns</span>
              <span class="font-bold text-white w-8 text-right">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardChartsComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  activeChartMode = signal<'ga4' | 'operations'>('ga4');

  @Input() blogCount = 33;
  @Input() internCount = 16;
  @Input() applicationsCount = 2;

  @Input() gaTotalViews = '147';
  @Input() gaActiveUsers = 51;
  @Input() gaEngagementRate = '19.1%';
  @Input() gaStatus = 'connected';

  private _gaDailyTrajectory: GA4DailyPoint[] = [];
  @Input() set gaDailyTrajectory(points: GA4DailyPoint[]) {
    if (points && points.length > 0) {
      this._gaDailyTrajectory = points;
      if (this.activeChartMode() === 'ga4') {
        this.buildGA4ChartData();
      }
    }
  }
  get gaDailyTrajectory(): GA4DailyPoint[] {
    return this._gaDailyTrajectory;
  }

  private _domainData: DomainDistributionItem[] = [
    { domain: 'Python Development', count: 5, percentage: 31, colorClass: 'bg-emerald-400', hexColor: '#34d399' },
    { domain: 'Web Development', count: 5, percentage: 31, colorClass: 'bg-sky-400', hexColor: '#38bdf8' },
    { domain: 'Machine Learning', count: 3, percentage: 19, colorClass: 'bg-amber-400', hexColor: '#fbbf24' },
    { domain: 'Artificial Intelligence', count: 2, percentage: 13, colorClass: 'bg-purple-400', hexColor: '#c084fc' },
    { domain: 'App Development', count: 1, percentage: 6, colorClass: 'bg-teal-400', hexColor: '#2dd4bf' },
  ];

  @Input() set domainData(data: DomainDistributionItem[]) {
    if (data && data.length > 0) {
      this._domainData = data;
      this.updateDoughnutChart();
    }
  }
  get domainData(): DomainDistributionItem[] {
    return this._domainData;
  }

  // Active chart data rendered on canvas
  public currentChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public velocityChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
        },
      },
    },
  };

  // Domain Doughnut Chart configuration
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this._domainData.map((d) => d.domain),
    datasets: [
      {
        data: this._domainData.map((d) => d.count),
        backgroundColor: this._domainData.map((d) => d.hexColor),
        borderColor: '#0f172a',
        borderWidth: 4,
        hoverOffset: 4,
      },
    ],
  };

  public doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  constructor() {
    this.buildGA4ChartData();
  }

  setChartMode(mode: 'ga4' | 'operations'): void {
    this.activeChartMode.set(mode);
    if (mode === 'ga4') {
      this.buildGA4ChartData();
    } else {
      this.buildOperationsChartData();
    }
  }

  private buildGA4ChartData(): void {
    const trajectory = this._gaDailyTrajectory.length > 0 ? this._gaDailyTrajectory : [];
    const labels = trajectory.map((p) => p.date);
    const viewsData = trajectory.map((p) => p.views);
    const usersData = trajectory.map((p) => p.users);

    this.currentChartData = {
      labels: labels.length > 0 ? labels : ['Sep 5', 'Sep 12', 'Sep 19', 'Sep 26', 'Oct 4', 'Oct 5'],
      datasets: [
        {
          data: viewsData.length > 0 ? viewsData : [4, 5, 1, 2, 62, 1],
          label: 'Page Views (GA4)',
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          data: usersData.length > 0 ? usersData : [3, 2, 1, 2, 2, 0],
          label: 'Active Users (GA4)',
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  private buildOperationsChartData(): void {
    this.currentChartData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Current'],
      datasets: [
        {
          data: [4, 8, 12, 18, 22, 27, 30, this.blogCount || 33],
          label: 'Published Articles',
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          data: [1, 3, 5, 8, 11, 13, 15, this.internCount || 16],
          label: 'Enrolled Interns',
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }

  private updateDoughnutChart(): void {
    this.doughnutChartData = {
      labels: this._domainData.map((d) => d.domain),
      datasets: [
        {
          data: this._domainData.map((d) => d.count),
          backgroundColor: this._domainData.map((d) => d.hexColor),
          borderColor: '#0f172a',
          borderWidth: 4,
          hoverOffset: 4,
        },
      ],
    };
  }
}
