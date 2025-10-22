import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-title-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- <h2 class="section-sub-title">
      {{ title }}
    </h2>
    <h3 class="section-title dark:text-white">
      {{ titleDesc }}
    </h3>
    <p class="text-md text-gray-500 dark:text-gray-400 w-full">
      {{ description }}
    </p> -->

     <div class="space-y-6">
              <div
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span
                  class="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"
                ></span>
                <span class="text-sm font-medium text-white/70 tracking-wide"
                  >      {{ title }}
</span
                >
              </div>

              <h2
                class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
      {{ titleDesc }}
              </h2>

              <p class="text-xl text-white/60 leading-relaxed max-w-xl">
                {{
                  langService.lang
                    .ourAimIsToImproveReturnOnInvestmentsAndReduceCosts
                }}
              </p>

              <p class="text-base text-white/50 leading-relaxed">
                     {{ description }}

              </p>
            </div>
  `,


  styles: [],
})
export class SectionTitleCard {
  @Input() title: string = '';
  @Input() titleDesc: string = '';
  @Input() description: string = '';

  // title: string = '';
  // description: string = '';
  // img: any;

  constructor(public langService: LanguageService, private router: Router) { }
}
