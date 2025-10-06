import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TechCard {
  name: string;
  icon: string; // path to svg in assets
  color: string; // rgb values
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
                  class="w-15 h-15"
                />
              </div>
              <!-- <h3 class="text-white font-semibold text-sm text-center">
                {{ tech.name }}
              </h3> -->
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
        border: 2px solid rgba(var(--color-card));
        border-radius: 12px;
        inset: 0;
        transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
          translateZ(var(--translateZ));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        transition: transform 0.28s, box-shadow 0.28s;
      }

      .carousel-card:hover {
        transform: scale(1.06)
          rotateY(calc((360deg / var(--quantity)) * var(--index)))
          translateZ(var(--translateZ));
        box-shadow: 0 14px 40px rgba(var(--color-card), 0.65);
      }

      .card-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }

      .icon-wrapper img {
        width: 40px;
        height: 40px;
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
        'radial-gradient(circle, rgba(97, 218, 251, 0.2) 0%, rgba(97, 218, 251, 0.6) 80%, rgba(97, 218, 251, 0.9) 100%)',
    },
    {
      name: 'Vue.js',
      icon: '../../../../assets/icons/vue-dot-js.svg',
      color: '65, 184, 131',
      bgGradient:
        'radial-gradient(circle, rgba(65, 184, 131, 0.2) 0%, rgba(65, 184, 131, 0.6) 80%, rgba(65, 184, 131, 0.9) 100%)',
    },
    {
      name: 'Angular',
      icon: '../../../../assets/icons/angular.svg',
      color: '221, 0, 49',
      bgGradient:
        'radial-gradient(circle, rgba(221, 0, 49, 0.2) 0%, rgba(221, 0, 49, 0.6) 80%, rgba(221, 0, 49, 0.9) 100%)',
    },
    {
      name: 'Django',
      icon: '../../../../assets/icons/django.svg',
      color: '9, 46, 32',
      bgGradient:
        'radial-gradient(circle, rgba(9, 46, 32, 0.3) 0%, rgba(9, 46, 32, 0.7) 80%, rgba(9, 46, 32, 0.95) 100%)',
    },
    {
      name: 'React Native',
      icon: '../../../../assets/icons/react-native.svg',
      color: '97, 218, 251',
      bgGradient:
        'radial-gradient(circle, rgba(97, 218, 251, 0.2) 0%, rgba(97, 218, 251, 0.6) 80%, rgba(97, 218, 251, 0.9) 100%)',
    },
    {
      name: 'Next.js',
      icon: '../../../../assets/icons/nextjs.svg',
      color: '255, 255, 255',
      bgGradient:
        'radial-gradient(circle, rgba(33, 117, 155, 0.2) 0%, rgba(33, 117, 155, 0.6) 80%, rgba(33, 117, 155, 0.9) 100%)',
    },
    {
      name: 'FastAPI',
      icon: '../../../../assets/icons/fastapi.svg',
      color: '0, 150, 136',
      bgGradient:
        'radial-gradient(circle, rgba(0, 150, 136, 0.2) 0%, rgba(0, 150, 136, 0.6) 80%, rgba(0, 150, 136, 0.9) 100%)',
    },
    {
      name: 'jQuery',
      icon: '../../../../assets/icons/jquery.svg',
      color: '0, 101, 166',
      bgGradient:
        'radial-gradient(circle, rgba(0, 101, 166, 0.2) 0%, rgba(0, 101, 166, 0.6) 80%, rgba(0, 101, 166, 0.9) 100%)',
    },
    {
      name: 'Node.js',
      icon: '../../../../assets/icons/nodejs.svg',
      color: '104, 160, 99',
      bgGradient:
        'radial-gradient(circle, rgba(104, 160, 99, 0.2) 0%, rgba(104, 160, 99, 0.6) 80%, rgba(104, 160, 99, 0.9) 100%)',
    },
    {
      name: 'Ruby On Rails',
      icon: '../../../../assets/icons/rubyonrails.svg',
      color: '204, 0, 0',
      bgGradient:
        'radial-gradient(circle, rgba(204, 0, 0, 0.2) 0%, rgba(204, 0, 0, 0.6) 80%, rgba(204, 0, 0, 0.9) 100%)',
    },
    {
      name: 'WordPress',
      icon: '../../../../assets/icons/wordpress.svg',
      color: '33, 117, 155',
      bgGradient:
        'radial-gradient(circle, rgba(33, 117, 155, 0.2) 0%, rgba(33, 117, 155, 0.6) 80%, rgba(33, 117, 155, 0.9) 100%)',
    },
    {
      name: 'Shopify',
      icon: '../../../../assets/icons/shopify.svg',
      color: '150, 184, 62',
      bgGradient:
        'radial-gradient(circle, rgba(150, 184, 62, 0.2) 0%, rgba(150, 184, 62, 0.6) 80%, rgba(150, 184, 62, 0.9) 100%)',
    },
  ];
}
