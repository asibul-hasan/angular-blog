import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { BlogList } from './blog-list/blog-list';
import { BlogDetail } from './blog-detail/blog-detail';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'blog', component: BlogList },
  { path: 'blog/:id', component: BlogDetail }, // SSR-only
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
