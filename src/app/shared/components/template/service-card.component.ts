import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="list.customClass">
      <img [src]="list.icon" alt="" srcset="" />
      <h3
        class="max-w-xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
      >
        {{ list.title }}
      </h3>
      <p class="text-md text-gray-500 dark:text-gray-400">
        {{ list.description }}
      </p>
    </div>
  `,
  styles: [],
})
export class ChooseUsCardComponent implements OnInit {
  @Input() list: any;
  // customClass: string =
  //   'h-full py-6 px-6 border border-green-500 border-t-0 border-l-0 rounded-br-xl shadow-sm hover:shadow-md transition';

  constructor(public langService: LanguageService, private router: Router) {}

  ngOnInit(): void {}
}
