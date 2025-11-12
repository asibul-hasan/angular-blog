import { Routes } from '@angular/router';
import { UsersManagementComponent } from './user-profile/user-profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AdminGuard } from '../../../../core/guards/admin.guard';

export const USER_MANAGEMENT_ROUTES: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UsersManagementComponent, canActivate: [AdminGuard] },
    { path: 'my-profile', component: MyProfileComponent, canActivate: [AdminGuard] },
];