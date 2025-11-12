import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../../shared/services/job/job.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
    selector: 'app-jobs-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './jobs-list.component.html',
    styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent implements OnInit {
    jobs: any[] = [];
    loading = true;
    error: string | null = null;
    editingJob: { [key: string]: any } = {};

    constructor(
        private jobService: JobService,
        private toast: ToastService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    loadJobs(): void {
        this.loading = true;
        this.error = null;

        this.jobService.getJobs().subscribe({
            next: (response) => {
                const jobList = response.body || [];
                this.jobs = [...jobList].reverse();
                this.loading = false;
                this.toast.success('Success', 'Jobs loaded successfully');
            },
            error: (err) => {
                this.error = 'Failed to load jobs';
                this.loading = false;
                this.toast.error('Error', err || 'Failed to load jobs');
            },
        });
    }

    deleteJob(id: string): void {
        if (confirm('Are you sure you want to delete this job posting?')) {
            this.jobService.deleteJob(id).subscribe({
                next: () => {
                    this.loadJobs();
                    this.toast.success('Success', 'Job deleted successfully');
                },
                error: (err) => {
                    console.error('Error deleting job:', err);
                    this.toast.error('Error', 'Failed to delete job');
                },
            });
        }
    }

    editJob(id: string): void {
        this.router.navigate(['/dashboard/job-management/job/create'], {
            queryParams: { id: id },
        });
    }

    viewApplications(jobId: string): void {
        this.router.navigate(['/dashboard/job-management/job-applications'], {
            queryParams: { jobId: jobId },
        });
    }

    // Quick edit methods
    startEditing(jobId: string, field: string, currentValue: string): void {
        if (!this.editingJob[jobId]) {
            this.editingJob[jobId] = {};
        }
        this.editingJob[jobId][field] = currentValue;
    }

    isEditing(jobId: string, field: string): boolean {
        return this.editingJob[jobId]?.[field] !== undefined;
    }

    cancelEdit(jobId: string, field: string): void {
        if (this.editingJob[jobId]) {
            delete this.editingJob[jobId][field];
        }
    }

    saveField(job: any, field: string): void {
        const newValue = this.editingJob[job._id]?.[field];

        if (!newValue && newValue !== false && newValue !== 0) {
            this.toast.warn('Value cannot be empty');
            return;
        }

        const updateData: any = {};
        updateData[field] = newValue;

        this.jobService.updateJob(job._id, updateData).subscribe({
            next: () => {
                job[field] = newValue;
                delete this.editingJob[job._id][field];
                this.toast.success('Success', `${field} updated successfully`);
            },
            error: (err) => {
                this.toast.error('Error', `Failed to update ${field}`);
                console.error(`Failed to update ${field}:`, err);
            },
        });
    }

    togglePublishStatus(job: any): void {
        const newStatus = !job.isPublished;
        this.jobService.updateJob(job._id, { isPublished: newStatus }).subscribe({
            next: () => {
                job.isPublished = newStatus;
                this.toast.success('Success', `Job ${newStatus ? 'published' : 'unpublished'} successfully`);
            },
            error: (err) => {
                this.toast.error('Error', `Failed to update publish status`);
                console.error('Failed to update publish status:', err);
            },
        });
    }

    extendExpiryDate(job: any): void {
        const newExpiryDate = new Date();
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

        this.jobService.updateJob(job._id, { expired: newExpiryDate }).subscribe({
            next: () => {
                job.expired = newExpiryDate;
                this.toast.success('Success', 'Expiry date extended by 1 month');
            },
            error: (err) => {
                this.toast.error('Error', 'Failed to extend expiry date');
                console.error('Failed to extend expiry date:', err);
            },
        });
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    isExpired(dateString: string): boolean {
        if (!dateString) return false;
        const expiryDate = new Date(dateString);
        const today = new Date();
        return expiryDate < today;
    }
}