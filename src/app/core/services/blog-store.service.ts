import { Injectable, inject, signal } from '@angular/core';
import { BlogApiService } from '../../shared/services/blog/blog.service';
import { CategoryService } from '../../shared/services/category/category.service';

@Injectable({
    providedIn: 'root',
})
export class BlogStoreService {
    private readonly blogApi = inject(BlogApiService);
    private readonly CategoryApi = inject(CategoryService);

    // 🔹 Signal-based blog cache
    private readonly _blogs = signal<any[]>([]);
    readonly blogs = this._blogs.asReadonly();

    // 🔹 Signal-based category cache
    private readonly _categories = signal<any[]>([]);
    readonly categories = this._categories.asReadonly();

    /**
     * Load blogs from API (sorted by date descending)
     */
    loadBlogs(): void {
        if (this._blogs().length > 0) return; // avoid duplicate calls

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
            error: (err) => console.error('Error loading blogs:', err),
        });
    }

    /**
     * Load categories for blog filtering
     */
    loadCategories(): void {
        // Avoid refetch if already cached
        if (this._categories().length > 0) return;

        this.CategoryApi.getCategories().subscribe({
            next: (res) => {
                if (res && Array.isArray(res.body)) {
                    this._categories.set(res.body);
                } else if (Array.isArray(res)) {
                    this._categories.set(res);
                } else {
                    this._categories.set([]);
                }
            },
            error: (err) => console.error('Error loading categories:', err),
        });
    }

    /**
     * Optional: Refresh both blogs and categories
     */
    refreshAll(): void {
        this._blogs.set([]);
        this._categories.set([]);
        this.loadBlogs();
        this.loadCategories();
    }
}
