import { StorageService } from './storage.service';

export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isActive: boolean;
}

const EMPTY_USER: UserInfo = { _id: '', name: '', email: '', role: '', isActive: false };

let storageService: StorageService | null = null;

export function initializeUserContext(service: StorageService): void {
    storageService = service;
}

function getCurrentUser(): UserInfo | null {
    if (!storageService) {
        console.warn('UserContext not initialized with StorageService');
        return null;
    }

    try {
        return storageService.getObject<UserInfo>('currentUser');
    } catch (e) {
        console.error('Error parsing user data from storage:', e);
        return null;
    }
}

export const userInfo = {
    get _id(): string { const user = getCurrentUser(); return user?._id || ''; },
    get name(): string { const user = getCurrentUser(); return user?.name || ''; },
    get email(): string { const user = getCurrentUser(); return user?.email || ''; },
    get role(): string { const user = getCurrentUser(); return user?.role || ''; },
    get avatar(): string | undefined { const user = getCurrentUser(); return user?.avatar; },
    get isActive(): boolean { const user = getCurrentUser(); return user?.isActive || false; },
    get isLoggedIn(): boolean { const user = getCurrentUser(); return !!user && !!user._id && !!user.name; },
    get isAdmin(): boolean { return this.role === 'admin'; },
    get data(): UserInfo { return getCurrentUser() || EMPTY_USER; }
};

export const UserContext = {
    getUserId(): string { return userInfo._id; },
    getUserName(): string { return userInfo.name; },
    getUserEmail(): string { return userInfo.email; },
    getUserRole(): string { return userInfo.role; },
    isLoggedIn(): boolean { return userInfo.isLoggedIn; },
    isAdmin(): boolean { return userInfo.isAdmin; },
    getUserData(): UserInfo { return userInfo.data; }
};

export default userInfo;
