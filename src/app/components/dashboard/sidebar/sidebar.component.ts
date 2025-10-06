import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/template/loader.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, LoaderComponent],
})
export class SidebarComponent {
  isSidebarExpanded = false; // Default is minimized
  isUserMenuOpen = false;
  isLoading$;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$;
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    // Close user menu when toggling sidebar
    this.isUserMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
