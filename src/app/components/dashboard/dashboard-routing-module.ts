import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Blogs } from './blogs/blogs';
import { DashboardModule } from './dashboard-module';
import { Categories } from './categories/categories';
// import { Home } from '../public/home/home';

const routes: Routes = [
  // { path: '', component: DashboardModule },
  {
    path: 'blogs',
    component: Blogs,
  },
  {
    path: 'categories',
    component: Categories,
  },
  { path: '', redirectTo: 'blogs', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
