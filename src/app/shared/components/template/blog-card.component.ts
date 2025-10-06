import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BlogApiService } from '../../services/blog/blog.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  imports: [RouterModule],
  // templateUrl: './blog-card.html',
  template: `<div
    class="max-w-sm rounded-lg bg-white dark:bg-gray-900 flex flex-col h-full"
  >
    <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
      <a>
        <img
          class="transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
        transform group-hover:scale-110 w-full h-full object-cover"
          [src]="imgUrl"
          [alt]="title"
        />
      </a>
    </div>
    <div class="p-5 flex flex-col flex-grow">
      <a>
        <h5
          class="mb-2 text-2xl font-bold tracking-tight text-blue-950 dark:text-white"
        >
          {{ title }}
        </h5>
      </a>

      <p
        class="mb-4 font-normal text-gray-700 dark:text-gray-400 flex-grow"
        [innerHTML]="description"
      ></p>

      <!-- <a
        class="cursor-pointer mt-auto self-end inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        (click)="onLinkClick($event)"
      >
        {{ buttonText }}
        <svg
          class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a> -->
      <button
        class="rounded-md py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md 
               bg-slate-800 text-white 
               hover:bg-slate-700 hover:shadow-lg 
               focus:bg-slate-700 focus:shadow-none 
               active:bg-slate-700 active:shadow-none
               disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
        (click)="onLinkClick($event)"
      >
        {{ buttonText }}
      </button>
    </div>
  </div> `,
  // styleUrl: './blog-card.css',
})
export class BlogCard implements OnInit {
  @Input() blog: any = {};

  imgUrl: string = '';
  title: string = '';
  description: string = '';
  buttonText: string = 'Read More';

  constructor(private apiService: BlogApiService, private router: Router) {}
  ngOnInit(): void {
    this.imgUrl =
      this.blog?.image ??
      'https://res.cloudinary.com/dfcir8epp/image/upload/v1755703537/FFFFFF_hi6y3z.svg';
    this.title = this.blog?.title || 'Untitled';
    this.description = this.blog?.short_desc || 'No description available';
  }
  onLinkClick(event: Event) {
    if (this.blog?.slug) {
      this.router.navigate([`/blog/${this.blog.slug}`], {
        state: { blog: this.blog._id },
      });
    } else {
      console.error('Blog slug is missing');
    }
  }
}
