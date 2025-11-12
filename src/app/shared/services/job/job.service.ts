import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface JobCompany {
    _id: string;
    name: string;
    legalName?: string;
}

export interface Job {
    _id?: string;
    slug: string;
    title: string;
    location: string;
    job: string;
    description: string;
    employmentStatus: string;
    vacancy: number;
    salary: string;
    workplace: string;
    des1?: string;
    des2?: string;
    des3?: string;
    isPublished?: boolean;
    expired?: Date;
    company?: JobCompany;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface JobApplication {
    _id?: string;
    jobId: string;
    fullName: string;
    email: string;
    phone: string;
    coverLetter?: string;
    cvUrl: string;
    appliedAt?: Date;
    isShortlisted?: boolean; // Add shortlist status

    // Stage-specific fields
    status?: 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected' | 'withdrawn' | 'on-hold';
    interviewMode?: string; // For interviewed stage
    interviewDateWithTime?: Date; // For interviewed stage
    joiningDate?: Date; // For selected/offered stage
}

@Injectable({
    providedIn: 'root',
})
export class JobService {
    private apiUrl = environment.apiUrl + '/career';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    // Job CRUD operations
    getJobs(): Observable<any> {
        return this.http.get(`${this.apiUrl}/jobs`);
    }

    getJobById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/jobs/${id}`);
    }

    getJobBySlug(slug: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/get-job-by-slug/${slug}`);
    }

    createJob(job: Job): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.post(`${this.apiUrl}/jobs`, job);
        }
        return of(null);
    }

    updateJob(id: string, job: Partial<Job>): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.put(`${this.apiUrl}/jobs/${id}`, job);
        }
        return of(null);
    }

    deleteJob(id: string): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.delete(`${this.apiUrl}/jobs/${id}`);
        }
        return of(null);
    }

    // Job Application operations
    getApplications(): Observable<any> {
        return this.http.get(`${this.apiUrl}/applications`);
    }

    getApplicationsByJob(jobId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/applications?jobId=${jobId}`);
    }

    // Get shortlisted applications
    getShortlistedApplications(): Observable<any> {
        return this.http.get(`${this.apiUrl}/applications?isShortlisted=true`);
    }

    // Get shortlisted applications by job
    getShortlistedApplicationsByJob(jobId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/applications?jobId=${jobId}&isShortlisted=true`);
    }

    applyForJob(application: JobApplication): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.post(`${this.apiUrl}/apply`, application);
        }
        return of(null);
    }

    // Shortlist an application
    shortlistApplication(applicationId: string, isShortlisted: boolean): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.put(`${this.apiUrl}/applications/${applicationId}`, { isShortlisted });
        }
        return of(null);
    }

    // Update application status and stage-specific fields
    updateApplicationStatus(applicationId: string, updateData: Partial<JobApplication>): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.put(`${this.apiUrl}/applications/${applicationId}`, updateData);
        }
        return of(null);
    }

    // Upload CV to Cloudinary
    uploadCV(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'blog-images'); // Using the same preset as other uploads

        const cloudName = 'dfcir8epp'; // your Cloudinary cloud name
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        return this.http.post(url, formData);
    }
}