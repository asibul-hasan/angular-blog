import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../assets/data/data';
import { Observable } from 'rxjs';

interface TechCard {
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
}

@Component({
  selector: 'app-tech-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-full min-h-[400px] relative flex items-center justify-center overflow-hidden"
    >
      <div class="carousel-inner" [style.--quantity]="(technologies$ | async)?.length || 12">
        <div
          *ngFor="let tech of technologies$ | async; let i = index"
          class="carousel-card"
          [style.--index]="i"
          [style.--color-card]="tech.color"
        >
          <div class="card-content" [ngStyle]="{ background: tech.bgGradient }">
            <div class="flex flex-col items-center justify-center h-full p-4">
              <div
                class="mb-3 icon-wrapper"
                [style.color]="'rgb(' + tech.color + ')'"
              >
                <img
                  [src]="tech.icon"
                  [alt]="tech.name + ' logo'"
                  class="w-12 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .carousel-inner {
        --w: 120px;
        --h: 160px;
        --translateZ: calc((var(--w) + var(--h)));
        --rotateX: -15deg;
        --perspective: 1000px;
        --quantity: 12;
        position: absolute;
        width: var(--w);
        height: var(--h);
        top: 25%;
        left: calc(50% - (var(--w) / 2));
        z-index: 2;
        transform-style: preserve-3d;
        transform: perspective(var(--perspective));
        animation: rotating 30s linear infinite;
      }

      @keyframes rotating {
        from {
          transform: perspective(var(--perspective)) rotateX(var(--rotateX))
            rotateY(0);
        }
        to {
          transform: perspective(var(--perspective)) rotateX(var(--rotateX))
            rotateY(1turn);
        }
      }

      .carousel-card {
        position: absolute;
        border: 1px solid rgba(var(--color-card), 0.3);
        border-radius: 12px;
        inset: 0;
        transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
          translateZ(var(--translateZ));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        transition: transform 0.28s, box-shadow 0.28s;
        overflow: hidden;
      }

      .carousel-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.15),
          transparent
        );
        z-index: 10;
      }

      .carousel-card:hover {
        transform: scale(1.06)
          rotateY(calc((360deg / var(--quantity)) * var(--index)))
          translateZ(var(--translateZ));
        box-shadow: 0 14px 40px rgba(var(--color-card), 0.65),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      }

      .card-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        position: relative;
      }

      .card-content::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.05) 0%,
          transparent 50%
        );
        pointer-events: none;
      }

      .icon-wrapper img {
        width: 48px;
        height: 48px;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
      }
    `,
  ],
})
export class TechCarouselComponent implements OnInit {
  technologies$!: Observable<any[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.technologies$ = this.dataService.getOurTechnologyData();
  }
}
