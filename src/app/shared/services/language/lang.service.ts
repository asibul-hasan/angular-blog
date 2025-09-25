import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private _langData = new BehaviorSubject<any>({});
  public readonly lang$: Observable<any> = this._langData.asObservable();

  private _isLoaded = new BehaviorSubject<boolean>(false);
  public readonly isLoaded$: Observable<boolean> =
    this._isLoaded.asObservable();

  public get lang(): any {
    return this._langData.getValue();
  }

  public getTranslation(key: string): string {
    return this.lang[key] || key;
  }

  private _currentLang = new BehaviorSubject<string>('en');
  public readonly currentLang$: Observable<string> =
    this._currentLang.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialLanguage();
  }

  private loadInitialLanguage(): void {
    this.changeLanguage('en');
  }

  changeLanguage(lang: string): void {
    this._currentLang.next(lang);
    this._isLoaded.next(false);

    this.http.get(`./assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this._langData.next(data);
        this._isLoaded.next(true);
        console.log(`Loaded language: ${lang}`);
      },
      error: (error) => {
        console.error(`Error loading language file for ${lang}:`, error);
        // Load fallback or empty object
        this._langData.next({});
        this._isLoaded.next(true);
      },
    });
  }

  // Helper method to wait for language to load
  waitForLanguageLoad(): Observable<any> {
    return this.isLoaded$.pipe(
      filter((loaded) => loaded),
      switchMap(() => this.lang$)
    );
  }
}
