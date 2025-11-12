import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full-screen';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    constructor(private dialog: MatDialog) { }

    openDialog(component: any, data: any = {}, size: ModalSize = 'md'): Observable<any> {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            data.title = 'New Dialog';
        }

        const config: MatDialogConfig = {
            data,
            ...this.getModalSizeConfig(size),
            autoFocus: false,
            hasBackdrop: true,
            disableClose: true,
            backdropClass: 'dark-backdrop',
            panelClass: this.getPanelClass(size)
        };

        const dialogRef = this.dialog.open(component, config);
        return dialogRef.afterClosed();
    }

    private getModalSizeConfig(size: ModalSize): MatDialogConfig {
        switch (size) {
            case 'sm':
                return { width: '60vw', maxWidth: '95vw', maxHeight: '90vh' };
            case 'md':
                return { width: '70vw', maxWidth: '95vw', maxHeight: '90vh' };
            case 'lg':
                return { width: '80vw', maxWidth: '95vw', maxHeight: '90vh' };
            case 'xl':
                return { width: '90vw', maxWidth: '95vw', maxHeight: '90vh' };
            case 'full-screen':
                return { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh', panelClass: 'full-screen-modal' };
            default:
                return { width: '600px', maxWidth: '95vw', maxHeight: '90vh' };
        }
    }

    private getPanelClass(size: ModalSize): string {
        if (size === 'full-screen') return 'full-screen-modal';
        return 'dark-modal';
    }

    isEmpty(obj: any): boolean {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return format.replace('YYYY', year.toString()).replace('MM', month).replace('DD', day);
    }

    generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    debounce(func: Function, delay: number): Function {
        let timeoutId: any;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}
