import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.html'
})
export class CategoryListPage {
  categories = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Business' }
  ];
}
