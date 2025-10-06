import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Footer } from '../../../shared/components/footer/footer.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { LoaderComponent } from '../../../shared/components/template/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  template: `
    <app-navbar></app-navbar>

    <!-- Main content wrapper (relative for loader positioning) -->
    <div class="relative min-h-screen">
      <app-loader *ngIf="isLoading$ | async"></app-loader>
      <router-outlet></router-outlet>
    </div>

    <app-footer></app-footer>
  `,
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    Footer,
    LoaderComponent,
    CommonModule,
    NavbarComponent,
  ],
})
export class PublicLayout {
  isLoading$;
  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$;
  }
}
