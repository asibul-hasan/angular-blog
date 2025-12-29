import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError } from 'rxjs/operators';

export interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface BlogCompany {
  _id: string;
  name: string;
  legalName?: string;
}

export interface BlogCategory {
  _id: string;
  name: string;
  description?: string;
}

export interface Blog {
  _id?: string;
  title: string;
  meta_description: string;
  description: string;
  slug: string;
  isPublished?: boolean;
  blog_content: string;
  author?: BlogAuthor;
  company?: BlogCompany;
  category?: BlogCategory[];
  tags?: string[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/blog';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-list`).pipe(
      catchError(this.handleError)
    );
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getBlogBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-by-slug/${slug}`).pipe(
      catchError(this.handleError)
    );
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Specific error messages for common issues
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and ensure the API server is running.';
      } else if (error.status === 404) {
        errorMessage = 'Requested resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      }
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}