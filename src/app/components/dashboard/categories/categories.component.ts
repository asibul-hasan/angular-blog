import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CategoryService } from '../../../shared/services/category/category.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  newCategory = { name: '' };

  constructor(
    private http: HttpClient,
    private apiService: CategoryService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.body || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        this.loading = false;
        console.error('Error loading categories:', err);
      },
    });
  }

  addCategory(): void {
    if (!this.newCategory.name.trim()) {
      this.toast.warn('Please enter a category name');
      return;
    }

    this.apiService.createCategory(this.newCategory.name).subscribe({
      next: () => {
        this.newCategory = { name: '' };
        this.loadCategories(); // Reload the list
      },
      error: (err) => {
        console.error('Error creating category:', err);
        alert('Failed to create category');
      },
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories(); // Reload the list
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Failed to delete category');
        },
      });
    }
  }
}
