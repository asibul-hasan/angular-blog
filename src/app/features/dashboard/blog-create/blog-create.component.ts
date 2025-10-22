import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CharCountInputComponent } from '../../../shared/components/template/char-count-input.component';
import { CategoryService } from '../../../shared/services/category/category.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Toast } from 'primeng/toast';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// Ngx-Quill
import { QuillModule } from 'ngx-quill';

@Component({
  standalone: true,
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CharCountInputComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    QuillModule,
    Toast,
  ],
})
export class BlogCreateComponent implements OnInit {
  blogForm: FormGroup;
  blogId?: string;
  categories: any[] = [];
  isBrowser = false;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private blogApiService: BlogApiService,
    private categoryApiService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: [''],
      blog_content: ['', Validators.required],
      slug: [
        '',
        [
          Validators.maxLength(100),
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        ],
      ],
      meta_description: ['', [Validators.maxLength(160)]],
      category: [[], Validators.required],
      tags: [''],
      isPublished: [true],
      author: ['Asibul Hasan'],
      updatedAt: [new Date()],
    });

    this.route.queryParams.subscribe((params) => {
      this.blogId = params['id'];
    });
  }

  ngOnInit(): void {
    this.categoryApiService.getCategories().subscribe((res) => {
      this.categories = res.body || [];
    });

    if (this.blogId) {
      this.loadExistingBlog();
    }
  }

  private loadExistingBlog() {
    this.blogApiService.getBlogById(this.blogId!).subscribe((data) => {
      const blog = data.body[0];
      this.blogForm.patchValue({
        title: blog.title,
        description: blog.description,
        blog_content: blog.blog_content,
        meta_description: blog.meta_description,
        slug: blog.slug,
        category: blog.category || [],
        tags: (blog.tags || []).join(', '),
        isPublished: blog.isPublished,
        author: blog.author,
        updatedAt: blog.updatedAt,
      });
    });
  }

  createBlog() {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;

      const payload = {
        ...formValue,
        tags: formValue.tags
          ? formValue.tags.split(',').map((t: string) => t.trim())
          : [],
      };

      this.blogApiService.createBlog(payload).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/blogs']);
          this.toast.success('Blog created successfully');
        },
        error: (err) => {
          this.toast.error('Error', err);
        },
      });
    } else {
      this.blogForm.markAllAsTouched();
    }
  }
}
