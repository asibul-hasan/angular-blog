import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdminGuard } from '../../../../core/guards/admin.guard';

const routes: Routes = [
    { path: '', redirectTo: 'blogs', pathMatch: 'full' },
    { path: 'blogs', component: BlogsComponent, canActivate: [AdminGuard] },
    { path: 'blog/create', component: BlogCreateComponent, canActivate: [AdminGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AdminGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogManagementRoutingModule { }