import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChooseUsCardComponent } from './service-card.component';
import { LanguageService } from '../../services/language/lang.service';
import { SectionTitleCard } from './title-section-card.component';
import { DataService } from '../../../../assets/data/data';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, ChooseUsCardComponent],
  template: `
   <section class="section-about">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-16 lg:py-20">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start relative">
          <!-- Left: Sticky Image -->
          <div class="lg:sticky lg:top-0">
            <img
              src="https://res.cloudinary.com/dfcir8epp/image/upload/v1755605324/White-and-Red-Illustrative-Software-Development_fqzphq.webp"
              alt="Section Image"
              class="w-full md:w-auto rounded-xl "
            />
          </div>

          <!-- Right: Scrollable Content -->
          <div
            class="space-y-8 order-1 lg:order-2"
            *ngIf="langService.isLoaded$ | async"
          >
            <!-- Header -->
              <div class="space-y-6">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span
                  class="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"
                ></span>
                <span class="text-sm font-medium text-white/70 tracking-wide"
                  > {{langService.lang.aboutUs}} </span
                >
              </div>

              <h2
                class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
                {{ langService.lang.aboutInfoaidTech }}
              </h2>

              <p class="text-xl text-white/60 leading-relaxed max-w-xl">
                {{
                  langService.lang
                    .mergingVisionAndExpertiseToEmpowerBusinessesInTheDigitalEra
                }}
              </p>

              <p class="text-base text-white/50 leading-relaxed">
                {{
                  langService.lang
                    .weCombineVisionAndExpertiseToPropelYourBusinessForwardWithAKeenEyeOnTheDigitalLandscapeWeEnsureYourSuccessInTodaysCompetitiveMarket
                }}
              </p>
            </div>
           

            <!-- Feature Cards -->
            <div class="space-y-4">
              <div
                *ngFor="let list of dataList$ | async; let i = index"
                [style.animation-delay]="i * 100 + 'ms'"
                class="animate-slide-in"
              >
                <app-service-card [list]="list"></app-service-card>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `:host ::ng-deep .lg:sticky {
    align-self: start;
    height: fit-content;
  }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .animate-slide-in {
      animation: slideIn 0.6s ease-out backwards;
    }

    

  `,
})
export class AboutSection implements OnInit, OnDestroy {
  dataList$: Observable<any[]> | undefined;
  private dataSubscription: Subscription | undefined;
  customClass: string = `
    relative rounded-2xl p-6 
bg-gradient-to-br from-[#111] to-[#1a1a1a]
    border-l-4 border-[var(--color-accent)]
    shadow-md hover:shadow-xl
    transition-all duration-300
    hover:transform hover:-translate-y-1
    group/item
  `;
  // weCombineVisionAndExpertiseToPropelYourBusinessForwardWithAKeenEyeOnTheDigitalLandscapeWeEnsureYourSuccessInTodaysCompetitiveMarket
  constructor(public langService: LanguageService, private data: DataService) { }

  ngOnInit(): void {
    this.dataList$ = this.data.getAboutUsData().pipe(
      map((dataList) =>
        dataList.map((el: any) => {
          el['customClass'] = this.customClass;
          return el;
        })
      )
    );
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
