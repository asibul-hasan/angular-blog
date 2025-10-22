import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TrendingBlogsTableComponent } from '../../../shared/components/template/trending-blogs-table.component';
import { KpiCardComponent } from '../../../shared/components/template/kpi-card.component';
import { CategoryDistributionComponent } from '../../../shared/components/template/category-distribution.component';
import { TrafficEngagementComponent } from '../../../shared/components/template/traffic-engagement.component';
import { ImpressionsCategoryComponent } from '../../../shared/components/template/impressions-category.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TrendingBlogsTableComponent,
    KpiCardComponent,
    CategoryDistributionComponent,
    TrafficEngagementComponent,
    ImpressionsCategoryComponent,
  ],
  templateUrl: `./dashboard.component.html`,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
    }
  }
}
