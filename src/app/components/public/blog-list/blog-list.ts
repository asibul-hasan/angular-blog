import { Component, OnInit } from '@angular/core';
import { BlogApiService } from '../../../shared/services/blog/blog';
import { BlogCard } from '../../../shared/components/template/blog-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  imports: [BlogCard, CommonModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogList implements OnInit {
  blogs: any[] = [];
  buttonText: string = 'Read More';
  loading = true;
  error: string | null = null;

  constructor(private apiService: BlogApiService) {}

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.loading = true;
    this.error = null;

    this.apiService.getBlogs().subscribe({
      next: (res) => {
        if (res.body && Array.isArray(res.body)) {
          let list = res.body.map((el: any) => {
            el['short_desc'] = el.blog_content
              ? el.blog_content.slice(0, 120)
              : '';
            return el;
          });
          this.blogs = list;
        } else {
          this.blogs = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs';
        this.loading = false;
        console.error('Error loading blogs:', err);
      },
    });
  }
}
// const navigation = this.utilityService.getExtras(this.router, "IN_1036");
