import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home.component';
import { BlogList } from './blog-list/blog-list.component';
import { BlogDetail } from './blog-detail/blog-detail.component';
import { PublicLayout } from './public-layout/public-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'blog', component: BlogList },
      { path: 'blog/:id', component: BlogDetail }, // SSR-only
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
