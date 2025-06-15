import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-editor.html'
})
export class BlogEditorPage {
  blog = {
    title: 'Sample Blog Title',
    content: 'This is the editable blog content...'
  };

  saveBlog() {
    console.log('Saving blog:', this.blog);
  }
}
