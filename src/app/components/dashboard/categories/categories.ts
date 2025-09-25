import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories: any[] = [];
  loading = true;
  error: string | null = null;
  newCategory = { name: '', description: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.http.get(`${environment.apiUrl}/get-categories`).subscribe({
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
      alert('Please enter a category name');
      return;
    }

    this.http
      .post(`${environment.apiUrl}/create-category`, this.newCategory)
      .subscribe({
        next: () => {
          this.newCategory = { name: '', description: '' };
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
      this.http
        .delete(`${environment.apiUrl}/delete-category/${id}`)
        .subscribe({
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
