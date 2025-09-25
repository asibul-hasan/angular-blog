import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-list`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog/${id}`);
  }

  // Only run in browser (to avoid SSR errors for mutations)
  updateBlog(id: string, blog: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.put(`${this.apiUrl}/edit-blog/${id}`, blog);
    }
    return of(null); // SSR-safe fallback
  }

  createBlog(blog: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post(`${this.apiUrl}/create-blog`, blog);
    }
    return of(null);
  }

  deleteBlog(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.delete(`${this.apiUrl}/delete-blog/${id}`);
    }
    return of(null);
  }
}
