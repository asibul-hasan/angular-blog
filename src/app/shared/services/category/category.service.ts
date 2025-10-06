import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiUrl + '/category';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-category-list`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-category/{id}/${id}`);
  }

  updateCategory(id: string, category: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.put(`${this.apiUrl}/edit-category/${id}`, category);
    }
    return of(null); // SSR-safe fallback
  }

  createCategory(category: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post(`${this.apiUrl}/create-category`, {
        name: category,
      });
    }
    return of(null);
  }

  deleteCategory(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.delete(`${this.apiUrl}/delete-category/${id}`);
    }
    return of(null);
  }
}
