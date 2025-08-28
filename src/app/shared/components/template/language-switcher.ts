import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language/lang.service';
import { Subscription } from 'rxjs'; // Import Subscription to manage subscriptions

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="relative inline-block text-left">
      <select
        #langSelect
        [value]="selectedLang"
        (change)="switchLang(langSelect.value)"
        class="
      appearance-none
      block
      w-full
      px-4
      py-2
      rounded-md
      text-sm
      font-medium
      cursor-pointer
      pr-8
      border
      border-gray-300
      shadow-sm
      bg-white
      text-gray-700
      hover:bg-gray-50
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:border-blue-500
      dark:bg-gray-800
      dark:border-gray-600
      dark:text-gray-200
      dark:hover:bg-gray-700
      dark:focus:ring-blue-400
      dark:focus:border-blue-400
      transition
    "
      >
        <option value="en" class="text-gray-900 dark:text-gray-100">EN</option>
        <option value="fr" class="text-gray-900 dark:text-gray-100">FR</option>
      </select>

      <!-- Dropdown Arrow -->
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-300"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  `,
  styles: [], // Tailwind handles styling, so no need for custom CSS here
})
export class LanguageSwitcher implements OnInit, OnDestroy {
  selectedLang: string = 'en';
  private langSubscription: Subscription | undefined; // To unsubscribe and prevent memory leaks

  constructor(private langService: LanguageService) {}

  ngOnInit(): void {
    // Subscribe to language changes to update the selected language in the dropdown
    this.langSubscription = this.langService.currentLang$.subscribe((lang) => {
      this.selectedLang = lang;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  switchLang(lang: string): void {
    // Call the service to change the application's language
    this.langService.changeLanguage(lang);
  }
}
