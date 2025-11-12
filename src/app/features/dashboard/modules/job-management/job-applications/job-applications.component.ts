import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../../shared/services/job/job.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
    selector: 'app-job-applications',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './job-applications.component.html',
    styleUrls: ['./job-applications.component.css'],
})
export class JobApplicationsComponent implements OnInit {
    applications: any[] = [];
    allApplications: any[] = [];
    jobs: any[] = [];
    loading = true;
    error: string | null = null;
    jobId: string | null = null;
    selectedApplication: any = null;
    safeCvUrl: SafeUrl | null = null;
    selectedJobId: string | null = null;
    selectedStatus: string | null = null;

    // Interview details for editing
    editingInterview: { [key: string]: boolean } = {};
    interviewData: { [key: string]: { date: string; time: string; mode: string } } = {};

    // Joining date for editing
    editingJoining: { [key: string]: boolean } = {};
    joiningDateData: { [key: string]: string } = {};

    constructor(
        private jobService: JobService,
        private toast: ToastService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.jobId = params['jobId'];
            this.selectedJobId = this.jobId;
            this.loadApplications();
            this.loadJobs();
        });
    }

    loadApplications(): void {
        this.loading = true;
        this.error = null;

        const request = this.jobId
            ? this.jobService.getApplicationsByJob(this.jobId)
            : this.jobService.getApplications();

        request.subscribe({
            next: (response: any) => {
                const appList = response.body || response || [];
                this.allApplications = [...appList].reverse();
                this.updateDisplayedApplications();
                this.loading = false;
            },
            error: (err: any) => {
                this.error = 'Failed to load applications';
                this.loading = false;
                this.toast.error('Error', err?.error?.message || err?.message || 'Failed to load applications');
            },
        });
    }

    loadJobs(): void {
        this.jobService.getJobs().subscribe({
            next: (response: any) => {
                this.jobs = response.body || response || [];
            },
            error: (err: any) => {
                console.error('Failed to load jobs:', err);
            },
        });
    }

    viewCV(application: any): void {
        this.selectedApplication = { ...application };
        if (application.cvUrl) {
            this.safeCvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(application.cvUrl);
        }

        // Initialize interview data if exists
        if (application.interviewDateWithTime) {
            const date = new Date(application.interviewDateWithTime);
            this.interviewData[application._id] = {
                date: date.toISOString().split('T')[0],
                time: date.toTimeString().slice(0, 5),
                mode: application.interviewMode || 'online'
            };
        } else {
            // Initialize with default values
            const now = new Date();
            this.interviewData[application._id] = {
                date: now.toISOString().split('T')[0],
                time: '10:00',
                mode: 'online'
            };
        }

        // Initialize joining date if exists
        if (application.joiningDate) {
            const date = new Date(application.joiningDate);
            this.joiningDateData[application._id] = date.toISOString().split('T')[0];
        } else {
            // Initialize with default value
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14);
            this.joiningDateData[application._id] = futureDate.toISOString().split('T')[0];
        }
    }

    closePreview(): void {
        this.selectedApplication = null;
        this.safeCvUrl = null;
    }

    downloadCV(cvUrl: string, applicantName: string): void {
        if (cvUrl) {
            window.open(cvUrl, '_blank');
        } else {
            this.toast.error('Error', 'CV URL not available');
        }
    }

    onJobFilterChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedJobId = target.value === 'all' ? null : target.value;
        this.selectedStatus = null; // Reset status filter when job changes
        this.updateDisplayedApplications();
    }

    onStatusFilterChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedStatus = target.value === 'all' ? null : target.value;
        this.updateDisplayedApplications();
    }

    updateDisplayedApplications(): void {
        let filtered = [...this.allApplications];

        // Apply job filter
        if (this.selectedJobId) {
            filtered = filtered.filter(app => {
                const appJobId = app.jobId?._id || app.jobId;
                return appJobId === this.selectedJobId;
            });
        }

        // Apply status filter
        if (this.selectedStatus) {
            filtered = filtered.filter(app => (app.isSelected || 'applied') === this.selectedStatus);
        }

        this.applications = filtered;
    }

    onStatusChange(application: any, event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const newStatus = selectElement.value;

        // Check if required fields are present for certain statuses
        if (newStatus === 'interviewed' && !application.interviewDateWithTime) {
            this.toast.error('Error', 'Please set interview date and mode first');
            selectElement.value = application.isSelected || 'applied';
            return;
        }

        if ((newStatus === 'selected' || newStatus === 'offered') && !application.joiningDate) {
            this.toast.error('Error', 'Please set joining date first for selected/offered candidates');
            selectElement.value = application.isSelected || 'applied';
            return;
        }

        this.updateApplicationStatus(application, newStatus);
    }

    updateApplicationStatus(application: any, status: string): void {
        const updateData: any = { isSelected: status };

        this.jobService.updateApplicationStatus(application._id, updateData).subscribe({
            next: (response: any) => {
                application.isSelected = status;

                const index = this.allApplications.findIndex(app => app._id === application._id);
                if (index !== -1) {
                    this.allApplications[index].isSelected = status;
                }

                this.updateDisplayedApplications();
                this.toast.success('Success', `Application status updated to ${status}`);
            },
            error: (err: any) => {
                this.toast.error('Error', err?.error?.message || err?.message || 'Failed to update application status');
            },
        });
    }

    // Interview Management
    startEditingInterview(application: any): void {
        this.editingInterview[application._id] = true;

        if (!this.interviewData[application._id]) {
            const now = new Date();
            this.interviewData[application._id] = {
                date: now.toISOString().split('T')[0],
                time: '10:00',
                mode: application.interviewMode || 'online'
            };
        }
    }

    cancelEditingInterview(applicationId: string): void {
        this.editingInterview[applicationId] = false;
    }

    saveInterviewDetails(application: any): void {
        const data = this.interviewData[application._id];

        if (!data || !data.date || !data.time || !data.mode) {
            this.toast.error('Error', 'Please fill all interview details');
            return;
        }

        const interviewDateTime = new Date(`${data.date}T${data.time}`);

        const updateData: any = {
            interviewDateWithTime: interviewDateTime.toISOString(),
            interviewMode: data.mode
        };

        this.jobService.updateApplicationStatus(application._id, updateData).subscribe({
            next: (response: any) => {
                application.interviewDateWithTime = interviewDateTime;
                application.interviewMode = data.mode;

                const index = this.allApplications.findIndex(app => app._id === application._id);
                if (index !== -1) {
                    this.allApplications[index].interviewDateWithTime = interviewDateTime;
                    this.allApplications[index].interviewMode = data.mode;
                }

                this.editingInterview[application._id] = false;
                this.toast.success('Success', 'Interview details saved successfully');
            },
            error: (err: any) => {
                this.toast.error('Error', err?.error?.message || err?.message || 'Failed to save interview details');
            },
        });
    }

    // Joining Date Management
    startEditingJoining(application: any): void {
        this.editingJoining[application._id] = true;

        if (!this.joiningDateData[application._id]) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 14);
            this.joiningDateData[application._id] = futureDate.toISOString().split('T')[0];
        }
    }

    cancelEditingJoining(applicationId: string): void {
        this.editingJoining[applicationId] = false;
    }

    saveJoiningDate(application: any): void {
        const date = this.joiningDateData[application._id];

        if (!date) {
            this.toast.error('Error', 'Please select a joining date');
            return;
        }

        const updateData: any = {
            joiningDate: new Date(date).toISOString()
        };

        this.jobService.updateApplicationStatus(application._id, updateData).subscribe({
            next: (response: any) => {
                application.joiningDate = new Date(date);

                const index = this.allApplications.findIndex(app => app._id === application._id);
                if (index !== -1) {
                    this.allApplications[index].joiningDate = new Date(date);
                }

                this.editingJoining[application._id] = false;
                this.toast.success('Success', 'Joining date saved successfully');
            },
            error: (err: any) => {
                this.toast.error('Error', err?.error?.message || err?.message || 'Failed to save joining date');
            },
        });
    }

    // Helper methods
    shouldShowInterviewFields(status: string): boolean {
        return ['interviewed', 'selected', 'rejected', 'offered', 'on-hold'].includes(status);
    }

    shouldShowJoiningDateField(status: string): boolean {
        return ['selected', 'offered'].includes(status);
    }

    isInterviewRequired(status: string): boolean {
        return status === 'interviewed';
    }

    isJoiningRequired(status: string): boolean {
        return ['selected', 'offered'].includes(status);
    }

    getJobTitle(jobId: string): string {
        if (!jobId) return 'Unknown Job';
        const job = this.jobs.find(j => j._id === jobId);
        return job ? job.title : 'Unknown Job';
    }

    getStatusBadgeClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            'applied': 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
            'shortlisted': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
            'interviewed': 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
            'selected': 'bg-green-500/20 text-green-400 border border-green-500/50',
            'rejected': 'bg-red-500/20 text-red-400 border border-red-500/50',
            'offered': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
            'withdrawn': 'bg-gray-500/20 text-gray-400 border border-gray-500/50',
            'on-hold': 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
        };

        return statusMap[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }

    resetFilters(): void {
        this.selectedJobId = null;
        this.selectedStatus = null;
        this.updateDisplayedApplications();
    }

    getAvailableStatuses(currentStatus: string): string[] {
        const statusFlow: { [key: string]: string[] } = {
            'applied': ['applied', 'shortlisted', 'rejected', 'withdrawn'],
            'shortlisted': ['shortlisted', 'interviewed', 'rejected', 'withdrawn'],
            'interviewed': ['interviewed', 'selected', 'offered', 'rejected', 'on-hold'],
            'selected': ['selected', 'rejected'],
            'offered': ['offered', 'selected', 'rejected', 'withdrawn'],
            'rejected': ['rejected'],
            'withdrawn': ['withdrawn'],
            'on-hold': ['on-hold', 'interviewed', 'rejected']
        };

        return statusFlow[currentStatus] || ['applied', 'shortlisted', 'rejected', 'withdrawn'];
    }
}