import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  HostListener,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { LayoutService } from '../../../core/services/layout.service';
import {
  getSidebarTree,
  getBreadcrumb,
  getScreenByFormId,
  HOME_FORM_ID,
  SidebarModule,
  SidebarSubModule,
  SystemScreen,
} from './menu.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class SidebarComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public userContextService = inject(UserContextService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly sidebarModules: readonly SidebarModule[] = getSidebarTree();
  readonly homeScreen = getScreenByFormId(HOME_FORM_ID);

  readonly searchTerm = signal('');
  readonly isFlyoutOpen = signal(false);
  readonly selectedModuleId = signal<string>('INT');
  private readonly previewModuleId = signal<string | null>(null);
  private readonly collapsedSubmodules = signal<Record<string, boolean>>({});
  readonly isUserDropdownOpen = signal(false);

  // Reactive URL signal keeping sidebar states synchronized across reloads and client navigation
  readonly currentUrl = signal<string>('/');

  isBrowser = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser && typeof window !== 'undefined' && window.location) {
      const browserUrl = window.location.pathname + window.location.search;
      if (browserUrl && browserUrl !== '/') {
        this.currentUrl.set(browserUrl);
        const breadcrumb = getBreadcrumb(browserUrl);
        if (breadcrumb) {
          this.selectedModuleId.set(breadcrumb.module.module_code);
        }
      }
    }
  }

  readonly collapsed = computed(() => !this.layoutService.isSidebarExpanded());

  readonly activeBranchName = computed(() => 'InfoAidTech HQ');

  readonly isHomeActive = computed(() => {
    const clean = this.currentUrl().split('?')[0].replace(/\/+$/, '');
    return clean === '' || clean === '/' || clean === '/dashboard';
  });

  readonly selectedModule = computed<SidebarModule | null>(() => {
    const modules = this.sidebarModules;
    if (!modules.length) return null;

    const previewId = this.collapsed() && this.isFlyoutOpen()
      ? this.previewModuleId()
      : null;
    const currentId = previewId ?? this.selectedModuleId();
    return modules.find((m) => m.module_code === currentId) ?? modules[0];
  });

  readonly shouldShowPanel = computed(() => !this.collapsed() || this.isFlyoutOpen());

  readonly isAllExpanded = computed(() => {
    const mod = this.selectedModule();
    if (!mod) return true;
    const collapsed = this.collapsedSubmodules();
    return !mod.sub_modules.some((sub) => !!collapsed[sub.key]);
  });

  readonly filteredSubmodules = computed<SidebarSubModule[]>(() => {
    const mod = this.selectedModule();
    if (!mod) return [];

    const term = this.searchTerm().toLowerCase().trim();

    return mod.sub_modules
      .map((sub) => {
        const allowedScreens = sub.screens.filter((s) => this.canAccessScreen(s));
        const matchingScreens = allowedScreens.filter(
          (s) =>
            !term ||
            s.title.toLowerCase().includes(term) ||
            s.form_id.toLowerCase().includes(term) ||
            (s.description && s.description.toLowerCase().includes(term))
        );
        return {
          ...sub,
          screens: matchingScreens,
        };
      })
      .filter((sub) => sub.screens.length > 0);
  });

  get userName(): string {
    const name = this.userContextService.user()?.userName;
    return name && name !== 'Guest' ? name : 'Asibul Hasan';
  }

  get userEmail(): string {
    const email = this.userContextService.user()?.email;
    return email || 'asibulhasan23@gmail.com';
  }

  get userRole(): string {
    if (this.isAdmin) return 'Administrator';
    const role = this.userContextService.user()?.userRole;
    if (role === 'intern') return 'Intern Member';
    return role ? role.toUpperCase() : 'Administrator';
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.userContextService.isAdmin();
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const savedExpanded = localStorage.getItem('sidebar_expanded');
      if (savedExpanded !== null) {
        this.layoutService.setSidebar(savedExpanded === 'true');
      }

      const browserUrl = window.location.pathname + window.location.search;
      const initialUrl = (browserUrl && browserUrl !== '/') ? browserUrl : this.router.url;
      this.currentUrl.set(initialUrl);
      this.syncActiveModule(initialUrl);

      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          const newUrl = event.urlAfterRedirects || event.url;
          this.currentUrl.set(newUrl);
          this.syncActiveModule(newUrl);
        });
    }
  }

  @HostListener('document:keydown.escape')
  closeFlyoutOnEscape(): void {
    this.closeFlyout();
    this.isUserDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isBrowser) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.sb-rail-user-avatar') && !target.closest('.sb-user-dropdown')) {
      this.isUserDropdownOpen.set(false);
    }
  }

  openFlyout(mod?: SidebarModule): void {
    if (!this.collapsed()) return;
    if (mod) this.previewModuleId.set(mod.module_code);
    this.isFlyoutOpen.set(true);
  }

  closeFlyout(): void {
    if (!this.collapsed()) return;
    this.isFlyoutOpen.set(false);
    this.previewModuleId.set(null);
  }

  onSidebarFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && (event.currentTarget as HTMLElement).contains(next)) return;
    this.closeFlyout();
  }

  onHomeClicked(): void {
    this.closeFlyout();
    this.layoutService.closeMobileMenu();
  }

  selectModule(mod: SidebarModule): void {
    this.selectedModuleId.set(mod.module_code);
    this.previewModuleId.set(mod.module_code);
    this.searchTerm.set('');
    if (this.collapsed()) {
      this.openFlyout(mod);
    }
    const currentUrl = this.currentUrl().split('?')[0];
    const containsCurrent = mod.sub_modules.some((sub) =>
      sub.screens.some((s) => s.route.split('?')[0] === currentUrl)
    );
    if (!containsCurrent && mod.default_route) {
      this.router.navigateByUrl(mod.default_route);
    }
  }

  toggleSubmodule(key: string): void {
    this.collapsedSubmodules.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  toggleExpandAll(): void {
    const mod = this.selectedModule();
    if (!mod) return;
    const currentlyAllExpanded = this.isAllExpanded();
    const updated: Record<string, boolean> = { ...this.collapsedSubmodules() };
    for (const sub of mod.sub_modules) {
      updated[sub.key] = currentlyAllExpanded;
    }
    this.collapsedSubmodules.set(updated);
  }

  isSubmoduleCollapsed(key: string): boolean {
    if (this.searchTerm().trim()) return false;
    return !!this.collapsedSubmodules()[key];
  }

  onMenuItemSelected(): void {
    this.closeFlyout();
    this.layoutService.closeMobileMenu();
  }

  toggleCollapse(): void {
    this.layoutService.toggleSidebar();
    this.closeFlyout();
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update((v) => !v);
  }

  logout(): void {
    if (confirm('Are you sure you want to sign out of the executive portal?')) {
      this.isUserDropdownOpen.set(false);
      this.authService.logout();
    }
  }

  isRouteActive(route: string): boolean {
    const current = this.currentUrl().split('?')[0];
    const cleanRoute = route.split('?')[0];
    return current === cleanRoute;
  }

  hasActiveChild(mod: SidebarModule): boolean {
    const cleanUrl = this.currentUrl().split('?')[0];
    const breadcrumb = getBreadcrumb(cleanUrl);
    return breadcrumb?.module.module_code === mod.module_code;
  }

  isSubmoduleActive(sub: SidebarSubModule): boolean {
    const cleanUrl = this.currentUrl().split('?')[0];
    const breadcrumb = getBreadcrumb(cleanUrl);
    return breadcrumb?.sub.key === sub.key;
  }

  isModuleSelected(mod: SidebarModule): boolean {
    return this.selectedModule()?.module_code === mod.module_code;
  }

  private canAccessScreen(screen: SystemScreen): boolean {
    const isAdmin = this.isAdmin;
    const isIntern = this.userContextService.user()?.userRole === 'intern';
    if (isAdmin) return true;
    if (isIntern) {
      if (screen.form_id === 'INT_104') return true;
      if (screen.form_id === 'ADM_402') return true;
      if (screen.form_id.startsWith('PUB_')) return true;
      return false;
    }
    if (screen.form_id.startsWith('ADM_') && screen.form_id !== 'ADM_402') return false;
    return true;
  }

  private syncActiveModule(url: string): void {
    const clean = url.split('?')[0];
    const breadcrumb = getBreadcrumb(clean);
    if (breadcrumb) {
      this.selectedModuleId.set(breadcrumb.module.module_code);
    }
  }
}
