import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlogApiService } from '../../../shared/services/blog/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AiEditor } from 'aieditor';
import { CharCountInputComponent } from '../../../shared/components/template/char-count-input.component';
import { CategoryService } from '../../../shared/services/category/category.service';
// ✅ Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ToastService } from '../../../shared/services/toast.service';
import { Toast } from 'primeng/toast';

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
  editor!: AiEditor;
  blogId: string | undefined;
  categories: any[] = [];

  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private blogApiService: BlogApiService,
    private categoryApiService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: [''], // API expects description separately
      blog_content: ['', Validators.required], // match backend
      slug: [
        '',
        [
          Validators.maxLength(100),
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        ],
      ],
      meta_description: ['', [Validators.maxLength(160)]],
      category: [[], Validators.required], // multi-select array
      tags: [[]], // multiple tags
      isPublished: [true],
      author: ['Asibul Hasan'], // could be set from auth service later
      updatedAt: [new Date()],
    });

    this.route.queryParams.subscribe((params) => {
      this.blogId = params['id'];
    });
  }

  ngOnInit(): void {
    // Load categories always
    this.categoryApiService.getCategories().subscribe((res) => {
      this.categories = res.body || [];
    });
    this.onLoad();
    // Load blog details if editing
  }

  onLoad(): void {
    // If editing an existing blog
    if (this.blogId) {
      this.blogApiService.getBlogById(this.blogId).subscribe((data) => {
        const blog = data.body[0];

        // Patch the form
        this.blogForm.patchValue({
          title: blog.title,
          description: blog.description,
          blog_content: blog.blog_content,
          meta_description: blog.meta_description,
          slug: blog.slug,
          category: blog.category || [],
          tags: blog.tags || [],
          isPublished: blog.isPublished,
          author: blog.author,
          updatedAt: blog.updatedAt,
        });

        // **Re-initialize the editor with the content**
        this.editor = new AiEditor({
          element: '#editor',
          content: blog.blog_content, // pre-fill existing content
          onChange: (editor) => {
            this.blogForm.controls['blog_content'].setValue(editor.getHtml());
          },
        });
      });
    } else {
      this.editor = new AiEditor({
        element: '#editor',
        content: this.blogForm.controls['blog_content'].value || '', // initial content
        onChange: (editor) => {
          this.blogForm.controls['blog_content'].setValue(editor.getHtml());
        },
      });
    }
  }

  createBlog() {
    if (this.blogForm.valid) {
      const payload = this.blogForm.value;

      this.blogApiService.createBlog(payload).subscribe({
        next: (res) => {
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

  // createBlog() {
  //   if (this.blogForm.valid) {
  //     this.blogApiService.createBlog(this.blogForm.value).subscribe(() => {
  //       this.router.navigate(['/dashboard/blogs']);
  //     });
  //   } else {
  //     this.blogForm.markAllAsTouched();
  //   }
  // }
}
