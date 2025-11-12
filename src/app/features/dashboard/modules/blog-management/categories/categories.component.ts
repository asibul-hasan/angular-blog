import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { CategoryService } from '../../../../../shared/services/category/category.service';
import { BlogStoreService } from '../../../../../core/services/blog-store.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
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
    private categoryStore: BlogStoreService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    // Use BlogStoreService instead of direct API call
    this.categoryStore.loadCategories();

    // Subscribe to the signal-based store
    this.categories = this.categoryStore.categories();
    this.loading = false;
  }

  addCategory(): void {
    if (!this.newCategory.name.trim()) {
      this.toast.warn('Please enter a category name');
      return;
    }

    this.apiService.createCategory(this.newCategory.name).subscribe({
      next: () => {
        this.newCategory = { name: '' };
        // Refresh categories from store after create
        this.categoryStore.refreshCategories();
        this.categories = this.categoryStore.categories();
        this.toast.success('Success', 'Category created successfully');
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.toast.error('Error', 'Failed to create category');
      },
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          // Refresh categories from store after delete
          this.categoryStore.refreshCategories();
          this.categories = this.categoryStore.categories();
          this.toast.success('Success', 'Category deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.toast.error('Error', 'Failed to delete category');
        },
      });
    }
  }
}