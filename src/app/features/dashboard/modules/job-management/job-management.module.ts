import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobCreateComponent } from './job-create/job-create.component';
import { JobsListComponent } from './jobs/jobs-list.component';
import { JobApplicationsComponent } from './job-applications/job-applications.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        JobCreateComponent,
        JobsListComponent,
        JobApplicationsComponent
    ]
})
export class JobManagementModule { }