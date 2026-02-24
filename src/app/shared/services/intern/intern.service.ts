import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// ==========================================
// INTERFACES
// ==========================================

export interface InternProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
  domain: string;
  phone: string;
  status: 'pending' | 'active' | 'completed' | 'terminated';
  startDate: string;
  certificateId?: string;
}

export interface InternTask {
  _id: string;
  title: string;
  description: string;
  order: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submissionUrl: string;
  feedback: string;
}

export interface DomainTask {
  _id: string;
  domain: string;
  title: string;
  description: string;
  order: number;
}

export interface TaskSubmission {
  _id: string;
  internId: {
    userId: {
      name: string;
      email: string;
    };
  };
  domainTaskId: {
    title: string;
    domain: string;
    order: number;
  };
  submissionUrl: string;
  status: string;
  feedback: string;
  updatedAt: string;
}

// ==========================================
// SERVICE
// ==========================================

@Injectable({
  providedIn: 'root',
})
export class InternService {
  private apiUrl = environment.apiUrl + '/intern';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ----------------------------------------
  // PUBLIC: Apply for Internship
  // ----------------------------------------
  applyForInternship(data: {
    name: string;
    email: string;
    phone: string;
    domain: string;
    [key: string]: any;
  }): Observable<{ message: string; _dev_password?: string }> {
    return this.http.post<{ message: string; _dev_password?: string }>(
      `${this.apiUrl}/apply`,
      data
    );
  }

  // ----------------------------------------
  // INTERN: Get My Profile
  // ----------------------------------------
  getMyProfile(): Observable<{ body: InternProfile; message: string }> {
    return this.http.get<{ body: InternProfile; message: string }>(
      `${this.apiUrl}/me`
    );
  }

  // ----------------------------------------
  // INTERN: Get My Tasks
  // ----------------------------------------
  getMyTasks(): Observable<{ body: InternTask[]; message: string }> {
    return this.http.get<{ body: InternTask[]; message: string }>(
      `${this.apiUrl}/my-tasks`
    );
  }

  // ----------------------------------------
  // INTERN: Submit a Task
  // ----------------------------------------
  submitTask(
    taskId: string,
    submissionUrl: string
  ): Observable<{ body: any; message: string }> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<{ body: any; message: string }>(
        `${this.apiUrl}/submit-task/${taskId}`,
        { submissionUrl }
      );
    }
    return of({ body: null, message: 'SSR: skipped' });
  }

  // ----------------------------------------
  // ADMIN: Get All Interns
  // ----------------------------------------
  getAllInterns(): Observable<{ body: InternProfile[]; message: string }> {
    return this.http.get<{ body: InternProfile[]; message: string }>(
      `${this.apiUrl}/admin/all`
    );
  }

  // ----------------------------------------
  // ADMIN: Update Intern Status
  // ----------------------------------------
  updateInternStatus(
    internId: string,
    status: string
  ): Observable<{ message: string }> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.patch<{ message: string }>(
        `${this.apiUrl}/admin/interns/${internId}/status`,
        { status }
      );
    }
    return of({ message: 'SSR: skipped' });
  }

  // ----------------------------------------
  // ADMIN: Get All Domain Tasks
  // ----------------------------------------
  getDomainTasks(): Observable<{ body: DomainTask[]; message: string }> {
    return this.http.get<{ body: DomainTask[]; message: string }>(
      `${this.apiUrl}/admin/domain-tasks`
    );
  }

  // ----------------------------------------
  // ADMIN: Create Domain Task
  // ----------------------------------------
  createDomainTask(
    data: Omit<DomainTask, '_id'>
  ): Observable<{ body: DomainTask; message: string }> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<{ body: DomainTask; message: string }>(
        `${this.apiUrl}/admin/domain-tasks`,
        data
      );
    }
    return of({ body: {} as DomainTask, message: 'SSR: skipped' });
  }

  // ----------------------------------------
  // ADMIN: Get Pending Submissions
  // ----------------------------------------
  getPendingSubmissions(): Observable<{
    body: TaskSubmission[];
    message: string;
  }> {
    return this.http.get<{ body: TaskSubmission[]; message: string }>(
      `${this.apiUrl}/admin/submissions/pending`
    );
  }

  // ----------------------------------------
  // ADMIN: Review Task Submission
  // ----------------------------------------
  reviewSubmission(
    submissionId: string,
    status: 'approved' | 'rejected',
    feedback: string
  ): Observable<{ message: string }> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.patch<{ message: string }>(
        `${this.apiUrl}/admin/tasks/${submissionId}/review`,
        { status, feedback }
      );
    }
    return of({ message: 'SSR: skipped' });
  }
}
