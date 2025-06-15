import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.html'
})
export class BlogList {
  blogs = [
    { id: '1', title: 'Angular 17 Rocks!', slug: 'angular-17-rocks' },
    { id: '2', title: 'Firebase Integration', slug: 'firebase-integration' }
  ];
}
