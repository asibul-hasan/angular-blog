import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing-module';
import { HttpClientModule } from '@angular/common/http';
import { BlogApiService } from '../../shared/services/blog/blog';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, PublicRoutingModule, HttpClientModule],
  providers: [BlogApiService],
})
export class PublicModule {}
