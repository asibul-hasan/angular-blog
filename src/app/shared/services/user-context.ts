import { StorageService } from './storage.service';

/**
 * User Context Utility
 * Provides easy access to user information stored in storage
 */

// User data interface matching the AuthService User interface
export interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isActive: boolean;
}

// Default empty user object
const EMPTY_USER: UserInfo = {
    _id: '',
    name: '',
    email: '',
    role: '',
    isActive: false
};

// Storage service instance for use in this utility
let storageService: StorageService | null = null;

/**
 * Initialize the user context with storage service
 * @param service StorageService instance
 */
export function initializeUserContext(service: StorageService): void {
    storageService = service;
}

/**
 * Helper function to get current user from storage
 * @returns UserInfo object or null if not found
 */
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

/**
 * User Context Constants
 * Provides direct access to user properties like userInfo.name, userInfo._id, etc.
 */
export const userInfo = {
    /**
     * Get the current user's ID
     */
    get _id(): string {
        const user = getCurrentUser();
        return user?._id || '';
    },

    /**
     * Get the current user's name
     */
    get name(): string {
        const user = getCurrentUser();
        return user?.name || '';
    },

    /**
     * Get the current user's email
     */
    get email(): string {
        const user = getCurrentUser();
        return user?.email || '';
    },

    /**
     * Get the current user's role
     */
    get role(): string {
        const user = getCurrentUser();
        return user?.role || '';
    },

    /**
     * Get the current user's avatar
     */
    get avatar(): string | undefined {
        const user = getCurrentUser();
        return user?.avatar;
    },

    /**
     * Check if the current user is active
     */
    get isActive(): boolean {
        const user = getCurrentUser();
        return user?.isActive || false;
    },

    /**
     * Check if a user is currently logged in
     */
    get isLoggedIn(): boolean {
        const user = getCurrentUser();
        return !!user && !!user._id && !!user.name;
    },

    /**
     * Check if the current user is an admin
     */
    get isAdmin(): boolean {
        return this.role === 'admin';
    },

    /**
     * Get the complete user object
     */
    get data(): UserInfo {
        return getCurrentUser() || EMPTY_USER;
    }
};

/**
 * User Context Utility Functions
 */
export const UserContext = {
    /**
     * Get user ID
     * @returns User ID or empty string
     */
    getUserId(): string {
        return userInfo._id;
    },

    /**
     * Get user name
     * @returns User name or empty string
     */
    getUserName(): string {
        return userInfo.name;
    },

    /**
     * Get user email
     * @returns User email or empty string
     */
    getUserEmail(): string {
        return userInfo.email;
    },

    /**
     * Get user role
     * @returns User role or empty string
     */
    getUserRole(): string {
        return userInfo.role;
    },

    /**
     * Check if user is logged in
     * @returns True if user is logged in, false otherwise
     */
    isLoggedIn(): boolean {
        return userInfo.isLoggedIn;
    },

    /**
     * Check if user is admin
     * @returns True if user is admin, false otherwise
     */
    isAdmin(): boolean {
        return userInfo.isAdmin;
    },

    /**
     * Get complete user data
     * @returns User data object
     */
    getUserData(): UserInfo {
        return userInfo.data;
    }
};

// Export default for easier imports
export default userInfo;