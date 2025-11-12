import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { JobService } from '../../../../../shared/services/job/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
    standalone: true,
    selector: 'app-job-create',
    templateUrl: './job-create.component.html',
    styleUrls: ['./job-create.component.css'],
    imports: [ReactiveFormsModule, CommonModule],
})
export class JobCreateComponent implements OnInit {
    jobForm: FormGroup;
    jobId?: string;
    isBrowser = false;

    employmentTypes = [
        { value: 'fulltime', label: 'Full Time' },
        { value: 'parttime', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' },
        { value: 'temporary', label: 'Temporary' },
    ];

    workplaceTypes = [
        { value: 'on-site', label: 'On-site' },
        { value: 'remote', label: 'Remote' },
        { value: 'hybrid', label: 'Hybrid' },
    ];

    constructor(
        private fb: FormBuilder,
        private jobService: JobService,
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        this.jobForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(150)]],
            slug: ['', [Validators.required]],
            location: ['', Validators.required],
            job: ['', Validators.required],
            description: ['', Validators.required],
            employmentStatus: ['fulltime', Validators.required],
            vacancy: [1, [Validators.required, Validators.min(1)]],
            salary: ['', Validators.required],
            workplace: ['on-site', Validators.required],
            des1: [''],
            des2: [''],
            des3: [''],
            isPublished: [false],
            expired: [this.getDefaultExpiryDate()],
            _id: [''],
        });

        this.route.queryParams.subscribe((params) => {
            this.jobId = params['id'];
        });
    }

    ngOnInit(): void {
        if (this.jobId) {
            this.loadExistingJob();
        }

        // Subscribe to title changes to auto-generate slug
        this.jobForm.get('title')?.valueChanges.subscribe(title => {
            if (title && !this.jobId) { // Only auto-generate for new jobs
                const slug = this.generateSlug(title);
                this.jobForm.get('slug')?.setValue(slug);
            }
        });
    }

    private getDefaultExpiryDate(): string {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private loadExistingJob() {
        this.jobService.getJobById(this.jobId!).subscribe((data) => {
            const job = data.body;
            this.jobForm.patchValue({
                title: job.title,
                slug: job.slug,
                location: job.location,
                job: job.job,
                description: job.description,
                employmentStatus: job.employmentStatus,
                vacancy: job.vacancy,
                salary: job.salary,
                workplace: job.workplace,
                des1: job.des1,
                des2: job.des2,
                des3: job.des3,
                isPublished: job.isPublished || false,
                expired: job.expired ? new Date(job.expired).toISOString().split('T')[0] : this.getDefaultExpiryDate(),
                _id: job._id,
            });
        });
    }

    saveJob() {
        if (this.jobForm.valid) {
            const formValue = this.jobForm.value;
            const jobId = formValue._id;

            if (!jobId) {
                delete formValue._id;
            }

            if (jobId) {
                // Update existing job
                this.jobService.updateJob(jobId, formValue).subscribe({
                    next: () => {
                        this.router.navigate(['/dashboard/job-management/jobs']);
                        this.toast.success('Job updated successfully');
                    },
                    error: (err) => {
                        this.toast.error('Error', err?.message || 'Failed to update job');
                    },
                });
            } else {
                // Create new job
                this.jobService.createJob(formValue).subscribe({
                    next: () => {
                        this.router.navigate(['/dashboard/job-management/jobs']);
                        this.toast.success('Job created successfully');
                    },
                    error: (err) => {
                        this.toast.error('Error', err?.message || 'Failed to create job');
                    },
                });
            }
        } else {
            this.jobForm.markAllAsTouched();
            this.toast.warn('Please fill all required fields');
        }
    }
}