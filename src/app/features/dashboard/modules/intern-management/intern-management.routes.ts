import { Routes } from '@angular/router';
import { AdminGuard } from '../../../../core/guards/admin.guard';

export const INTERN_MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'domains',
        pathMatch: 'full'
    },
    {
        path: 'domains',
        loadComponent: () => import('./domain/domain.component').then(c => c.DomainComponent),
        canActivate: [AdminGuard]
    }
];