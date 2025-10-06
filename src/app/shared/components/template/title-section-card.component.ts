import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-title-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="section-sub-title">
      {{ title }}
    </h2>
    <h3 class="section-title dark:text-white">
      {{ titleDesc }}
    </h3>
    <p class="text-md text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
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

  constructor(public langService: LanguageService, private router: Router) {}
}
