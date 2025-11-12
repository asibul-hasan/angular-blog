import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccessService, Module, Role, Permission } from '../access-management/access.service';

@Component({
    selector: 'app-module-access-management',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './module-access-management.component.html',
    styleUrls: ['./module-access-management.component.css']
})
export class ModuleAccessManagementComponent implements OnInit {
    modules: Module[] = [];
    roles: Role[] = [];
    permissions: Permission[] = [];

    constructor(private accessService: AccessService) { }

    ngOnInit(): void {
        this.loadModules();
        this.loadRoles();
        this.loadPermissions();
    }

    loadModules(): void {
        this.accessService.getModules().subscribe(
            modules => this.modules = modules
        );
    }

    loadRoles(): void {
        this.accessService.getRoles().subscribe(
            roles => this.roles = roles
        );
    }

    loadPermissions(): void {
        this.accessService.getPermissions().subscribe(
            permissions => this.permissions = permissions
        );
    }

    getPermission(moduleId: number, roleId: string): Permission | undefined {
        return this.permissions.find(p => p.moduleId === moduleId && p.roleId === roleId);
    }

    updatePermission(moduleId: number, roleId: string, action: string, event: any): void {
        const permission = this.getPermission(moduleId, roleId) || {
            moduleId: moduleId,
            roleId: roleId,
            canView: false,
            canCreate: false,
            canEdit: false,
            canDelete: false
        };

        switch (action) {
            case 'view':
                permission.canView = event.target.checked;
                break;
            case 'create':
                permission.canCreate = event.target.checked;
                break;
            case 'edit':
                permission.canEdit = event.target.checked;
                break;
            case 'delete':
                permission.canDelete = event.target.checked;
                break;
        }

        this.accessService.updatePermission(permission).subscribe(
            success => {
                if (success) {
                    // Update local permissions array
                    const index = this.permissions.findIndex(p => p.moduleId === moduleId && p.roleId === roleId);
                    if (index !== -1) {
                        this.permissions[index] = permission;
                    } else {
                        this.permissions.push(permission);
                    }
                }
            }
        );
    }
}