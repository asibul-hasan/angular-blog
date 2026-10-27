import {
  Component,
  HostListener,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { LanguageService } from '../../services/language/lang.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
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
    <!-- Set min-height with mobile fallback to stabilize initial viewport and avoid CLS -->
    <section class="relative min-h-[600px] md:min-h-screen flex items-center bg-black overflow-hidden" aria-label="Hero">
      <!-- Decorative ambient background blobs: strictly contained with GPU acceleration and translateZ to prevent layout shifts -->
      <div class="pointer-events-none absolute top-0 left-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[150px] opacity-30 transform-gpu" style="background:radial-gradient(circle,#f76179,transparent 70%);contain:strict;will-change:transform,opacity;transform:translateZ(0)"></div>
      <div class="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full blur-[100px] sm:blur-[150px] opacity-20 transform-gpu" style="background:radial-gradient(circle,#1e3e62,transparent 70%);contain:strict;will-change:transform,opacity;transform:translateZ(0)"></div>

      <!-- Hexagon Pattern Overlay Overlay -->
      <div class="absolute inset-0 z-0 opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M30 0l25.98 15v30L30 60 4.02 45V15z\\' fill-opacity=\\'0\\' stroke=\\'%23ffffff\\' stroke-width=\\'1\\' stroke-dasharray=\\'5 5\\'/%3E%3C/svg%3E');"></div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <!-- Content Column -->
        <div class="lg:col-span-6">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-[#f76179] mb-8">
            <span class="w-2 h-2 rounded-full bg-[#f76179] animate-pulse inline-block"></span>
            {{ langService.lang.welcomeToInfoAidTech || 'Welcome to InfoAidTech' }}
          </span>

          <h1 class="text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tighter mb-8">
            <span class="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">We Build</span><br/>
            <span class="bg-gradient-to-r from-[#f76179] via-rose-400 to-[#1e3e62] bg-clip-text text-transparent">Digital</span> Futures.
          </h1>

          <p class="text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-xl mb-10">
            {{ langService.lang.whereVisionMeetsExpertiseCommaInfoAidTechDelivers || 'Where vision meets expertise, InfoAidTech delivers software solutions that scale.' }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/contact" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-sm hover:scale-105 transition-all shadow-xl"
               style="background:linear-gradient(135deg,#f76179,#c0365a);box-shadow:0 8px 32px rgba(247,97,121,0.3)">
              {{ langService.lang.getStarted || 'Start a Project' }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a href="/service" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm border border-white/15 hover:bg-white/5 transition-all">
              {{ langService.lang.applyNow || 'Our Services' }}
            </a>
          </div>

          <!-- Trust metrics: text-gray-400 satisfies WCAG AA 4.5:1 contrast against black background -->
          <div class="mt-12 pt-8 border-t border-white/10 flex items-center gap-8">
            <div>
              <p class="text-2xl font-black text-white">120<span class="text-[#f76179]">+</span></p>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Projects</p>
            </div>
            <div class="w-px h-10 bg-white/10"></div>
            <div>
              <p class="text-2xl font-black text-white">50<span class="text-[#f76179]">+</span></p>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Clients</p>
            </div>
            <div class="w-px h-10 bg-white/10"></div>
            <div>
              <p class="text-2xl font-black text-white">99<span class="text-[#f76179]">%</span></p>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Success</p>
            </div>
          </div>
        </div>

        <!-- Image Column -->
        <div class="lg:col-span-6 relative">
          <!-- Glow behind image -->
          <div class="absolute inset-0 bg-[#f76179]/20 blur-[100px] rounded-full"></div>
          
          <!-- Explicit aspect-square container prevents layout shift while image loads -->
          <div class="relative rounded-[40px] overflow-hidden p-2 aspect-square"
               style="background:linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.1)">
             <!-- Explicit 500x500 dimensions match Cloudinary source aspect ratio, eliminating CLS -->
             <img ngSrc="v1755598681/infoaidtech-hero-img_jfmruv.webp" 
                  sizes="(min-width: 1024px) 500px, (min-width: 768px) 50vw, calc(100vw - 32px)"
                  alt="InfoAidTech Hero" class="w-full h-full rounded-[32px] object-cover" width="500" height="500" priority />
          </div>

          <!-- Floating abstract badges: hidden on small mobile screens (<640px) to prevent horizontal viewport shift -->
          <div class="hidden sm:flex absolute -left-8 top-1/4 px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#f76179]/20 flex items-center justify-center">🎯</div>
              <div>
                <p class="text-white font-bold text-sm">Top Rated</p>
                <p class="text-gray-400 text-xs">Agency 2024</p>
              </div>
            </div>
          </div>

          <div class="hidden sm:flex absolute -right-8 bottom-1/4 px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl animate-[float_8s_ease-in-out_infinite_reverse]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#1e3e62]/40 flex items-center justify-center text-white">⚡</div>
              <div>
                <p class="text-white font-bold text-sm">Fast Delivery</p>
                <p class="text-gray-400 text-xs">Agile process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
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
    // Check platform properly without inverting platformId token
    this.isMobile = isPlatformBrowser(this.platformId) && window.innerWidth < 768;
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