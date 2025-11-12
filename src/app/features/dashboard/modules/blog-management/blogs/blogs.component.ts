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

  constructor(
    @Inject(BlogApiService) private apiService: BlogApiService,
    private blogStore: BlogStoreService,
    @Inject(ToastService) private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    // Use BlogStoreService instead of direct API call
    this.blogStore.loadBlogs();

    // Subscribe to the signal-based store
    this.blogs = this.blogStore.blogs();
    this.loading = false;

    if (this.blogs.length > 0) {
      this.toast.success('Success', 'Blogs loaded successfully');
    }
  }
  togglePublishStatus(blog: any): void {
    // 1. Immediately update the local state for a fast UI response
    blog.isPublished = !blog.isPublished;

    // 2. Send the update to the backend API
    this.apiService
      .updateBlog(blog._id, { isPublished: blog.isPublished })
      .subscribe({
        next: (response) => {
          console.log('Publish status updated successfully', response);
          this.toast.success('Success', 'Publish status updated successfully');
          // The local 'blog' object is already updated, so no further change is needed unless
          // the backend returns a canonical version you need to replace it with.
        },
        error: (err) => {
          // IMPORTANT: If the API fails, revert the local change
          blog.isPublished = !blog.isPublished;
          this.toast.error('Error', 'Failed to update publish status');
          console.error('Failed to update publish status on the server:', err);
          // You might want to show a user notification here
        },
      });
  }
  onFileSelected(event: any, blog: any): void {
    const file: File = event.target.files[0];
    this.apiService.uploadImage(file).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully', response);
        let image = response.secure_url;
        this.apiService.updateBlog(blog._id, { image: image }).subscribe({
          next: (response) => {
            // Refresh blogs from store after update
            this.blogStore.refreshBlogs();
            this.blogs = this.blogStore.blogs();
            console.log('Image URL updated successfully', response);
            this.toast.success('Success', 'Image URL updated successfully');
          },
          error: (err) => {
            console.error('Failed to update image URL on the server:', err);
            this.toast.error('Error', 'Failed to update image URL');
          },
        });
      },
      error: (err) => {
        console.error('Failed to upload image:', err);
        this.toast.error('Error', 'Failed to upload image');
      },
    });
  }

  uploadImage(blog: any): void {
    // 1. Immediately update the local state for a fast UI response

    // 2. Send the update to the backend API
    this.apiService
      .updateBlog(blog._id, { image: blog.isPublished })
      .subscribe({
        next: (response) => {
          console.log('Publish status updated successfully', response);
          // The local 'blog' object is already updated, so no further change is needed unless
          // the backend returns a canonical version you need to replace it with.
        },
        error: (err) => {
          // IMPORTANT: If the API fails, revert the local change
          blog.isPublished = !blog.isPublished;
          console.error('Failed to update publish status on the server:', err);
          // You might want to show a user notification here
        },
      });
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.apiService.deleteBlog(id).subscribe({
        next: () => {
          // Refresh blogs from store after delete
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

  editBlog(slug: string): void {
    this.router.navigate(['/dashboard/blog/create'], {
      queryParams: { id: slug },
    });
  }

  // Quick edit methods
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