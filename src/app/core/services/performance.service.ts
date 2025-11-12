import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PerformanceService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    /**
     * Lazy load images using Intersection Observer
     */
    lazyLoadImages(): void {
        if (!this.isBrowser) return;

        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without Intersection Observer
            images.forEach((img: any) => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }

    /**
     * Optimize Cloudinary images
     */
    optimizeCloudinaryUrl(url: string, width?: number, quality: number = 80): string {
        if (!url || !url.includes('cloudinary.com')) return url;

        const transformations: string[] = [];

        // Add quality transformation
        transformations.push(`q_${quality}`);

        // Add auto format
        transformations.push('f_auto');

        // Add width if specified
        if (width) {
            transformations.push(`w_${width}`);
            transformations.push('c_limit');
        }

        // Add lazy loading
        transformations.push('fl_lazy');

        // Insert transformations into URL
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1) {
            return url.slice(0, uploadIndex + 8) + transformations.join(',') + '/' + url.slice(uploadIndex + 8);
        }

        return url;
    }

    /**
     * Preload critical resources
     */
    preloadResource(url: string, as: 'image' | 'script' | 'style' | 'font'): void {
        if (!this.isBrowser) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = url;

        if (as === 'font') {
            link.crossOrigin = 'anonymous';
        }

        document.head.appendChild(link);
    }

    /**
     * Defer non-critical JavaScript
     */
    deferScript(src: string, onload?: () => void): void {
        if (!this.isBrowser) return;

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;

        if (onload) {
            script.onload = onload;
        }

        document.body.appendChild(script);
    }

    /**
     * Report Web Vitals
     */
    reportWebVitals(): void {
        if (!this.isBrowser) return;

        // LCP - Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1] as any;
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // FID - First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry: any) => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // CLS - Cumulative Layout Shift
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry: any) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            console.log('CLS:', clsValue);
                        }
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // Silently fail if performance APIs not supported
            }
        }
    }

    /**
     * Enable resource hints
     */
    addResourceHints(urls: string[], type: 'prefetch' | 'preconnect' | 'dns-prefetch'): void {
        if (!this.isBrowser) return;

        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = type;
            link.href = url;

            if (type === 'preconnect') {
                link.crossOrigin = 'anonymous';
            }

            document.head.appendChild(link);
        });
    }

    /**
     * Clear unused caches (for development)
     */
    clearCaches(): Promise<boolean> {
        if (!this.isBrowser || !('caches' in window)) {
            return Promise.resolve(false);
        }

        return caches.keys().then(names => {
            return Promise.all(
                names.map(name => caches.delete(name))
            ).then(() => true);
        });
    }
}
