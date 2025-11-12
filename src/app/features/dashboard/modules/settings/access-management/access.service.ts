import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
}

export interface Module {
    id: number;
    name: string;
    description: string;
    submodules: string[];
    forms: string[];
}

export interface Role {
    id: string;
    name: string;
}

export interface Permission {
    moduleId: number;
    roleId: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AccessService {
    private users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', isActive: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Recruiter', isActive: true },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'HR', isActive: false },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Manager', isActive: true },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Support', isActive: true }
    ];

    private modules: Module[] = [
        {
            id: 1,
            name: 'Blog Management',
            description: 'Manage blog posts and categories',
            submodules: ['Posts', 'Categories', 'Comments'],
            forms: ['Create Post', 'Edit Post', 'Manage Categories']
        },
        {
            id: 2,
            name: 'Job Management',
            description: 'Manage job listings and applications',
            submodules: ['Jobs', 'Applications', 'Candidates'],
            forms: ['Create Job', 'Review Applications', 'Schedule Interviews']
        },
        {
            id: 3,
            name: 'User Management',
            description: 'Manage users and permissions',
            submodules: ['Users', 'Roles', 'Permissions'],
            forms: ['Create User', 'Assign Roles', 'Manage Permissions']
        },
        {
            id: 4,
            name: 'Company Management',
            description: 'Manage company profiles and settings',
            submodules: ['Companies', 'Departments', 'Teams'],
            forms: ['Create Company', 'Edit Company', 'Manage Departments']
        }
    ];

    private roles: Role[] = [
        { id: 'user', name: 'User' },
        { id: 'guest', name: 'Guest' },
        { id: 'moderator', name: 'Moderator' },
        { id: 'admin', name: 'Admin' },
        { id: 'superadmin', name: 'Superadmin' },
        { id: 'recruiter', name: 'Recruiter' },
        { id: 'employer', name: 'Employer' },
        { id: 'hr', name: 'HR' },
        { id: 'manager', name: 'Manager' },
        { id: 'support', name: 'Support' }
    ];

    private permissions: Permission[] = [
        // Admin has full access to all modules
        { moduleId: 1, roleId: 'admin', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { moduleId: 2, roleId: 'admin', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { moduleId: 3, roleId: 'admin', canView: true, canCreate: true, canEdit: true, canDelete: true },
        { moduleId: 4, roleId: 'admin', canView: true, canCreate: true, canEdit: true, canDelete: true },

        // Recruiter has view and edit access to Job Management
        { moduleId: 2, roleId: 'recruiter', canView: true, canCreate: true, canEdit: true, canDelete: false },

        // HR has view access to User Management
        { moduleId: 3, roleId: 'hr', canView: true, canCreate: false, canEdit: false, canDelete: false },

        // Manager has view access to Company Management
        { moduleId: 4, roleId: 'manager', canView: true, canCreate: false, canEdit: false, canDelete: false }
    ];

    constructor() { }

    getUsers(): Observable<User[]> {
        return of(this.users);
    }

    getModules(): Observable<Module[]> {
        return of(this.modules);
    }

    getRoles(): Observable<Role[]> {
        return of(this.roles);
    }

    getPermissions(): Observable<Permission[]> {
        return of(this.permissions);
    }

    updatePermission(permission: Permission): Observable<boolean> {
        const index = this.permissions.findIndex(p =>
            p.moduleId === permission.moduleId && p.roleId === permission.roleId);

        if (index !== -1) {
            this.permissions[index] = permission;
        } else {
            this.permissions.push(permission);
        }

        return of(true);
    }
}