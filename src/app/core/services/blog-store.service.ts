import { Injectable, inject, signal } from '@angular/core';
import { BlogApiService } from '../../shared/services/blog/blog.service';
import { CategoryService } from '../../shared/services/category/category.service';
import { Observable, of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({
    providedIn: 'root',
})
export class BlogStoreService {
    private readonly blogApi = inject(BlogApiService);
    private readonly CategoryApi = inject(CategoryService);
    private readonly toastService = inject(ToastService);

    // 🔹 Signal-based blog cache
    private readonly _blogs = signal<any[]>([]);
    readonly blogs = this._blogs.asReadonly();

    // 🔹 Signal-based category cache
    private readonly _categories = signal<any[]>([]);
    readonly categories = this._categories.asReadonly();

    // 🔹 Observable for categories (for backward compatibility)
    get categories$(): Observable<any[]> {
        return of(this._categories());
    }

    /**
     * Load blogs from API (sorted by date descending)
     */
    loadBlogs(): void {
        this.blogApi.getBlogs().subscribe({
            next: (res) => {
                if (res.body && Array.isArray(res.body)) {
                    const list = res.body
                        .map((el: any) => ({
                            ...el,
                            short_desc: el.blog_content ? el.blog_content.slice(0, 120) : '',
                        }))
                        .sort((a: { createdAt: string }, b: { createdAt: string }) => {
                            const aDate = new Date(a.createdAt || 0).getTime();
                            const bDate = new Date(b.createdAt || 0).getTime();
                            return bDate - aDate; // newest → oldest
                        });

                    this._blogs.set(list);
                } else {
                    this._blogs.set([]);
                }
            },
            error: (err) => {
                console.error('Error loading blogs:', err);
                // Show user-friendly error message
                this.toastService.error('Failed to load blogs', 'Please check your connection and try again');
                // Set empty array to prevent undefined issues
                this._blogs.set([]);
            },
        });
    }

    /**
     * Force refresh blogs (use after create/update/delete)
     */
    refreshBlogs(): void {
        this.loadBlogs();
    }

    /**
     * Load categories for blog filtering
     */
    loadCategories(): void {
        this.CategoryApi.getCategories().subscribe({
            next: (res) => {
                if (res && res.body && Array.isArray(res.body)) {
                    this._categories.set(res.body);
                } else {
                    this._categories.set([]);
                }
            },
            error: (err) => {
                console.error('Error loading categories:', err);
                // Show user-friendly error message
                this.toastService.error('Failed to load categories', 'Please check your connection and try again');
                // Set empty array on error to prevent undefined issues
                this._categories.set([]);
            },
        });
    }

    /**
     * Force refresh categories (use after create/update/delete)
     */
    refreshCategories(): void {
        this.loadCategories();
    }

    /**
     * Optional: Refresh both blogs and categories
     */
    refreshAll(): void {
        this.loadBlogs();
        this.loadCategories();
    }
}