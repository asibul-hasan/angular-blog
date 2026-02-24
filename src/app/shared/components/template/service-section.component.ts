// service-section.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language/lang.service';
import { DataService } from '../../../../assets/data/data';
import { CarouselCardComponent } from './cards/carousel-card.component';

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [CommonModule, CarouselCardComponent],
  template: `
    <section class="relative bg-black text-white py-24 md:py-32 overflow-hidden border-y border-white/[0.06]">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="pointer-events-none absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#f76179]/10 rounded-full blur-[150px] animate-float"></div>
        <div class="pointer-events-none absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-[#1e3e62]/10 rounded-full blur-[150px] animate-float-delayed"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div class="space-y-6 text-center max-w-4xl mx-auto mb-20">
              <span class="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-[#f76179]">
                <span class="w-2 h-2 rounded-full bg-[#f76179] animate-pulse inline-block"></span>
                {{ langService.lang.whatWeOffer || 'What We Offer' }}
              </span>

              <h2 class="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
                {{ langService.lang.ourServices || 'Our Services' }}
              </h2>

              <p class="text-xl text-gray-400 font-medium leading-relaxed">
                {{ langService.lang.weProvideTheBestServiceForYou || 'We provide the best service for you.' }}
              </p>

              <p class="text-base text-gray-500 leading-relaxed max-w-3xl mx-auto">
                {{ langService.lang.werededicatedToGivingYouTopNotchServiceThatsJustRightForYouWeMakeSureEveryTimeWeHelpYouItsEvenBetterThanYouExpectedWhetherYouNeedAdviceTechHelpOrAnythingElseWereHereToMakeSureYouReachYourGoalsSmoothlyAndSuccessfully || 'We\\'re dedicated to giving you top-notch service that\\'s just right for you.' }}
              </p>
         </div>
         
        <div class="relative">
          <app-carousel-card [items]="services$ | async"></app-carousel-card>
        </div>
      </div>
    </section>
  `,
  styles: `
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }
    @keyframes floatDelayed {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(20px) scale(1.05); }
    }
    .animate-float { animation: float 8s ease-in-out infinite; }
    .animate-float-delayed { animation: floatDelayed 10s ease-in-out infinite; animation-delay: 1s; }
  `,
})
export class ServiceSectionComponent {
  services$!: Observable<any[]>;
  constructor(public langService: LanguageService, private data: DataService) {
    this.services$ = this.data.getOurServiceData();
  }
}
