import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { BlogDetail } from './blog-detail/blog-detail';
import { BlogList } from './blog-list/blog-list';

const routes: Routes = [
  // { path: '', component: DashboardModule },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    component: Home,
  },
  {
    path: 'blog',
    component: BlogList,
  },
  // {
  //   path: 'blog/:id',
  //   component: BlogDetail,
  // },
  { path: 'blog/:id', component: BlogDetail, data: { renderMode: 'ssr' } },

  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
