import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-impressions-category',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div class="w-full h-full flex items-center justify-center">
      <canvas *ngIf="isBrowser" id="impressionsPie"></canvas>
    </div>
  `,
})
export class ImpressionsCategoryComponent implements OnInit {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (!this.isBrowser) return;

    // ✅ Lazy import Chart.js in the browser only
    const { Chart } = await import('chart.js/auto');

    const ctx = document.getElementById('impressionsPie') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Technology', 'Health', 'Travel', 'Finance', 'Food'],
        datasets: [
          {
            data: [300, 150, 100, 200, 120],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#9ca3af' },
          },
        },
      },
    });
  }
}
