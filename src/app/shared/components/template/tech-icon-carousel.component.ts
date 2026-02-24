import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../assets/data/data';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-tech-icon-carousel',
    standalone: true,
    imports: [CommonModule],
  template: `
    <section class="relative overflow-hidden w-full py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Carousel Track Wrapper with CSS Mask for seamless edge fading on ANY background -->
        <div class="relative flex items-center justify-start w-full overflow-hidden" 
             style="-webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);"
             *ngIf="technologies$ | async as technologies">
          
          <div class="tech-carousel-track" style="animation: scroll-right 40s linear infinite;">
            <!-- Original icons -->
            <div *ngFor="let tech of technologies" class="tech-icon-item shrink-0">
              <div class="group relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl cursor-default">
                <!-- Clean, simple white glow for contrast against dark logos instead of a blob -->
                <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <img
                  [src]="tech.icon"
                  [alt]="tech.name"
                  class="relative z-10 w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  [title]="tech.name"
                  loading="lazy"
                />
              </div>
            </div>
            <!-- Duplicated icons for seamless loop -->
            <div *ngFor="let tech of technologies" class="tech-icon-item shrink-0">
              <div class="group relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl cursor-default">
                <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <img
                  [src]="tech.icon"
                  [alt]="tech.name"
                  class="relative z-10 w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  [title]="tech.name"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .tech-carousel-track {
      display: flex;
      width: max-content;
      gap: 2rem;
      will-change: transform;
      padding: 2rem 0;
    }

    .tech-icon-item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }

    @keyframes scroll-right {
      0% {
        transform: translateX(-50%);
      }
      100% {
        transform: translateX(0);
      }
    }
    
    @media (min-width: 768px) {
      .tech-carousel-track {
        gap: 3rem;
      }
    }
  `]
})
export class TechIconCarouselComponent implements OnInit {
    technologies$!: Observable<any[]>;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.technologies$ = this.dataService.getOurTechnologyData();
    }
}
