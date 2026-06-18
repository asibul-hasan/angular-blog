import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarExpanded = signal(true);

  toggleSidebar() {
    this.isSidebarExpanded.set(!this.isSidebarExpanded());
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_expanded', String(this.isSidebarExpanded()));
    }
  }

  setSidebar(expanded: boolean) {
    this.isSidebarExpanded.set(expanded);
  }
}
