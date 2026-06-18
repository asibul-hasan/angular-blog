import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TrendingBlogsTableComponent } from '../../../shared/components/template/trending-blogs-table.component';
import { KpiCardComponent as KpiDashboardComponent } from '../../../shared/components/template/kpi-card.component';
import { CategoryDistributionComponent } from '../../../shared/components/template/category-distribution.component';
import { TrafficEngagementComponent } from '../../../shared/components/template/traffic-engagement.component';
import { ImpressionsCategoryComponent } from '../../../shared/components/template/impressions-category.component';

import { Router } from '@angular/router';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TrendingBlogsTableComponent,
    KpiDashboardComponent,
    CategoryDistributionComponent,
    TrafficEngagementComponent,
    ImpressionsCategoryComponent,
  ],
  templateUrl: `./dashboard.component.html`,
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush, // Added for consistency with rules
})
export class DashboardComponent {
  private userContext = inject(UserContextService);
  private router = inject(Router);

  constructor() {
    this.checkAccess();
  }

  private checkAccess() {
    const user = this.userContext.user();
    if (user.userRole === 'intern') {
      this.router.navigate(['/dashboard/intern/tasks']);
    }
  }
}
