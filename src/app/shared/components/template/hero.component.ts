import {
  Component,
  HostListener,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../services/language/lang.service';
import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }

      @keyframes pulse-glow {
        0%,
        100% {
          opacity: 0.3;
          filter: blur(0px);
        }
        50% {
          opacity: 0.6;
          filter: blur(2px);
        }
      }

      .hex-float {
        animation: float 8s ease-in-out infinite;
        will-change: transform;
      }

      .hex-glow {
        animation: pulse-glow 4s ease-in-out infinite;
        will-change: opacity, filter;
      }

      @media (max-width: 768px) {
        .hex-float {
          animation-duration: 12s;
        }
        .hex-glow {
          animation-duration: 6s;
        }
        svg {
          opacity: 0.3;
        }
      }
    `,
  ],
  template: `
    <section class="section-hero relative" (mousemove)="onMouseMove($event)">
      <!-- Hexagon Background -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- SVG Hexagon Pattern - Main Grid -->
        <svg
          class="w-full h-full opacity-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <!-- Small hexagons -->
            <pattern
              id="hex-small"
              x="0"
              y="0"
              width="80"
              height="69"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="40,0 74.6,20 74.6,60 40,80 5.4,60 5.4,20"
                fill="none"
                stroke="#3B82F6"
                stroke-width="0.5"
                opacity="0.4"
              />
            </pattern>

            <!-- Medium hexagons -->
            <pattern
              id="hex-medium"
              x="0"
              y="0"
              width="120"
              height="104"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="60,0 111.9,30 111.9,90 60,120 8.1,90 8.1,30"
                fill="none"
                stroke="#60A5FA"
                stroke-width="0.8"
                opacity="0.3"
              />
            </pattern>

            <!-- Large hexagons -->
            <pattern
              id="hex-large"
              x="0"
              y="0"
              width="180"
              height="156"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="90,0 167.8,45 167.8,135 90,180 12.2,135 12.2,45"
                fill="none"
                stroke="#2563EB"
                stroke-width="1"
                opacity="0.2"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#hex-small)" />
          <rect width="100%" height="100%" fill="url(#hex-medium)" />
          <rect width="100%" height="100%" fill="url(#hex-large)" />
        </svg>

        <!-- Floating animated hexagons with glow -->
        <div class="absolute top-1/4 right-1/4">
          <div
            class="absolute w-32 h-36 border-2 border-blue-400 hex-float hex-glow"
            style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 0s;"
          ></div>
          <div
            class="absolute w-28 h-32 border-2 border-blue-500 hex-float hex-glow"
            style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); transform: rotate(60deg) translateX(100px); animation-delay: 1s;"
          ></div>
          <div
            class="absolute w-36 h-40 border border-blue-300 hex-float hex-glow"
            style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); transform: rotate(120deg) translateX(130px); animation-delay: 2s;"
          ></div>
          <div
            class="absolute w-24 h-28 border border-blue-600 hex-float hex-glow"
            style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); transform: rotate(180deg) translateX(80px); animation-delay: 3s;"
          ></div>
        </div>

        <!-- Scattered accent hexagons -->
        <div
          class="absolute top-1/6 left-1/5 w-20 h-24 border border-blue-400 opacity-20 hex-float"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 0.5s; animation-duration: 10s;"
        ></div>
        <div
          class="absolute top-2/3 right-1/4 w-16 h-20 border border-blue-500 opacity-25 hex-float"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 1.5s; animation-duration: 12s;"
        ></div>
        <div
          class="absolute top-1/2 left-1/4 w-24 h-28 border border-blue-300 opacity-15 hex-float"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 2.5s; animation-duration: 9s;"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/3 w-18 h-22 border border-blue-400 opacity-20 hex-float"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 3.5s; animation-duration: 11s;"
        ></div>
        <div
          class="absolute top-3/4 left-2/3 w-22 h-26 border border-blue-600 opacity-18 hex-float"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); animation-delay: 4s; animation-duration: 13s;"
        ></div>

        <!-- Interactive hexagons that respond to mouse (reversed position for parallax) -->
        <div
          class="absolute w-40 h-46 border-2 border-blue-500 opacity-25 transition-all duration-700"
          [style.top.%]="30 + (mouseY - 50) * 0.1"
          [style.right.%]="20 + (mouseX - 50) * 0.1"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"
        ></div>
        <div
          class="absolute w-32 h-36 border border-blue-400 opacity-20 transition-all duration-1000"
          [style.top.%]="60 - (mouseY - 50) * 0.08"
          [style.left.%]="25 - (mouseX - 50) * 0.08"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"
        ></div>
        <div
          class="absolute w-28 h-32 border border-blue-600 opacity-22 transition-all duration-900"
          [style.bottom.%]="25 + (mouseY - 50) * 0.06"
          [style.right.%]="40 + (mouseX - 50) * 0.06"
          style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"
        ></div>
      </div>

      <!-- Content -->
      <div
        class="relative z-10 grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 justify-center items-center"
      >
        <div
          class="mr-auto place-self-center lg:col-span-7 mt-[60px] lg:mt-[100px] md:pt-20"
          [@staggerText]
        >
          <h2 class="section-sub-title">
            {{ langService.lang.welcomeToInfoAidTech }}
          </h2>
          <h1 class="section-title dark:text-white">
            {{ langService.lang.revolutionizingITServicesforaDigitalEra }}
          </h1>
          <p
            class="max-w-xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
          >
            {{
              langService.lang.whereVisionMeetsExpertiseCommaInfoAidTechDelivers
            }}
          </p>
          <div class="flex flex-col lg:flex-row">
            <a
              href="#"
              class="inline-flex items-center justify-center px-5 py-3 mb-4 lg:mb-0 mr-0 lg:mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 w-full lg:w-auto"
            >
              {{ langService.lang.getStarted }}
              <svg
                class="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 w-full lg:w-auto"
            >
              {{ langService.lang.applyNow }}
            </a>
          </div>
        </div>
        <div class="lg:mt-0 lg:col-span-5 lg:flex md:pt-20" [@fadeIn]>
          <!-- <img
            src="https://res.cloudinary.com/dfcir8epp/image/upload/v1755598681/infoaidtech-hero-img_jfmruv.png"
            alt="mockup"
            class="w-full h-auto object-contain"
          /> -->

          <img
  src="https://res.cloudinary.com/dfcir8epp/image/upload/v1755598681/infoaidtech-hero-img_jfmruv.webp"
  width="1200"
  height="800"
  priority
  fetchpriority="high"
  alt="mockup: infoaidtech hero image"
  class="w-full h-auto object-contain"
/>

        </div>
      </div>
    </section>
  `,
  animations: [
    trigger('staggerText', [
      transition(':enter', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('150ms', [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms 300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HeroComponent {
  mouseX: number = 50;
  mouseY: number = 50;
  isMobile: boolean = false;
  gradientSizePrimary: string = '600';
  gradientSizeSecondary: string = '400';

  constructor(
    public langService: LanguageService,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isMobile = isPlatformBrowser(!this.platformId);
    this.gradientSizePrimary = this.isMobile ? '400' : '600';
    this.gradientSizeSecondary = this.isMobile ? '300' : '400';
    if (this.isMobile) {
      this.mouseX = 50;
      this.mouseY = 50;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMobile) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    this.mouseY = ((event.clientY - rect.top) / rect.height) * 100;
  }
}