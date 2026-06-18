import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlogApiService } from '../../../../../shared/services/blog/blog.service';
import { BlogStoreService } from '../../../../../core/services/blog-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CharCountInputComponent } from '../../../../../shared/components/template/char-count-input.component';
import { CategoryService } from '../../../../../shared/services/category/category.service';
import { ToastService } from '../../../../../shared/services/toast.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// TinyMCE
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  standalone: true,
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // CharCountInputComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    EditorModule,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private blogApiService = inject(BlogApiService);
  private blogStore = inject(BlogStoreService);
  private categoryApiService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  blogForm: FormGroup;
  blogId = signal<string | undefined>(undefined);
  categories = signal<any[]>([]);
  isBrowser = signal(isPlatformBrowser(this.platformId));
  private subscription = new Subscription();

  tinymceConfig = {
    plugins: 'lists link image table code help wordcount autoresize',
    toolbar:
      'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat code',
    toolbar_mode: 'sliding' as 'floating' | 'sliding' | 'scrolling' | 'wrap',
    min_height: 400,
    max_height: 600,
    autoresize_bottom_margin: 20,
    menubar: false,
    branding: false,
    skin: 'oxide-dark',
    content_css: 'dark',
    statusbar: true,
    resize: false,
    placeholder: 'Start writing your amazing blog content here...',
    paste_data_images: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    content_style:
      'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; font-size: 14px; line-height: 1.6; }',
  };

  constructor() {
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
      category: [[], [Validators.required]],
      tags: [''],
      isPublished: [true],
      author: ['Asibul Hasan'],
      updatedAt: [new Date()],
      _id: [''],
    });

    this.route.queryParams.subscribe((params) => {
      this.blogId.set(params['id']);
    });

    // Auto-generate slug from title
    this.subscription.add(
      this.blogForm.get('title')?.valueChanges.subscribe((value) => {
        const slugControl = this.blogForm.get('slug');
        if (slugControl && (!slugControl.value || slugControl.pristine)) {
          const slug = value
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          slugControl.setValue(slug, { emitEvent: false });
        }
      }),
    );
  }

  ngOnInit(): void {
    // Load categories from store and subscribe to updates
    this.blogStore.loadCategories();

    // Subscribe to category changes from the store
    this.subscription.add(
      this.blogStore.categories$.subscribe((categories) => {
        this.categories.set(categories);

        // Critical: Only load the blog AFTER categories are available to ensure select binding works
        if (this.blogId() && categories.length > 0) {
          this.loadExistingBlog();
        }
      }),
    );
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }

  private loadExistingBlog() {
    this.blogApiService.getBlogById(this.blogId()!).subscribe((data) => {
      const blog = data.body[0];
      if (!blog) return;

      // Ensure category is always an array of IDs for mat-select multiple
      let categoryIds: string[] = [];
      if (blog.category) {
        const categories = Array.isArray(blog.category)
          ? blog.category
          : [blog.category];
        categoryIds = categories.map((cat: any) =>
          typeof cat === 'object' ? cat._id : cat,
        );
      }

      this.blogForm.patchValue(
        {
          title: blog.title,
          description: blog.description,
          blog_content: blog.blog_content,
          meta_description: blog.meta_description,
          slug: blog.slug,
          category: categoryIds,
          tags: (blog.tags || []).join(', '),
          isPublished: blog.isPublished,
          author: blog.author,
          updatedAt: blog.updatedAt,
          _id: blog._id,
        },
        { emitEvent: false },
      );
    });
  }

  createBlog() {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;

      // Prepare payload with proper formatting
      const payload = {
        ...formValue,
        tags: formValue.tags
          ? formValue.tags.split(',').map((t: string) => t.trim())
          : [],
        category: Array.isArray(formValue.category)
          ? formValue.category
          : [formValue.category].filter(Boolean),
      };

      // Remove _id from payload if creating new blog
      if (!formValue._id) {
        delete payload._id;
      }

      // Check if _id exists (update mode) or not (create mode)
      const blogId = formValue._id;
      if (blogId) {
        // Update existing blog
        this.blogApiService.updateBlog(blogId, payload).subscribe({
          next: () => {
            // Refresh blogs in store after update
            this.blogStore.refreshBlogs();
            this.router.navigate(['/dashboard/blogs']);
            this.toast.success('Blog updated successfully');
          },
          error: (err) => {
            this.toast.error('Error', err?.message || 'Failed to update blog');
          },
        });
      } else {
        // Create new blog
        this.blogApiService.createBlog(payload).subscribe({
          next: () => {
            // Refresh blogs in store after creation
            this.blogStore.refreshBlogs();
            this.router.navigate(['/dashboard/blogs']);
            this.toast.success('Blog created successfully');
          },
          error: (err) => {
            this.toast.error('Error', err?.message || 'Failed to create blog');
          },
        });
      }
    } else {
      this.blogForm.markAllAsTouched();
      this.toast.warn('Please fill all required fields');
    }
  }
}
