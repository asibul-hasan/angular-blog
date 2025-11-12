import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storage: Storage | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        // Initialize storage based on platform
        if (isPlatformBrowser(this.platformId)) {
            this.storage = localStorage;
        } else {
            // SSR: Provide a no-op fallback to avoid runtime errors
            this.storage = {
                getItem: () => null,
                setItem: () => { },
                removeItem: () => { },
                clear: () => { },
                key: () => null,
                length: 0,
            };
        }
    }

    /**
     * Get item from storage
     * @param key The key to retrieve
     * @returns The value associated with the key, or null if not found
     */
    getItem(key: string): string | null {
        if (!this.storage) return null;
        return this.storage.getItem(key);
    }

    /**
     * Set item in storage
     * @param key The key to set
     * @param value The value to store
     */
    setItem(key: string, value: string): void {
        if (!this.storage) return;
        this.storage.setItem(key, value);
    }

    /**
     * Remove item from storage
     * @param key The key to remove
     */
    removeItem(key: string): void {
        if (!this.storage) return;
        this.storage.removeItem(key);
    }

    /**
     * Clear all items from storage
     */
    clear(): void {
        if (!this.storage) return;
        this.storage.clear();
    }

    /**
     * Get parsed JSON object from storage
     * @param key The key to retrieve
     * @returns The parsed object, or null if not found or invalid
     */
    getObject<T>(key: string): T | null {
        const item = this.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item) as T;
        } catch (e) {
            console.error(`Error parsing JSON for key ${key}:`, e);
            return null;
        }
    }

    /**
     * Set object in storage as JSON string
     * @param key The key to set
     * @param value The object to store
     */
    setObject(key: string, value: any): void {
        if (!this.storage) return;
        this.storage.setItem(key, JSON.stringify(value));
    }

    /**
     * Check if a key exists in storage
     * @param key The key to check
     * @returns True if the key exists, false otherwise
     */
    hasKey(key: string): boolean {
        if (!this.storage) return false;
        return this.storage.getItem(key) !== null;
    }
}