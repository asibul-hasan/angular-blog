import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogList } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { PublicLayout } from './public-layout/public-layout.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { ContactComponent } from './contact/contact.component';
import { TermsOfServiceComponent } from './legal/terms-of-service.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy.component';
import { DisclaimerComponent } from './legal/disclaimer.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'blog', component: BlogList },
      { path: 'about', component: AboutComponent },
      { path: 'blog/:id', component: BlogDetailComponent }, // SSR-only
      { path: 'service', component: ServiceComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'terms-of-service', component: TermsOfServiceComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'disclaimer', component: DisclaimerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule { }


// import { Routes } from '@angular/router';

// export const publicRoutes: Routes = [
//   {
//     path: '',
//     loadComponent: () =>
//       import('./public-layout/public-layout.component')
//         .then(c => c.PublicLayout),
//     children: [
//       {
//         path: '',
//         loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
//       },
//       {
//         path: 'about',
//         loadComponent: () => import('./about/about.component').then(c => c.AboutComponent),
//       },
//       {
//         path: 'blog',
//         loadComponent: () => import('./blog-list/blog-list.component').then(c => c.BlogList),
//       },
//       {
//         path: 'blog/:id',
//         loadComponent: () => import('./blog-detail/blog-detail.component').then(c => c.BlogDetailComponent),
//       },
//       {
//         path: 'service',
//         loadComponent: () => import('./service/service.component').then(c => c.ServiceComponent),
//       },
//       {
//         path: 'contact',
//         loadComponent: () => import('./contact/contact.component').then(c => c.ContactComponent),
//       },
//       {
//         path: 'terms-of-service',
//         loadComponent: () => import('./legal/terms-of-service.component').then(c => c.TermsOfServiceComponent),
//       },
//       {
//         path: 'privacy-policy',
//         loadComponent: () => import('./legal/privacy-policy.component').then(c => c.PrivacyPolicyComponent),
//       },
//       {
//         path: 'disclaimer',
//         loadComponent: () => import('./legal/disclaimer.component').then(c => c.DisclaimerComponent),
//       },
//     ]
//   },
//   {
//     path: '**',
//     redirectTo: '',
//   },
// ];
