import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storage: Storage | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.storage = localStorage;
        } else {
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

    getItem(key: string): string | null {
        if (!this.storage) return null;
        return this.storage.getItem(key);
    }

    setItem(key: string, value: string): void {
        if (!this.storage) return;
        this.storage.setItem(key, value);
    }

    removeItem(key: string): void {
        if (!this.storage) return;
        this.storage.removeItem(key);
    }

    clear(): void {
        if (!this.storage) return;
        this.storage.clear();
    }

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

    setObject(key: string, value: any): void {
        if (!this.storage) return;
        this.storage.setItem(key, JSON.stringify(value));
    }

    hasKey(key: string): boolean {
        if (!this.storage) return false;
        return this.storage.getItem(key) !== null;
    }
}
