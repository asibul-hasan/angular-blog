import { Routes } from '@angular/router';
import { JobCreateComponent } from './job-create/job-create.component';
import { JobsListComponent } from './jobs/jobs-list.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';
import { AdminGuard } from '../../../../core/guards/admin.guard';

export const JOB_MANAGEMENT_ROUTES: Routes = [
    { path: '', redirectTo: 'jobs', pathMatch: 'full' },
    { path: 'jobs', component: JobsListComponent, canActivate: [AdminGuard] },
    { path: 'job/create', component: JobCreateComponent, canActivate: [AdminGuard] },
    { path: 'job-applications', component: JobApplicationsComponent, canActivate: [AdminGuard] },
];