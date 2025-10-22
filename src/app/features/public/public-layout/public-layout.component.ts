import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoaderComponent } from '../../../shared/components/template/loader.component';
import { LoaderService } from '../../../shared/services/loader/loader.service';
import { Footer } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    Footer,
    LoaderComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <app-loader *ngIf="isLoading$ | async"></app-loader>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class PublicLayout {
  isLoading$
  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading$;

  }
}
