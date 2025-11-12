import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersManagementComponent } from './user-profile/user-profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        UsersManagementComponent,
        MyProfileComponent
    ]
})
export class UserManagementModule { }