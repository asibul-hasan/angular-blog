import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full-screen';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    constructor(private dialog: MatDialog) { }

    /**
     * Open a modal dialog with the specified component and configuration
     * @param component The component to display in the modal
     * @param data Data to pass to the modal component
     * @param size Size of the modal (sm, md, lg, xl, full-screen)
     * @returns Observable that emits when the modal is closed
     */
    openDialog(component: any, data: any = {}, size: ModalSize = 'md'): Observable<any> {
        // Ensure data has a title if not provided
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

    /**
     * Get modal configuration based on size
     * @param size The size of the modal
     * @returns MatDialogConfig with size properties
     */
    private getModalSizeConfig(size: ModalSize): MatDialogConfig {
        switch (size) {
            case 'sm':
                return {
                    width: '60vw',
                    maxWidth: '95vw',
                    maxHeight: '90vh'
                };
            case 'md':
                return {
                    width: '70vw',
                    maxWidth: '95vw',
                    maxHeight: '90vh'
                };
            case 'lg':
                return {
                    width: '80vw',
                    maxWidth: '95vw',
                    maxHeight: '90vh'
                };
            case 'xl':
                return {
                    width: '90vw',
                    maxWidth: '95vw',
                    maxHeight: '90vh'
                };
            case 'full-screen':
                return {
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    panelClass: 'full-screen-modal'
                };
            default:
                return {
                    width: '600px',
                    maxWidth: '95vw',
                    maxHeight: '90vh'
                };
        }
    }

    /**
     * Get panel class based on size
     * @param size The size of the modal
     * @returns CSS class string for the panel
     */
    private getPanelClass(size: ModalSize): string {
        if (size === 'full-screen') {
            return 'full-screen-modal';
        }
        return 'dark-modal';
    }

    /**
     * Check if an object is empty
     * @param obj The object to check
     * @returns True if the object is empty, false otherwise
     */
    isEmpty(obj: any): boolean {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    /**
     * Deep clone an object
     * @param obj The object to clone
     * @returns A deep clone of the object
     */
    deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Format a date as a string
     * @param date The date to format
     * @param format The format string (e.g. 'YYYY-MM-DD')
     * @returns Formatted date string
     */
    formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day);
    }

    /**
     * Generate a random ID
     * @returns A random string ID
     */
    generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * Debounce function to limit the rate at which a function is called
     * @param func The function to debounce
     * @param delay The delay in milliseconds
     * @returns A debounced version of the function
     */
    debounce(func: Function, delay: number): Function {
        let timeoutId: any;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}