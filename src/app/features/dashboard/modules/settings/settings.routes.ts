import { Routes } from '@angular/router';
import { AdminGuard } from '../../../../core/guards/admin.guard';

// Company Management Components
import { CompanyManagementComponent } from './company-management/company-management.component';

// Access Management Components
import { UserAccessManagementComponent } from './user-access-management/user-access-management.component';
import { ModuleAccessManagementComponent } from './module-access-management/module-access-management.component';

export const SETTINGS_ROUTES: Routes = [
    { path: '', redirectTo: 'company-management', pathMatch: 'full' },
    {
        path: 'company-management',
        component: CompanyManagementComponent,
        canActivate: [AdminGuard]
    },
    { path: 'user-access-management', component: UserAccessManagementComponent, canActivate: [AdminGuard] },
    { path: 'module-access-management', component: ModuleAccessManagementComponent, canActivate: [AdminGuard] }
];