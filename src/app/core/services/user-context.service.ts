import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';

// Interface for company information
export interface UserCompany {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
}

export interface UserInfo {
    userId: string;
    userName: string;
    email: string;
    userRole: string;
    avatar?: string;
    isActive: boolean;
    companies?: UserCompany[];
}

const EMPTY_USER: UserInfo = { userId: '', userName: '', email: '', userRole: '', isActive: false };

@Injectable({
    providedIn: 'root'
})
export class UserContextService {
    private storageService = inject(StorageService);
    private currentUser = signal<UserInfo | null>(this.getCurrentUserFromStorage());

    public user = computed(() => this.currentUser() || EMPTY_USER);
    public isLoggedIn = computed(() => {
        const user = this.currentUser();
        return !!user && !!user.userId && !!user.userName;
    });
    private static readonly ADMIN_ROLES = ['admin', 'superadmin', 'hr', 'manager', 'recruiter'];
    public isAdmin = computed(() => UserContextService.ADMIN_ROLES.includes(this.user().userRole));

    private getCurrentUserFromStorage(): UserInfo | null {
        try {
            return this.storageService.getObject<UserInfo>('currentUser');
        } catch (e) {
            console.error('Error parsing user data from storage:', e);
            return null;
        }
    }

    public setCurrentUser(user: UserInfo | null): void {
        this.currentUser.set(user);
        if (user) {
            this.storageService.setObject('currentUser', user);
        } else {
            this.storageService.removeItem('currentUser');
        }
    }
}
