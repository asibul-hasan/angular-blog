import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-edit.html'
})
export class CategoryEditPage {
  category = {
    id: '1',
    name: 'Technology'
  };

  saveCategory() {
    console.log('Saving category:', this.category);
  }
}
