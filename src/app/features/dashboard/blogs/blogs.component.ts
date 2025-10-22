import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [NgIf, CommonModule, RouterModule, ToastModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogs: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: BlogApiService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response.body || [];
        this.loading = false;
        this.toast.success('Success', 'Blogs loaded successfully');
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
        // console.error('Error loading blogs:', err);
        this.toast.error('Error', err || 'Failed to load blogs');
      },
    });
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
            this.loadBlogs();
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
          this.loadBlogs(); // Reload the list
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          alert('Failed to delete blog');
        },
      });
    }
  }

  editBlog(slug: string): void {
    this.router.navigate(['/dashboard/blog/create'], {
      queryParams: { id: slug },
    });
  }
}
