import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogApiService } from '../../../shared/services/blog/blog.service';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class BlogEditComponent implements OnInit {
  blogForm: FormGroup;
  blogId: string;

  constructor(
    private fb: FormBuilder,
    private blogApiService: BlogApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.blogId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.blogApiService.getBlogById(this.blogId).subscribe((blog) => {
      this.blogForm.patchValue(blog);
    });
  }

  updateBlog() {
    if (this.blogForm.valid) {
      this.blogApiService
        .updateBlog(this.blogId, this.blogForm.value)
        .subscribe(() => {
          this.router.navigate(['/dashboard/blogs']);
        });
    }
  }
}
