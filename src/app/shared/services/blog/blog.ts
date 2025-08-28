import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  private apiUrl = environment.blogsApiBaseUrl;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog-list`);
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-blog/${id}`);
  }

  updateBlog(id: string, blog: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-blog/${id}`, blog);
  }

  createBlog(blog: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-blog`, blog);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-blog/${id}`);
  }
}
