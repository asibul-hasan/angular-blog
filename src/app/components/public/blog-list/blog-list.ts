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
  constructor(private apiService: BlogApiService) {}

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.apiService.getBlogs().subscribe((res) => {
      let list = res.body.map((el: any) => {
        el['short_desc'] = el.blog_content.slice(0, 120);

        return el;
      });
      this.blogs = list;
      // console.table(this.blogs);
    });
  }
}
// const navigation = this.utilityService.getExtras(this.router, "IN_1036");
