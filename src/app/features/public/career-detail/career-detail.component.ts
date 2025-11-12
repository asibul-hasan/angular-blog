import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobService } from '../../../shared/services/job/job.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-career-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './career-detail.component.html',
    styleUrls: ['./career-detail.component.css'],
})
export class CareerDetailComponent implements OnInit {
    job: any = null;
    loading = true;
    isBrowser = false;

    constructor(
        private route: ActivatedRoute,
        private jobService: JobService,
        private toast: ToastService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const jobIdOrSlug = params['id'];
            this.loadJob(jobIdOrSlug);
        });
    }

    loadJob(jobIdOrSlug: string): void {
        this.loading = true;
        // Check if jobIdOrSlug looks like a MongoDB ObjectId (24 hex characters)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(jobIdOrSlug);

        if (isObjectId) {
            // If it's an ObjectId, use the existing method
            this.jobService.getJobById(jobIdOrSlug).subscribe({
                next: (response) => {
                    this.job = response.body;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading job:', err);
                    this.loading = false;
                },
            });
        } else {
            // Otherwise, treat it as a slug
            this.jobService.getJobBySlug(jobIdOrSlug).subscribe({
                next: (response) => {
                    this.job = response.body;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading job:', err);
                    this.loading = false;
                },
            });
        }
    }

    applyForJob(): void {
        // For public site, we should redirect to a proper application page or show a modal
        // For now, we'll just show a message
        this.toast.info('Application', 'Please contact us directly to apply for this position.');
    }

    isJobExpired(): boolean {
        if (!this.job || !this.job.expired) return false;
        const expiryDate = new Date(this.job.expired);
        const today = new Date();
        return expiryDate < today;
    }

    isJobPublished(): boolean {
        return this.job && this.job.isPublished === true;
    }

    canApply(): boolean {
        return this.isJobPublished() && !this.isJobExpired();
    }
}