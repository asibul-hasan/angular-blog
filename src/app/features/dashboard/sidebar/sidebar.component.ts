import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, User } from '../../../shared/services/auth/auth.service';
import { Observable } from 'rxjs';
import { MENU_ITEMS, MenuItem } from './menu.config';

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

  // Module expansion tracking
  expandedModules: { [key: string]: boolean } = {};

  // Menu items
  menuItems = MENU_ITEMS;

  isBrowser = false;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentUser$ = this.authService.currentUser;
    this.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Initialize all modules as collapsed
    this.menuItems.forEach(item => {
      if (item.children) {
        this.expandedModules[item.id] = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isBrowser) return;

    const target = event.target as HTMLElement;
    const userMenuButton = target.closest('.user-menu-toggle');
    const userMenuDropdown = target.closest('.user-menu-dropdown');

    // Close menu if clicking outside both the button and dropdown
    if (!userMenuButton && !userMenuDropdown && this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
      this.cd.detectChanges();
    }
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
    this.cd.detectChanges();
  }

  // Toggle module expansion
  toggleModule(moduleId: string) {
    this.expandedModules[moduleId] = !this.expandedModules[moduleId];
  }

  // Check if a module should be shown (admin-only modules hidden for non-admins)
  shouldShowItem(item: MenuItem): boolean {
    if (item.requiresAdmin && !this.isAdmin) {
      return false;
    }
    return true;
  }
}