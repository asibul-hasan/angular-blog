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
    <section class="relative bg-black text-white py-24 md:py-32 overflow-hidden border-y border-white/[0.06]">
      <div class="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10" style="background:#f76179"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <!-- Left: Section Title -->
          <div
            class="lg:col-span-5 lg:sticky lg:top-32"
            *ngIf="langService.isLoaded$ | async"
          >
            <div class="space-y-8">
              <span class="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-[#f76179]">
                <span class="w-2 h-2 rounded-full bg-[#f76179] animate-pulse inline-block"></span>
                Why Choose Us
              </span>

              <h2 class="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
                {{ langService.lang.whyChooseUs || 'We Are the Right Choice' }}
              </h2>

              <p class="text-xl text-gray-400 leading-relaxed font-medium">
                {{ langService.lang.ourAimIsToImproveReturnOnInvestmentsAndReduceCosts || 'Our aim is to improve return on investments and reduce costs.' }}
              </p>

              <p class="text-base text-gray-500 leading-relaxed">
                {{ langService.lang.discoverTheReasonsWhyWereTheRightChoiceForYouWithOurExpertiseDedicationAndCommitmentToExcellenceWeDeliverOutstandingResultsThatExceedExpectations || 'Discover the reasons why we\\'re the right choice for you.' }}
              </p>
            </div>
          </div>

          <!-- Right: Service Cards -->
          <div class="lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-6">
              <div
                *ngFor="let list of dataList$ | async; let i = index"
                class="group animate-fade-in-up"
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

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out backwards;
    }
  `,
})
export class ChooseUs implements OnInit, OnDestroy {
  dataList$: Observable<any[]> | undefined;
  private dataSubscription: Subscription | undefined;
  customClass: string = `
    relative h-full p-8 rounded-[32px] overflow-hidden group
    bg-white/[0.02] border border-white/[0.08]
    backdrop-blur-3xl transition-all duration-500 ease-out
    hover:border-[#f76179]/40 hover:bg-white/[0.04]
    hover:transform hover:scale-[1.02] hover:-translate-y-2
    hover:shadow-[0_20px_60px_-15px_rgba(247,97,121,0.2)]
    before:absolute before:inset-0 before:bg-gradient-to-br 
    before:opacity-0 hover:before:opacity-100 before:from-[#f76179]/10 before:to-transparent
    before:transition-opacity before:duration-500 before:z-0
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
