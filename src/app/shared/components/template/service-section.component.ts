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
    <section class="section-services relative overflow-hidden">

      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-1/4 left-10 w-72 h-72 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-float"
        ></div>
        <div
          class="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"
        ></div>
      </div>
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10"
      >
        
         <div class="space-y-6 text-center max-w-4xl mx-auto">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span
                  class="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"
                ></span>
                <span class="text-sm font-medium text-white/70 tracking-wide"
                  >{{ langService.lang.whatWeOffer }}</span
                >
              </div>

              <h2
                class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
                {{ langService.lang.ourServices }}
              </h2>

              <p class="text-xl text-white/60 leading-relaxed">
                {{
                  langService.lang
                    .weProvideTheBestServiceForYou
                }}
              </p>

              <p class="text-base text-white/50 leading-relaxed">
                {{
                  langService.lang
                    .werededicatedToGivingYouTopNotchServiceThatsJustRightForYouWeMakeSureEveryTimeWeHelpYouItsEvenBetterThanYouExpectedWhetherYouNeedAdviceTechHelpOrAnythingElseWereHereToMakeSureYouReachYourGoalsSmoothlyAndSuccessfully
                }}
              </p>
            </div>
        <div class=" sticky top-20">
          <!-- <div
            class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-bg-richblack)] to-transparent z-10 pointer-events-none lg:block hidden"
          ></div>
          <div
            class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-bg-richblack)] to-transparent z-10 pointer-events-none lg:block hidden"
          ></div> -->
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
