import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogStore.loadBlogs();
    this.blogs = this.blogStore.blogs();
    this.loading = false;

    if (this.blogs.length > 0) {
      this.toast.success('Success', 'Blogs loaded successfully');
    }
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
          },
          error: () => {
            this.toast.error('Error', 'Failed to update image URL');
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
          this.blogStore.refreshBlogs();
          this.blogs = this.blogStore.blogs();
          this.toast.success('Success', 'Blog deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.toast.error('Error', 'Failed to delete blog');
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
      },
      error: (err) => {
        this.toast.error('Error', `Failed to update ${field}`);
        console.error(`Failed to update ${field}:`, err);
      },
    });
  }
}