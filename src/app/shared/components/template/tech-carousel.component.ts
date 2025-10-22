import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      <div class="carousel-inner" [style.--quantity]="technologies.length">
        <div
          *ngFor="let tech of technologies; let i = index"
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
export class TechCarouselComponent {
  technologies: TechCard[] = [
    {
      name: 'React',
      icon: '../../../../assets/icons/react.svg',
      color: '97, 218, 251',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(97, 218, 251, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(97, 218, 251, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Vue.js',
      icon: '../../../../assets/icons/vue-dot-js.svg',
      color: '65, 184, 131',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(65, 184, 131, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(65, 184, 131, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Angular',
      icon: '../../../../assets/icons/angular.svg',
      color: '221, 0, 49',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(221, 0, 49, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(221, 0, 49, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Django',
      icon: '../../../../assets/icons/django.svg',
      color: '9, 46, 32',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(12, 74, 110, 0.2) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(9, 46, 32, 0.15) 0%, transparent 50%)',
    },
    {
      name: 'React Native',
      icon: '../../../../assets/icons/react-native.svg',
      color: '97, 218, 251',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(97, 218, 251, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(136, 146, 255, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Next.js',
      icon: '../../../../assets/icons/nextjs.svg',
      color: '255, 255, 255',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(100, 100, 100, 0.12) 0%, transparent 50%)',
    },
    {
      name: 'FastAPI',
      icon: '../../../../assets/icons/fastapi.svg',
      color: '0, 150, 136',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(0, 150, 136, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(5, 205, 153, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'jQuery',
      icon: '../../../../assets/icons/jquery.svg',
      color: '0, 101, 166',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(0, 101, 166, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(19, 147, 217, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Node.js',
      icon: '../../../../assets/icons/nodejs.svg',
      color: '104, 160, 99',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(104, 160, 99, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(104, 160, 99, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Ruby On Rails',
      icon: '../../../../assets/icons/rubyonrails.svg',
      color: '204, 0, 0',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(204, 0, 0, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(255, 77, 77, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'WordPress',
      icon: '../../../../assets/icons/wordpress.svg',
      color: '33, 117, 155',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(33, 117, 155, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(33, 117, 155, 0.1) 0%, transparent 50%)',
    },
    {
      name: 'Shopify',
      icon: '../../../../assets/icons/shopify.svg',
      color: '150, 184, 62',
      bgGradient:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%), radial-gradient(ellipse at top left, rgba(150, 184, 62, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(150, 184, 62, 0.1) 0%, transparent 50%)',
    },
  ];
}
