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
      <!-- Gradient overlay matching choose-us section -->
      <!-- <div class="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-[#f76179]/5 pointer-events-none"></div> -->
      
      <!-- Floating orbs for depth -->
      <!-- <div class="absolute top-1/4 left-10 w-72 h-72 bg-[#f76179]/10 rounded-full blur-3xl animate-float"></div> -->
      <!-- <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div> -->

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Section Header -->
        <!-- <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <span class="w-2 h-2 rounded-full bg-[#f76179] animate-pulse"></span>
            <span class="text-sm font-medium text-white/70 tracking-wide">Technologies We Use</span>
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Our Tech Stack</h2>
        </div> -->

        <!-- Carousel Track -->
        <div class="tech-carousel-track" *ngIf="technologies$ | async as technologies">
          <!-- Original icons -->
          <div *ngFor="let tech of technologies" class="tech-icon-item">
            <div class="tech-icon-wrapper">
              <img
                [src]="tech.icon"
                [alt]="tech.name"
                class="w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-300"
                [title]="tech.name"
              />
            </div>
          </div>
          <!-- Duplicated icons for seamless loop -->
          <div *ngFor="let tech of technologies" class="tech-icon-item">
            <div class="tech-icon-wrapper">
              <img
                [src]="tech.icon"
                [alt]="tech.name"
                class="w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-300"
                [title]="tech.name"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .tech-carousel-track {
      display: flex;
      gap: 3rem;
      animation: scroll-left 40s linear infinite;
      will-change: transform;
    }

    .tech-icon-item {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .tech-icon-wrapper {
      padding: 1.5rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .tech-icon-wrapper:hover {
      background: linear-gradient(135deg, rgba(247, 97, 121, 0.1), rgba(255, 255, 255, 0.05));
      border-color: rgba(247, 97, 121, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px -10px rgba(247, 97, 121, 0.3);
    }

    @keyframes scroll-left {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    @keyframes floatDelayed {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(20px) scale(1.05); }
    }

    .animate-float { 
      animation: float 8s ease-in-out infinite; 
    }

    .animate-float-delayed { 
      animation: floatDelayed 10s ease-in-out infinite; 
      animation-delay: 1s; 
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
