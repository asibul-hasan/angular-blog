import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-traffic-engagement',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  template: `
    <div class="w-full h-full" *ngIf="isBrowser">
      <canvas
        baseChart
        [data]="lineChartData"
        [options]="lineChartOptions"
        chartType="line"
      ></canvas>
    </div>
    <div *ngIf="!isBrowser" class="text-gray-400 text-center">
      Chart is not rendered on the server
    </div>
  `,
})
export class TrafficEngagementComponent {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Day 1',
      'Day 5',
      'Day 10',
      'Day 15',
      'Day 20',
      'Day 25',
      'Day 30',
    ],
    datasets: [
      {
        data: [120, 200, 180, 250, 300, 280, 350],
        label: 'Page Views',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [50, 80, 70, 90, 110, 100, 130],
        label: 'Engagements',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' },
      },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' } },
      y: { ticks: { color: '#9ca3af' } },
    },
  };
}
