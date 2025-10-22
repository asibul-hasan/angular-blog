import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  standalone: true,
  imports: [RouterModule, SidebarComponent],
})
export class DashboardLayoutComponent {}
