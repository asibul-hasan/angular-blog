import { Routes } from '@angular/router';
import { DashboardHomePage } from './dashboard-home/dashboard-home/dashboard-home';
import { BlogEditorPage } from './blog-editor/blog-editor/blog-editor';
import { BlogCreatePage } from './blog-create/blog-create/blog-create';
import { CategoryListPage } from './category-management/category-list/category-list';
import { CategoryEditPage } from './category-management/category-edit/category-edit';

export const routes: Routes = [
  { path: '', component: DashboardHomePage },
  { path: 'blogs/new', component: BlogCreatePage },
  { path: 'blogs/edit/:id', component: BlogEditorPage },
  { path: 'categories', component: CategoryListPage },
  { path: 'categories/edit/:id', component: CategoryEditPage },
];
