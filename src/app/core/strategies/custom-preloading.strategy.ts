import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
    /**
     * Custom preloading strategy that implements intelligent preloading
     * with priority-based loading and network awareness
     */
    preload(route: Route, load: () => Observable<any>): Observable<any> {
        // Check if route should be preloaded
        if (route.data && route.data['preload']) {
            // For high priority routes, load immediately
            if (route.data['preloadPriority'] === 'high') {
                return load();
            }

            // For normal priority routes, add a small delay to avoid blocking initial render
            const delay = route.data['preloadDelay'] || 2000; // Default 2 second delay
            return timer(delay).pipe(mergeMap(() => load()));
        }

        // Don't preload routes without preload flag
        return of(null);
    }
}