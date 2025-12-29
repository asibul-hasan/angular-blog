import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public-layout/public-layout.component').then(c => c.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./blog-list/blog-list.component').then(c => c.BlogList)
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('./blog-detail/blog-detail.component').then(c => c.BlogDetailComponent)
      },
      {
        path: 'service',
        loadComponent: () => import('./service/service.component').then(c => c.ServiceComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(c => c.ContactComponent)
      },
      {
        path: 'terms-of-service',
        loadComponent: () => import('./legal/terms-of-service.component').then(c => c.TermsOfServiceComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./legal/privacy-policy.component').then(c => c.PrivacyPolicyComponent)
      },
      {
        path: 'disclaimer',
        loadComponent: () => import('./legal/disclaimer.component').then(c => c.DisclaimerComponent)
      },
      {
        path: 'careers',
        loadComponent: () => import('./careers/careers.component').then(c => c.CareersComponent)
      },
      {
        path: 'careers/:id',
        loadComponent: () => import('./career-detail/career-detail.component').then(c => c.CareerDetailComponent)
      },
      // products
      {
        path: 'image-converter',
        loadComponent: () => import('./products/image-converter/image-converter.component').then(c => c.ImageConverterComponent)
      },
      // Internship routes
      {
        path: 'internship/:id',
        loadComponent: () => import('./internship/detail/internship-detail.component').then(c => c.InternshipDetailComponent)
      },
      {
        path: 'internship/apply',
        loadComponent: () => import('./internship/apply/internship-apply.component').then(c => c.InternshipApplyComponent)
      },
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
