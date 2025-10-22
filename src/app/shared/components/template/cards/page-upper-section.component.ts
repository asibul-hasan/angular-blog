import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upper-section',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      class="relative w-full h-[60vh] flex items-center justify-center text-white text-center overflow-hidden" 
      role="banner" 
      aria-label="Hero section for {{ title || 'Page' }}"
    >
      <img
        [ngSrc]="'https://res.cloudinary.com/dfcir8epp/image/upload/v1760713890/22589_cgftrk.webp'"
        alt="A modern, abstract background image"
        class="object-cover object-center fixed inset-0 w-full h-full -z-10" 
        fill
        priority
      />

      <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 p-4">
        
        <h1 
          class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase drop-shadow-xl mb-4"
        >
          {{ title || 'Welcome' }}
        </h1>
        
        <nav aria-label="Breadcrumb" *ngIf="title" class="flex items-center space-x-2 text-sm">
          <a routerLink="/" class="text-white hover:text-primary transition duration-300 font-medium">
            Home
          </a>
          <span class="text-gray-400">/</span>
          <span class="text-primary font-semibold capitalize">
            {{ title }}
          </span>
        </nav>
      </div>
    </section>
    
        <!-- <h2 class="text-2xl font-bold mb-4 text-gray-800">Content Scrolls Up!</h2>
        <p class="text-gray-600">This is the lower section of your page (e.g., About Content, Features, etc.). When you scroll down, this white block appears to slide up and cover the fixed hero background, creating the desired modern parallax effect.</p>
        <div class="h-[100vh]"></div> 
        <p class="text-gray-600">Scroll past here to ensure the full effect is visible.</p>
    </section> -->
  `,
  styles: [`
   
    /* Add extra space at the bottom to allow scrolling for the effect */
    :host {
        display: block;
    }
  `],
})
export class UpperSectionComponent {
  @Input() title: string = 'Our Company';
}