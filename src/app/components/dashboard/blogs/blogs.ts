import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogApiService } from '../../../shared/services/blog/blog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blogs',
  imports: [CommonModule, RouterModule],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs implements OnInit {
  blogs: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private blogApiService: BlogApiService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;

    this.blogApiService.getBlogs().subscribe({
      next: (response) => {
        this.blogs = response.body || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
        console.error('Error loading blogs:', err);
      },
    });
  }

  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogApiService.deleteBlog(id).subscribe({
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
}
