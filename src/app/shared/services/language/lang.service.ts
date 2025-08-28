import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // Renamed from LanguageService if that was its previous name
  private _currentLang = new BehaviorSubject<string>('en'); // Holds the current language string
  public readonly currentLang$: Observable<string> =
    this._currentLang.asObservable(); // Observable for current language

  // Use a separate BehaviorSubject for language data to ensure `lang` is always up-to-date
  private _langData = new BehaviorSubject<any>({});
  public lang: any = {}; // Public property for direct access to translation data

  constructor(private http: HttpClient) {
    // Subscribe internally to update the `lang` property whenever _langData changes
    this._langData.subscribe((data) => {
      this.lang = data;
    });

    // Subscribe to the _currentLang changes to load new translation files
    this._currentLang.subscribe((lang) => {
      this.loadLanguageData(lang);
    });

    // Initialize with a default language
    this.changeLanguage('en');
  }

  // Method to load the language JSON data
  private loadLanguageData(lang: string): void {
    this.http
      .get(`./assets/i18n/${lang}.json`)
      .pipe(
        map((data) => {
          this._langData.next(data); // Update _langData when new JSON is loaded
        })
      )
      .subscribe({
        next: () => console.log(`Loaded language: ${lang}`),
        error: (error) =>
          console.error(`Error loading language file for ${lang}:`, error),
      });
  }

  // Public method to change the application's language
  changeLanguage(lang: string): void {
    this._currentLang.next(lang); // Update the current language
  }
}
