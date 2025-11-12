import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccessService, User } from '../access-management/access.service';

@Component({
    selector: 'app-user-access-management',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './user-access-management.component.html',
    styleUrls: ['./user-access-management.component.css']
})
export class UserAccessManagementComponent implements OnInit {
    users: User[] = [];

    constructor(private accessService: AccessService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.accessService.getUsers().subscribe(
            users => this.users = users
        );
    }

    manageAccess(user: User): void {
        // Implement access management logic here
        console.log('Managing access for user:', user);
    }
}