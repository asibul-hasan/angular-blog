import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartModule,
    MenuModule,
    TableModule,
    ButtonModule,
    StyleClassModule,
    PanelMenuModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  declarations: [],
  providers: [MessageService],
})
export class DashboardModule {}
