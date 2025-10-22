import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LOADER_CONTEXT } from '../../../core/interceptors/loader-context';

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/blog';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-list`, {
      context: new HttpContext().set(LOADER_CONTEXT, false),
    });
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog/${id}`);
  }

  getBlogBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-by-slug/${slug}`);
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

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog-images'); // required!
    // formData.append('folder', 'blog-images'); // optional
    // formData.append('format', 'webp'); // convert to WebP on upload

    // formData.append('file', file);
    // formData.append('dfcir8epp', 'blog-images'); // replace with your preset

    const cloudName = 'dfcir8epp'; // your Cloudinary cloud name
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    return this.http.post(url, formData);
  }
}
