import { Injectable } from '@angular/core';

// Type definitions for Web Vitals APIs
interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
}

@Injectable({
    providedIn: 'root'
})
export class PerformanceMonitorService {
    private startTime: number = 0;
    private metrics: PerformanceMetrics = {
        blockingTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
    };

    constructor() {
        // Start measuring performance on service initialization
        this.startMeasurement();
    }

    /**
     * Start performance measurement
     */
    startMeasurement(): void {
        this.startTime = performance.now();
    }

    /**
     * End performance measurement and calculate blocking time
     */
    endMeasurement(): number {
        const endTime = performance.now();
        const blockingTime = endTime - this.startTime;
        this.metrics.blockingTime = blockingTime;
        return blockingTime;
    }

    /**
     * Get current performance metrics
     */
    getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }

    /**
     * Report Core Web Vitals
     */
    reportWebVitals(): void {
        if ('performance' in window && 'getEntriesByType' in performance) {
            // First Contentful Paint (FCP)
            const fcpEntries = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntries) {
                this.metrics.firstContentfulPaint = fcpEntries.startTime;
            }

            // Largest Contentful Paint (LCP)
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            if (lcpEntries.length > 0) {
                const lastLcp = lcpEntries[lcpEntries.length - 1];
                this.metrics.largestContentfulPaint = lastLcp.startTime;
            }

            // Cumulative Layout Shift (CLS)
            const clsEntries = performance.getEntriesByType('layout-shift') as LayoutShift[];
            let cls = 0;
            for (const entry of clsEntries) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift = cls;

            // First Input Delay (FID) - only available in supported browsers
            if ('getEntriesByType' in performance && performance.getEntriesByType('first-input').length > 0) {
                const fidEntries = performance.getEntriesByType('first-input') as PerformanceEventTiming[];
                if (fidEntries.length > 0) {
                    this.metrics.firstInputDelay = fidEntries[0].processingStart - fidEntries[0].startTime;
                }
            }
        }
    }

    /**
     * Log performance metrics to console
     */
    logMetrics(): void {
        console.log('Performance Metrics:', this.metrics);

        // Check if we've achieved the target of under 200ms blocking time
        if (this.metrics.blockingTime < 200) {
            console.log('✅ Performance target achieved: Blocking time under 200ms');
        } else {
            console.log('⚠️ Performance target not met: Blocking time is', this.metrics.blockingTime, 'ms');
        }
    }
}

interface PerformanceMetrics {
    blockingTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
}