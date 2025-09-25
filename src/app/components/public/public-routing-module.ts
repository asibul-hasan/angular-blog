import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { BlogList } from './blog-list/blog-list';
import { BlogDetail } from './blog-detail/blog-detail';

const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'blog', component: BlogList },
  { path: 'blog/:id', component: BlogDetail }, // SSR-only
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
