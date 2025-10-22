import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { CommonModule } from '@angular/common';
import { SocialLinksService } from '../../../shared/services/social-links/social-links.service';
import { SeoService } from '../../../shared/services/seo/seo.service';
import { SocialIcon } from '../../../shared/components/template/social-icon-card.component';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, SocialIcon],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  blogId: string = '';
  // blog: any = [];
  blog: any = null;
  readTime: number = 0;
  socialLinks: any[] = [];

  defaultImg =
    "'https://res.cloudinary.com/dfcir8epp/image/upload/v1755703537/FFFFFF_hi6y3z.svg'";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: BlogApiService,
    private socialLinksService: SocialLinksService,
    private seo: SeoService
  ) {
    // const nav = this.router.getCurrentNavigation();
    // if (nav?.extras. state?.['blog']) {
    //   this.blogId = nav.extras.state['blog'];
    // } else {
    //   this.blogId = this.route.snapshot.paramMap.get('id') || '';
    // }
    this.socialLinks = this.socialLinksService.getSocialLinks();
  }

  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id') || '';

    if (this.blogId) {
      this.apiService.getBlogById(this.blogId).subscribe({
        next: (res) => {
          if (res.body && res.body.length > 0) {
            this.blog = res.body[0];

            // use meta services
            this.seo.updateTags({
              title: this.blog.title,
              description: this.blog.meta_description,
              image: this.blog.image ?? this.defaultImg,
              slug: this.blog.slug,
              type: 'article',
              author: this.blog.author,
              publishedDate: this.blog.publishedAt,
              modifiedDate: this.blog.updatedAt,
              tags: this.blog.tags,
            });

            this.calculateReadingTime(this.blog.blog_content);
          } else {
            console.error('Blog not found');
            this.router.navigate(['/blog']); // Redirect to blog list
          }
        },
        error: (err) => {
          console.error('Error loading blog:', err);
          this.router.navigate(['/blog']); // Redirect to blog list on error
        },
      });
    } else {
      this.router.navigate(['/blog']); // Redirect if no ID provided
    }
  }
  calculateReadingTime(content: string) {
    const wpm = 200; // Average reading speed in words per minute
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wpm);
    return (this.readTime = minutes);
  }
}
