import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blog/create', component: BlogCreateComponent },
      { path: 'blog/edit/:id', component: BlogEditComponent },
      { path: 'categories', component: CategoriesComponent },

      // Wildcard route for 404 handling
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
