import { Component, OnInit, inject, signal, ChangeDetectionStrategy, effect } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  public apiService = inject(CategoryService);
  public categoryStore = inject(BlogStoreService);
  public toast = inject(ToastService);

  categories = this.categoryStore.categories;
  loading = signal(false);
  error = signal<string | null>(null);
  newCategory = signal({ name: '' });

  ngOnInit(): void {
    this.categoryStore.loadCategories();
  }

  addCategory(): void {
    const name = this.newCategory().name;
    if (!name.trim()) {
      this.toast.warn('Please enter a category name');
      return;
    }

    this.loading.set(true);
    this.apiService.createCategory(name).subscribe({
      next: () => {
        this.newCategory.set({ name: '' });
        this.categoryStore.refreshCategories();
        this.loading.set(false);
        this.toast.success('Success', 'Category created successfully');
      },
      error: (err) => {
        console.error('Error creating category:', err);
        this.toast.error('Error', 'Failed to create category');
        this.loading.set(false);
      },
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.loading.set(true);
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.categoryStore.refreshCategories();
          this.loading.set(false);
          this.toast.success('Success', 'Category deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.toast.error('Error', 'Failed to delete category');
          this.loading.set(false);
        },
      });
    }
  }

  updateNewCategoryName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newCategory.set({ name: input.value });
  }
}