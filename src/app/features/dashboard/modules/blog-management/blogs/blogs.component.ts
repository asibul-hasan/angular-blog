import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { BlogApiService } from '../../../../../shared/services/blog/blog.service';
import { BlogStoreService } from '../../../../../core/services/blog-store.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [NgIf, CommonModule, RouterModule, FormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogs: any[] = [];
  loading = true;
  error: string | null = null;
  editingBlog: { [key: string]: any } = {};

  searchQuery = '';
  selectedStatus: 'all' | 'published' | 'draft' = 'all';
  selectedCategory = 'all';

  constructor(
    @Inject(BlogApiService) private apiService: BlogApiService,
    private blogStore: BlogStoreService,
    @Inject(ToastService) private toast: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getBlogs().subscribe({
      next: (res) => {
        let items: any[] = [];
        if (res && res.body && Array.isArray(res.body)) {
          items = res.body;
        } else if (Array.isArray(res)) {
          items = res;
        }

        this.blogs = items
          .map((el: any) => ({
            ...el,
            short_desc: el.blog_content ? el.blog_content.slice(0, 120) : '',
          }))
          .sort((a: { createdAt: string }, b: { createdAt: string }) => {
            const aDate = new Date(a.createdAt || 0).getTime();
            const bDate = new Date(b.createdAt || 0).getTime();
            return bDate - aDate;
          });

        this.loading = false;
        this.blogStore.refreshBlogs();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load blogs:', err);
        this.error = 'Failed to load articles from the database. Please try again.';
        this.loading = false;
        this.toast.error('Error', 'Failed to load articles');
        this.cdr.markForCheck();
      },
    });
  }

  get publishedCount(): number {
    return this.blogs.filter((b) => b.isPublished !== false).length;
  }

  get draftCount(): number {
    return this.blogs.filter((b) => b.isPublished === false).length;
  }

  get categoriesList(): string[] {
    const set = new Set<string>();
    this.blogs.forEach((b) => {
      const cat = (Array.isArray(b.category) && b.category[0]?.name) || b.category?.name || (typeof b.category === 'string' ? b.category : '');
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }

  get filteredBlogs(): any[] {
    return this.blogs.filter((b) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.slug && b.slug.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q));

      const matchesStatus =
        this.selectedStatus === 'all' ||
        (this.selectedStatus === 'published' && b.isPublished !== false) ||
        (this.selectedStatus === 'draft' && b.isPublished === false);

      const catName = ((Array.isArray(b.category) && b.category[0]?.name) || b.category?.name || (typeof b.category === 'string' ? b.category : '')).toLowerCase();
      const matchesCategory =
        this.selectedCategory === 'all' || catName === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  togglePublishStatus(blog: any): void {
    blog.isPublished = !blog.isPublished;

    this.apiService.updateBlog(blog._id, { isPublished: blog.isPublished }).subscribe({
      next: () => {
        this.toast.success('Success', `Article is now ${blog.isPublished ? 'Published Live' : 'Draft'}`);
      },
      error: (err) => {
        blog.isPublished = !blog.isPublished;
        this.toast.error('Error', 'Failed to update publish status');
        console.error('Failed to update publish status on the server:', err);
      },
    });
  }

  onFileSelected(event: any, blog: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.apiService.uploadImage(file).subscribe({
      next: (response) => {
        const image = response.secure_url;
        this.apiService.updateBlog(blog._id, { image }).subscribe({
          next: () => {
            blog.image = image;
            this.blogStore.refreshBlogs();
            this.toast.success('Success', 'Cover image updated successfully');
            this.cdr.markForCheck();
          },
          error: () => {
            this.toast.error('Error', 'Failed to update image URL');
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.toast.error('Error', 'Failed to upload image file');
      },
    });
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to permanently delete this article?')) {
      this.apiService.deleteBlog(id).subscribe({
        next: () => {
          this.blogs = this.blogs.filter((b) => b._id !== id);
          this.blogStore.refreshBlogs();
          this.toast.success('Success', 'Blog deleted successfully');
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.toast.error('Error', 'Failed to delete blog');
          this.cdr.markForCheck();
        },
      });
    }
  }

  editBlog(id: string): void {
    this.router.navigate(['/dashboard/blog-management/blog/create'], {
      queryParams: { id },
    });
  }

  // Quick inline edit methods
  startEditing(blogId: string, field: string, currentValue: string): void {
    if (!this.editingBlog[blogId]) {
      this.editingBlog[blogId] = {};
    }
    this.editingBlog[blogId][field] = currentValue;
  }

  isEditing(blogId: string, field: string): boolean {
    return this.editingBlog[blogId]?.[field] !== undefined;
  }

  cancelEdit(blogId: string, field: string): void {
    if (this.editingBlog[blogId]) {
      delete this.editingBlog[blogId][field];
    }
  }

  saveField(blog: any, field: string): void {
    const newValue = this.editingBlog[blog._id]?.[field];

    if (!newValue || newValue.trim() === '') {
      this.toast.warn('Value cannot be empty');
      return;
    }

    const updateData: any = {};
    updateData[field] = newValue.trim();

    this.apiService.updateBlog(blog._id, updateData).subscribe({
      next: () => {
        blog[field] = newValue.trim();
        delete this.editingBlog[blog._id][field];
        this.toast.success('Success', `${field} updated successfully`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toast.error('Error', `Failed to update ${field}`);
        console.error(`Failed to update ${field}:`, err);
        this.cdr.markForCheck();
      },
    });
  }
}