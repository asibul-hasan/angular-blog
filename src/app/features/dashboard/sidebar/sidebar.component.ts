import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// import { LoaderComponent } from '../../../shared/components/template/loader.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { startWith } from 'rxjs/operators';
import { AuthService, User } from '../../../shared/services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  currentUser: User | null = null;

  isSidebarExpanded = false;
  isUserMenuOpen = false;
  // isLoading$;

  isBrowser = false;

  constructor(
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Ensure the observable has an initial value
    // this.isLoading$ = this.loaderService.isLoading$.pipe(startWith(false));
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentUser$ = this.authService.currentUser;
    this.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get userInitials(): string {
    if (!this.currentUser?.name) return 'U';
    if (!this.currentUser?.email) return 'U';
    const names = this.currentUser.name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
