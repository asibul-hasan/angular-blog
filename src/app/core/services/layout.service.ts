import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarExpanded = signal(true);
  isMobileMenuOpen = signal(false);

  toggleSidebar() {
    this.isSidebarExpanded.set(!this.isSidebarExpanded());
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_expanded', String(this.isSidebarExpanded()));
    }
  }

  setSidebar(expanded: boolean) {
    this.isSidebarExpanded.set(expanded);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  openMobileMenu() {
    this.isMobileMenuOpen.set(true);
  }
}

