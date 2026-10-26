import {
  Component,
  OnInit,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlogApiService } from '../../../../../shared/services/blog/blog.service';
import { BlogStoreService } from '../../../../../core/services/blog-store.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    FormsModule,
    CommonModule,
    RouterModule,
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
  isSaving = signal(false);
  activeTab = signal<'editor' | 'preview'>('editor');
  
  // Interactive tags list
  tagsList = signal<string[]>([]);
  currentTagInput = signal<string>('');

  // Live writing telemetry
  wordCount = signal<number>(0);
  readingTime = signal<number>(1);
  charCount = signal<number>(0);

  // Auto-slug sync toggle
  isAutoSlug = signal<boolean>(true);

  private subscription = new Subscription();

  tinymceConfig: any = {
    plugins: 'lists link image table code help wordcount autoresize media codesample hr',
    toolbar:
      'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | codesample blockquote | link image table | hr removeformat code',
    toolbar_mode: 'sliding',
    min_height: 480,
    max_height: 800,
    autoresize_bottom_margin: 30,
    menubar: false,
    branding: false,
    skin: 'oxide-dark',
    content_css: 'dark',
    statusbar: true,
    elementpath: false,
    resize: false,
    placeholder: 'Craft your narrative with rich typography, code snippets, visuals, and insights...',
    paste_data_images: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    content_style: `
      body {
        background-color: #0b1120 !important;
        color: #e2e8f0 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", Helvetica, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.8 !important;
        padding: 24px 28px !important;
        max-width: 100% !important;
        margin: 0 auto !important;
      }
      p { margin-bottom: 1.25em; color: #cbd5e1; }
      h1, h2, h3, h4 { color: #f8fafc; font-weight: 700; line-height: 1.3; margin-top: 1.8em; margin-bottom: 0.6em; }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.3em; }
      h3 { font-size: 1.25rem; }
      blockquote {
        border-left: 4px solid #6366f1;
        padding: 8px 18px;
        margin: 1.5em 0;
        background: rgba(99, 102, 241, 0.08);
        border-radius: 0 8px 8px 0;
        color: #a5b4fc;
        font-style: italic;
      }
      pre, code {
        background: #020617 !important;
        color: #38bdf8 !important;
        border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
      }
      code { padding: 2px 6px; font-size: 0.9em; }
      pre { padding: 14px 18px; border: 1px solid rgba(255, 255, 255, 0.1); overflow-x: auto; }
      a { color: #818cf8; text-decoration: underline; text-underline-offset: 3px; }
      a:hover { color: #a5b4fc; }
      img { max-width: 100%; height: auto; border-radius: 12px; margin: 1.5em 0; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
      table { border-collapse: collapse; width: 100%; margin: 1.5em 0; }
      th, td { border: 1px solid rgba(255, 255, 255, 0.12); padding: 10px 14px; }
      th { background: rgba(255, 255, 255, 0.04); font-weight: 600; color: #f8fafc; }
      hr { border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 2em 0; }
    `,
    setup: (editor: any) => {
      editor.on('input change keyup NodeChange SetContent', () => {
        const text = editor.getContent({ format: 'text' }) || '';
        this.updateStats(text);
      });
    },
  };

  // Readiness Checklist Helpers
  readonly isTitleValid = computed(() => (this.blogForm?.get('title')?.value || '').trim().length >= 5);
  readonly isContentValid = computed(() => (this.blogForm?.get('blog_content')?.value || '').trim().length >= 50);
  readonly isCategoryValid = computed(() => (this.blogForm?.get('category')?.value || []).length > 0);
  readonly isSlugValid = computed(() => (this.blogForm?.get('slug')?.value || '').trim().length > 0);
  readonly isSeoValid = computed(() => (this.blogForm?.get('meta_description')?.value || '').trim().length >= 20);

  readonly readinessScore = computed(() => {
    let score = 0;
    if (this.isTitleValid()) score += 20;
    if (this.isContentValid()) score += 25;
    if (this.isCategoryValid()) score += 20;
    if (this.isSlugValid()) score += 15;
    if (this.isSeoValid()) score += 20;
    return score;
  });

  constructor() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: [''],
      blog_content: ['', Validators.required],
      slug: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        ],
      ],
      meta_description: ['', [Validators.required, Validators.maxLength(160)]],
      category: [[], [Validators.required]],
      tags: [''],
      image: [''],
      isPublished: [true],
      author: ['Asibul Hasan'],
      updatedAt: [new Date()],
      _id: [''],
    });

    this.route.queryParams.subscribe((params) => {
      this.blogId.set(params['id']);
    });

    // Auto-generate slug from title if enabled
    this.subscription.add(
      this.blogForm.get('title')?.valueChanges.subscribe((value) => {
        if (!this.isAutoSlug()) return;
        const slugControl = this.blogForm.get('slug');
        if (slugControl && value) {
          const slug = this.generateSlug(value);
          slugControl.setValue(slug, { emitEvent: false });
        }
      })
    );

    // Sync title character count
    this.subscription.add(
      this.blogForm.get('title')?.valueChanges.subscribe(() => {
        this.recalculateAllStats();
      })
    );
  }

  ngOnInit(): void {
    this.blogStore.loadCategories();

    this.subscription.add(
      this.blogStore.categories$.subscribe((categories) => {
        this.categories.set(categories);
        if (this.blogId() && categories.length > 0) {
          this.loadExistingBlog();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  onManualSlugEdit(): void {
    this.isAutoSlug.set(false);
  }

  resetAutoSlug(): void {
    this.isAutoSlug.set(true);
    const title = this.blogForm.get('title')?.value || '';
    if (title) {
      this.blogForm.get('slug')?.setValue(this.generateSlug(title));
    }
  }

  addTag(): void {
    const raw = this.currentTagInput().trim().toLowerCase().replace(/^#/, '');
    if (!raw) return;

    // Handle comma-separated input
    const parts = raw.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
    const current = [...this.tagsList()];

    for (const part of parts) {
      if (!current.includes(part) && current.length < 10) {
        current.push(part);
      }
    }

    this.tagsList.set(current);
    this.blogForm.get('tags')?.setValue(current.join(', '));
    this.currentTagInput.set('');
  }

  removeTag(tagToRemove: string): void {
    const updated = this.tagsList().filter((t) => t !== tagToRemove);
    this.tagsList.set(updated);
    this.blogForm.get('tags')?.setValue(updated.join(', '));
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  setCoverImage(url: string): void {
    this.blogForm.get('image')?.setValue(url.trim());
  }

  clearCoverImage(): void {
    this.blogForm.get('image')?.setValue('');
  }

  updateStats(text: string): void {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    this.wordCount.set(words);
    this.charCount.set(text.length);
    this.readingTime.set(Math.max(1, Math.ceil(words / 200)));
  }

  private recalculateAllStats(): void {
    const content = this.blogForm.get('blog_content')?.value || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    this.updateStats(text);
  }

  private loadExistingBlog(): void {
    this.blogApiService.getBlogById(this.blogId()!).subscribe((data) => {
      const blog = data.body[0];
      if (!blog) return;

      let categoryIds: string[] = [];
      if (blog.category) {
        const categories = Array.isArray(blog.category) ? blog.category : [blog.category];
        categoryIds = categories.map((cat: any) =>
          typeof cat === 'object' ? cat._id : cat
        );
      }

      // Populate tags list
      const tagsArray: string[] = Array.isArray(blog.tags)
        ? blog.tags
        : typeof blog.tags === 'string'
        ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
      this.tagsList.set(tagsArray);

      // In edit mode, disable auto-slug to preserve existing URL
      this.isAutoSlug.set(false);

      this.blogForm.patchValue(
        {
          title: blog.title,
          description: blog.description || blog.meta_description,
          blog_content: blog.blog_content,
          meta_description: blog.meta_description,
          slug: blog.slug,
          category: categoryIds,
          tags: tagsArray.join(', '),
          image: blog.image || '',
          isPublished: blog.isPublished ?? true,
          author: blog.author || 'Asibul Hasan',
          updatedAt: blog.updatedAt,
          _id: blog._id,
        },
        { emitEvent: false }
      );

      this.recalculateAllStats();
    });
  }

  getCategoryNames(): string {
    const selectedIds = this.blogForm.get('category')?.value || [];
    const all = this.categories();
    return selectedIds
      .map((id: string) => all.find((c) => c._id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Uncategorized';
  }

  createBlog(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      this.toast.warn('Please complete all required fields (Title, Content, Slug, Category, and Meta Description).');
      return;
    }

    this.isSaving.set(true);
    const formValue = this.blogForm.value;

    const payload = {
      ...formValue,
      description: formValue.description || formValue.meta_description,
      tags: this.tagsList(),
      category: Array.isArray(formValue.category)
        ? formValue.category
        : [formValue.category].filter(Boolean),
    };

    if (!formValue._id) {
      delete payload._id;
    }

    const blogId = formValue._id;
    if (blogId) {
      this.blogApiService.updateBlog(blogId, payload).subscribe({
        next: () => {
          this.blogStore.refreshBlogs();
          this.isSaving.set(false);
          this.toast.success('Article published and synchronized successfully');
          this.router.navigate(['/dashboard/blog-management/blogs']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.toast.error('Update Failed', err?.message || 'Failed to update article');
        },
      });
    } else {
      this.blogApiService.createBlog(payload).subscribe({
        next: () => {
          this.blogStore.refreshBlogs();
          this.isSaving.set(false);
          this.toast.success('Story published and live on the network');
          this.router.navigate(['/dashboard/blog-management/blogs']);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.toast.error('Publish Failed', err?.message || 'Failed to create article');
        },
      });
    }
  }
}
