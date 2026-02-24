import { Routes } from '@angular/router';

export const INTERN_MANAGEMENT_ROUTES: Routes = [
    {
        path: 'list',
        loadComponent: () => import('./list/intern-list.component').then(c => c.InternListComponent),
        data: { roles: ['admin'] }
    },
    {
        path: 'domain-tasks',
        loadComponent: () => import('./domain-tasks/domain-tasks.component').then(c => c.DomainTasksComponent),
        data: { roles: ['admin'] }
    },
    {
        path: 'task-review',
        loadComponent: () => import('./task-review/task-review.component').then(c => c.TaskReviewComponent),
        data: { roles: ['admin'] }
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];