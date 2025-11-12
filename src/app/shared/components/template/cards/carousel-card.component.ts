// carousel-card.component.ts
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ServiceCardComponent } from './service-card.component';

@Component({
  selector: 'app-carousel-card',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent,],
  template: `
    <div class="carousel-container relative overflow-hidden w-full py-8" *ngIf="items && items.length > 0">
      <div
        class="carousel-track"
        [class.paused]="isPaused"
        [style.--total-items]="items.length"
        (mouseenter)="pauseScroll()"
        (mouseleave)="resumeScroll()"
      >
        <!-- Original items (all 12 cards) -->
        <div
          *ngFor="let service of items; let i = index"
          class="carousel-item"
        >
          <app-service-section-card
            class="flex flex-col flex-1 justify-between h-full"
            [id]="service.id"
            [title]="service.title"
            [description]="service.description"
            [icon]="service.icon"
          ></app-service-section-card>
        </div>
        <!-- Duplicated items for infinite loop (all 12 cards again) -->
        <div
          *ngFor="let service of items; let i = index"
          class="carousel-item"
        >
          <app-service-section-card
            class="flex flex-col flex-1 justify-between h-full"
            [id]="service.id || i + 1"
            [title]="service.title"
            [description]="service.description"
            [icon]="service.icon"
          ></app-service-section-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    .carousel-container {
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    .carousel-track {
      display: flex;
      gap: 1.5rem;
      animation: scroll-left 30s linear infinite;
      will-change: transform;
    }

    .carousel-track.paused {
      animation-play-state: paused !important;
    }

    .carousel-item {
      flex: 0 0 350px;
      min-height: 320px;
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }

    .carousel-item:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    @keyframes scroll-left {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-50%);
      }
    }
  `,
})
export class CarouselCardComponent implements OnInit, OnDestroy {
  @Input() items: any[] | null = null;
  @ViewChild('carouselTrack') carouselTrack?: ElementRef;

  isPaused = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Log to verify all items are received
    if (isPlatformBrowser(this.platformId) && this.items) {
      console.log('Carousel items count:', this.items.length);
      console.log('Carousel animation duration:', this.items.length * 5 + 's');
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  pauseScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isPaused = true;
    }
  }

  resumeScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isPaused = false;
    }
  }
}
