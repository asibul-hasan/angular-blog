import { Routes } from '@angular/router';

export const INTERN_PORTAL_ROUTES: Routes = [
    {
        path: 'tasks',
        loadComponent: () => import('./tasks/intern-tasks.component').then(c => c.InternTasksComponent),
        data: { roles: ['intern', 'admin'] }
    },
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    }
];
