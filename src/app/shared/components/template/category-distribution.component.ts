import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export interface CategoryMetric {
  name: string;
  postCount: number;
  views: number;
  performance: number; // Engagement Rate (0.0 to 1.0)
  color: string;
  colorClass: string;
}

export interface CategoryLegendItem {
  label: string;
  percentage: number;
  colorClass: string; // Tailwind class for the colored circle
}

@Component({
  selector: 'app-category-distribution',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div
      class="flex flex-col lg:flex-row items-center justify-between mb-6 border-b pb-4 border-gray-200 dark:border-gray-700"
    >
      <div
        class="w-full lg:w-1/2 h-48 relative flex items-center justify-center"
      >
        <canvas
          baseChart
          *ngIf="isBrowser"
          [data]="doughnutChartData"
          [type]="'doughnut'"
          [options]="doughnutChartOptions"
          class="w-full h-full"
        ></canvas>

        <div class="absolute text-center">
          <div class="text-4xl font-extrabold text-sky-600 dark:text-sky-400">
            12
          </div>
          <div
            class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Categories
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-6 space-y-2">
        <div
          class="flex items-center space-x-2"
          *ngFor="let item of categoryLegend"
        >
          <span [ngClass]="item.colorClass" class="w-3 h-3 rounded-full"></span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{
            item.label
          }}</span>
          <span
            class="ml-auto text-sm font-semibold text-gray-900 dark:text-white"
            >{{ item.percentage }}%</span
          >
        </div>
      </div>
    </div>
  `,
})
export class CategoryDistributionComponent {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  // Dummy Data Model
  // 1. Data Source (as defined in the previous response)
  categoryLegend: CategoryLegendItem[] = [
    { label: 'Tech & AI', percentage: 35, colorClass: 'bg-blue-500' },
    { label: 'Lifestyle', percentage: 25, colorClass: 'bg-amber-500' },
    { label: 'Finance', percentage: 15, colorClass: 'bg-emerald-500' },
    { label: 'Travel', percentage: 10, colorClass: 'bg-red-500' },
    { label: 'Other', percentage: 15, colorClass: 'bg-gray-500' },
  ];

  detailedCategories = [
    {
      name: 'Tech & AI',
      postCount: 250,
      views: 85000,
      performance: 0.72,
      color: '#3b82f6',
      colorClass: 'bg-blue-500',
    },
    {
      name: 'Lifestyle',
      postCount: 180,
      views: 45000,
      performance: 0.58,
      color: '#f59e0b',
      colorClass: 'bg-amber-500',
    },
    {
      name: 'Finance',
      postCount: 120,
      views: 65000,
      performance: 0.68,
      color: '#10b981',
      colorClass: 'bg-emerald-500',
    },
    {
      name: 'Travel',
      postCount: 95,
      views: 30000,
      performance: 0.45,
      color: '#ef4444',
      colorClass: 'bg-red-500',
    },
    {
      name: 'Other',
      postCount: 55,
      views: 15000,
      performance: 0.51,
      color: '#6b7280',
      colorClass: 'bg-gray-500',
    },
  ];

  // 2. [data]="doughnutChartData" DEFINITION
  // This object structures the data required by Chart.js (or ng2-charts).
  // Type: ChartData<'doughnut'> (adjust based on your actual library imports)
  doughnutChartData: any = {
    labels: this.detailedCategories.map((c) => c.name),
    datasets: [
      {
        data: this.detailedCategories.map((c) => c.postCount),
        backgroundColor: this.detailedCategories.map((c) => c.color),
        hoverBackgroundColor: this.detailedCategories.map((c) => c.color),
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'], // White borders for separation
        borderWidth: 5,
      },
    ],
  };

  // 3. [options]="doughnutChartOptions" DEFINITION
  // This object defines the visual and interactive settings for the chart.
  // Type: ChartOptions<'doughnut'> (adjust based on your actual library imports)
  doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to fit into the defined h-48 container
    plugins: {
      legend: {
        display: false, // We are using a custom HTML legend next to the chart
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937', // Dark background for tooltips
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        padding: 10,
        cornerRadius: 6,
      },
    },
    cutout: '80%', // Makes the hole large enough for the total count text
  };

  // The [type]="'doughnut'" is a static string and requires no TypeScript variable.

  constructor() {}

  ngOnInit(): void {
    // You could fetch data from the CMS/API here and then update
    // this.detailedCategories and this.doughnutChartData.
  }
}
