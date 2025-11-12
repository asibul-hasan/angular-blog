import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    Inject,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: 'img[appLazyLoad]',
    standalone: true,
})
export class LazyLoadImageDirective implements OnInit {
    @Input() src: string = '';
    @Input() alt: string = '';
    @Input() placeholder: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E';

    private isBrowser: boolean;

    constructor(
        private el: ElementRef<HTMLImageElement>,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        if (!this.isBrowser) {
            // SSR: Set src directly
            this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
            this.renderer.setAttribute(this.el.nativeElement, 'alt', this.alt);
            return;
        }

        // Set placeholder
        this.renderer.setAttribute(this.el.nativeElement, 'src', this.placeholder);
        this.renderer.setAttribute(this.el.nativeElement, 'alt', this.alt);
        this.renderer.addClass(this.el.nativeElement, 'lazy-loading');

        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.loadImage();
                            observer.unobserve(this.el.nativeElement);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01,
                }
            );

            observer.observe(this.el.nativeElement);
        } else {
            // Fallback: Load image immediately
            this.loadImage();
        }
    }

    private loadImage(): void {
        const img = new Image();
        img.onload = () => {
            this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
            this.renderer.removeClass(this.el.nativeElement, 'lazy-loading');
            this.renderer.addClass(this.el.nativeElement, 'lazy-loaded');
        };
        img.onerror = () => {
            this.renderer.removeClass(this.el.nativeElement, 'lazy-loading');
            this.renderer.addClass(this.el.nativeElement, 'lazy-error');
        };
        img.src = this.src;
    }
}
