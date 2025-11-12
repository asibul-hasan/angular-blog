import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionService } from '../services/permission/permission.service';

@Directive({
    selector: '[appHasPermission]'
})
export class PermissionDirective implements OnInit {
    private hasPermission = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionService: PermissionService
    ) { }

    @Input() set appHasPermission(permission: { form: string, action: string }) {
        this.checkPermission(permission.form, permission.action);
    }

    ngOnInit() {
        // Initial check
        // The permission check is done in the setter
    }

    private async checkPermission(form: string, action: string) {
        try {
            this.hasPermission = await this.permissionService.hasPermission(form, action);
            this.updateView();
        } catch (error) {
            console.error('Error checking permission:', error);
            this.hasPermission = false;
            this.updateView();
        }
    }

    private updateView() {
        if (this.hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}