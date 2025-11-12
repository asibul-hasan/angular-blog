import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { ChooseUsCardComponent } from './service-card.component';
import { SectionTitleCard } from './title-section-card.component';
import { DataService } from '../../../../assets/data/data';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-choose-us',
  standalone: true,
  imports: [CommonModule, ChooseUsCardComponent],
  template: `
<section class="section-choose-us relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <!-- Left: Section Title -->
          <div
            class="lg:col-span-5 lg:sticky lg:top-24"
            *ngIf="langService.isLoaded$ | async"
          >
            <div class="space-y-6">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span
                  class="w-2 h-2 rounded-full bg-(--color-accent) animate-pulse"
                ></span>
                <span class="text-sm font-medium text-white/70 tracking-wide"
                  >Why Choose Us</span
                >
              </div>

              <h2
                class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
                {{ langService.lang.whyChooseUs }}
              </h2>

              <p class="text-xl text-white/60 leading-relaxed max-w-xl">
                {{
                  langService.lang
                    .ourAimIsToImproveReturnOnInvestmentsAndReduceCosts
                }}
              </p>

              <p class="text-base text-white/50 leading-relaxed">
                {{
                  langService.lang
                    .discoverTheReasonsWhyWereTheRightChoiceForYouWithOurExpertiseDedicationAndCommitmentToExcellenceWeDeliverOutstandingResultsThatExceedExpectations
                }}
              </p>
            </div>
          </div>

          <!-- Right: Service Cards -->
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-6">
              <div
                *ngFor="let list of dataList$ | async; let i = index"
                class="group"
                [style.animation-delay]="i * 100 + 'ms'"
              >
                <app-service-card [list]="list"></app-service-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .group {
      animation: fadeInUp 0.6s ease-out backwards;
    }
  `,
})
export class ChooseUs implements OnInit, OnDestroy {
  dataList$: Observable<any[]> | undefined;
  private dataSubscription: Subscription | undefined;
  customClass: string = `
    relative h-full p-8 rounded-2xl 
    bg-linear-to-br from-white/5 to-white/[0.02] 
    backdrop-blur-sm border border-white/10
    hover:border-[]/50 hover:bg-white/[0.08]
    transition-all duration-500 ease-out
    hover:transform hover:scale-[1.02] hover:-translate-y-1
    hover:shadow-[0_20px_60px_-15px_rgba(247,97,121,0.3)]
    overflow-hidden
    before:absolute before:inset-0 before:bg-linear-to-br 
    before:from-[]/0 before:to-[]/0
    hover:before:from-[]/5 hover:before:to-transparent
    before:transition-all before:duration-500
  `;

  constructor(public langService: LanguageService, private data: DataService) { }

  ngOnInit(): void {
    this.dataList$ = this.data.getChooseUsData().pipe(
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
