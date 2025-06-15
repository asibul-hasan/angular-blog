import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-create.html'
})
export class BlogCreatePage {
  newBlog = {
    title: '',
    content: ''
  };

  createBlog() {
    console.log('Creating new blog:', this.newBlog);
  }
}
