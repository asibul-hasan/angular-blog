import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
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
    Toast,
  ],
})
export class BlogCreateComponent implements OnInit {
  blogForm: FormGroup;
  editor: any;
  blogId?: string;
  categories: any[] = [];
  isBrowser = false;

  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

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
      tags: [''], // as comma-separated string
      isPublished: [true],
      author: ['Asibul Hasan'],
      updatedAt: [new Date()],
    });

    this.route.queryParams.subscribe((params) => {
      this.blogId = params['id'];
    });
  }

  ngOnInit(): void {
    // Load categories (SSR-safe)
    this.categoryApiService.getCategories().subscribe((res) => {
      this.categories = res.body || [];
    });

    if (this.isBrowser) {
      this.initializeEditor();
    }
  }

  private async initializeEditor() {
    const { AiEditor } = await import('aieditor');

    const content =
      this.blogId && this.blogForm.controls['blog_content'].value
        ? this.blogForm.controls['blog_content'].value
        : '';

    if (this.blogId) {
      this.blogApiService.getBlogById(this.blogId).subscribe((data) => {
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

        this.editor = new AiEditor({
          element: '#editor',
          content: blog.blog_content,
          onChange: (editor: any) => {
            this.blogForm.controls['blog_content'].setValue(editor.getHtml());
          },
        });
      });
    } else {
      this.editor = new AiEditor({
        element: '#editor',
        content: content,
        onChange: (editor: any) => {
          this.blogForm.controls['blog_content'].setValue(editor.getHtml());
        },
      });
    }
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
