import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { Footer } from '../../../shared/components/footer/footer.component';

// Chatbot is loaded at the root level in app.component.html with @defer (on idle)
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    Footer,
  ],
  template: `
    <app-navbar></app-navbar>
    <!-- Accessible main landmark for WCAG AA compliance and Lighthouse audit -->
    <main id="main-content" role="main">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class PublicLayout { }
