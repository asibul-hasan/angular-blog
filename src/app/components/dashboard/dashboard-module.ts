import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { BlogApiService } from '../../shared/services/blog/blog';

@NgModule({
  declarations: [],
  imports: [CommonModule, DashboardRoutingModule, HttpClientModule],
  providers: [BlogApiService],
})
export class DashboardModule {}
