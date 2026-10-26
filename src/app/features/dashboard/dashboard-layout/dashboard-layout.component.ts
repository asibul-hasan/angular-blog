import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component'; 
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  standalone: true,
  imports: [RouterModule, SidebarComponent, CommonModule],
})
export class DashboardLayoutComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public userContext = inject(UserContextService);
  private router = inject(Router);

  ngOnInit(): void {
    // Automatically close mobile menu on route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.layoutService.closeMobileMenu();
      });
  }

  get userInitials(): string {
    const user = this.userContext.user();
    if (!user || !user.userName) return 'U';
    const names = user.userName.trim().split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
}

