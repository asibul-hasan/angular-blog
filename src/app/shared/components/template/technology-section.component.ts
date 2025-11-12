import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { DataService } from '../../../../assets/data/data';
import { TechCarouselComponent } from './tech-carousel.component';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-technology-section',
  standalone: true,
  imports: [CommonModule, TechCarouselComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section-technology relative overflow-hidden">

      <!-- Subtle gradient background -->
      <!-- <div
        class="absolute inset-0 bg-linear-to-br from-indigo-50 via-pink-50 to-white opacity-90 
               dark:from-slate-900 dark:via-gray-900 dark:to-black transition-colors duration-500"
      ></div> -->

      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-16 lg:py-20 relative z-10"
      >
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Left: Carousel -->
          <div class="relative order-2 lg:order-1">
            <div class="lg:sticky lg:top-24">
              <app-tech-carousel></app-tech-carousel>

              <!-- Tech badges -->
              <div class="mt-8 flex flex-wrap gap-3 justify-center">
                @for (badge of badges(); track badge) {
                <div
                  class="px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-black/10 
                           hover:border-[var(--color-accent)]/50 transition-all duration-300 cursor-default"
                >
                  <span class="text-sm text-dark/70 dark:text-white/70">{{
                    badge
                  }}</span>
                </div>
                }
              </div>
            </div>
          </div>

          <!-- Right: Content -->
          @if (isLoaded | async) {
          <div class="space-y-8 order-1 lg:order-2">
            <div class="space-y-6">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10"
              >
                <svg
                  class="w-4 h-4 text-[var(--color-accent)]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 7H7v6h6V7z" />
                  <path
                    fill-rule="evenodd"
                    d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span
                  class="text-sm font-medium text-dark/70 dark:text-white/70 uppercase tracking-wide"
                >
                  Technology Stack
                </span>
              </div>

              <h2
                class="text-4xl lg:text-5xl xl:text-6xl font-bold text-dark dark:text-white leading-tight"
              >
                {{ lang()?.technology }}
              </h2>

              <p
                class="text-xl text-dark/70 dark:text-white/70 leading-relaxed"
              >
                {{ lang()?.ourSoftwareDevelopmentTechnology }}
              </p>

              <p
                class="text-base text-dark/50 dark:text-white/50 leading-relaxed"
              >
                {{
                  lang()
                    ?.weAreCommittedToDrivingDigitalInnovationByDeliveringTheLatestTechnologySolutionsOurCustomSoftwareDevelopmentServicesAreTailoredToMeetTheUniqueNeedsOfEachClientEnsuringTheyStayAheadInAFastPacedWorldWithAFocusOnQualityAndInnovationWeProudlyServeBusinessesWorldwideHelpingThemGrowAndSucceedWithPersonalizedCuttingEdgeSoftware
                }}
              </p>
            </div>

            <!-- Key Features -->
            <div class="grid sm:grid-cols-2 gap-6">
              @for (f of features(); track f.title) {
              <div
                class="group p-6 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10
                             hover:bg-white/90 dark:hover:bg-white/20 hover:border-[var(--color-accent)]/50 transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 
                                  flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-5 h-5 text-[var(--color-accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        [attr.d]="
                          f.icon === 'zap'
                            ? 'M13 10V3L4 14h7v7l9-11h-7z'
                            : 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        "
                      />
                    </svg>
                  </div>
                  <div>
                    <h4
                      class="text-lg font-semibold text-dark dark:text-white mb-2"
                    >
                      {{ f.title }}
                    </h4>
                    <p class="text-sm text-dark/60 dark:text-white/60">
                      {{ f.desc }}
                    </p>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
          }
        </div>
      </div>
    </section>
  `,
  // styles: [
  //   `
  //     .technology-section {

  //       position: relative;
  //       overflow: hidden;
  //       border-radius: 1.5rem;
  //       box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  //       transition: background-color 0.4s ease, color 0.4s ease;
  //     }

  //     // @media (prefers-color-scheme: dark) {
  //     //   .technology-section {
  //     //     // background-color: #0e0e0e;
  //     //     // color: #f5f5f5;
  //     //   }
  //     // }
  //   `,
  // ],
})
export class TechnologySectionComponent implements OnInit, OnDestroy {
  private readonly langService = inject(LanguageService);
  private readonly dataService = inject(DataService);

  private readonly _dataSubscription = signal<Subscription | null>(null);
  readonly dataList = signal<any[]>([]);
  readonly isLoaded = this.langService.isLoaded$;

  readonly badges = signal(['Cloud Native', 'AI/ML Ready', 'Scalable']);
  readonly features = signal([
    {
      title: 'High Performance',
      desc: 'Optimized for speed and efficiency',
      icon: 'zap',
    },
    {
      title: 'Enterprise Security',
      desc: 'Bank-grade security protocols',
      icon: 'shield-lock',
    },
  ]);

  readonly lang = computed(() => this.langService.lang);

  ngOnInit(): void {
    const sub = this.dataService
      .getAboutUsData()
      .pipe(map((list) => list.map((el: any) => el)))
      .subscribe((data) => this.dataList.set(data));

    this._dataSubscription.set(sub);
  }

  ngOnDestroy(): void {
    this._dataSubscription()?.unsubscribe();
  }
}
