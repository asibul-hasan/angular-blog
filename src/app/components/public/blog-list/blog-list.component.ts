import { Component, OnInit } from '@angular/core';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { BlogCard } from '../../../shared/components/template/blog-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  imports: [BlogCard, CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css',
})
export class BlogList implements OnInit {
  blogs: any[] = [];
  buttonText: string = 'Read More';

  constructor(private apiService: BlogApiService) {}

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
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
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
      },
    });
  }
}
