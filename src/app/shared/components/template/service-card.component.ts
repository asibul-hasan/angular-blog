// ============================================
// UPDATED SERVICE CARD COMPONENT
// ============================================
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="list.customClass" class="group/card">
      <div class="relative z-10 space-y-4">
        <!-- Icon with gradient background -->
        <div
          class="inline-flex p-3 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 
                    border border-[var(--color-accent)]/20 group-hover/card:scale-110 transition-transform duration-500"
        >
<i [class]="list.icon" class="text-4xl"></i>

        </div>

        <!-- Title -->
        <h3
          class="text-2xl lg:text-3xl font-bold text-white leading-tight 
                   group-hover/card:text-[var(--color-accent)] transition-colors duration-300"
        >
          {{ list.title }}
        </h3>

        <!-- Description -->
        <p
          class="text-base text-white/40 leading-relaxed group-hover/card:text-white/80 transition-colors duration-300"
        >
          {{ list.description }}
        </p>
      </div>

      <!-- Decorative element -->
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent 
                  rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
      ></div>
    </div>
  `,
  styles: [],
})
export class ChooseUsCardComponent implements OnInit {
  @Input() list: any;

  constructor(public langService: LanguageService, private router: Router) { }

  ngOnInit(): void { }
}
