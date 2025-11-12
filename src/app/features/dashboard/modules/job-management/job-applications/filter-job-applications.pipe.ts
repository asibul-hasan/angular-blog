import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterJobApplications',
    standalone: true
})
export class FilterJobApplicationsPipe implements PipeTransform {
    transform(applications: any[], jobId: string): any[] {
        if (!applications || !jobId) {
            return applications || [];
        }

        return applications.filter(app => app.jobId && app.jobId._id === jobId);
    }
}