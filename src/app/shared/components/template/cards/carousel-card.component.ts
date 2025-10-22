// carousel-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from './service-card.component';
import { HorizontalScrollDirective } from './horizontal-scroll.directive';

@Component({
  selector: 'app-carousel-card',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, HorizontalScrollDirective],
  template: `
    <div
      appHorizontalScroll
      class="flex flex-col lg:flex-row overflow-y-auto lg:overflow-x-auto lg:overflow-y-hidden snap-y lg:snap-x snap-mandatory gap-4 scrollbar-hide scroll-smooth"
    >
      <div
        *ngFor="let service of items; let i = index"
        class="flex-none w-full lg:w-1/4 snap-start min-h-[320px] m-3 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
      >
        <app-service-section-card
          class="flex flex-col flex-1 justify-between h-full"
          [id]="i + 1"
          [title]="service.title"
          [description]="service.description"
          [icon]="service.icon"
        ></app-service-section-card>
      </div>
    </div>
  `,
  styles: `
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `,
})
export class CarouselCardComponent {
  @Input() items: any[] | null = null;
}
