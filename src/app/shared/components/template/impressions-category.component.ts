import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-impressions-category',
  standalone: true,
  imports: [BaseChartDirective],
  template: `<div class="w-full h-full flex items-center justify-center">
    <canvas
      baseChart
      [data]="pieChartData"
      [options]="pieChartOptions"
      chartType="pie"
    >
    </canvas>
  </div> `,
})
export class ImpressionsCategoryComponent {
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
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
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af' },
      },
    },
  };
}
