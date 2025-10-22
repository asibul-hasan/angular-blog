// horizontal-scroll.directive.ts
import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appHorizontalScroll]',
  standalone: true,
})
export class HorizontalScrollDirective
  implements OnInit, OnDestroy, AfterViewInit
{
  private mediaQuery?: MediaQueryList;
  private isHorizontal: boolean = false;
  private isInStickyZone: boolean = false;
  private isBrowser: boolean;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.mediaQuery = window.matchMedia('(min-width: 1024px)');
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.updateProperties();
    }
  }

  ngOnInit() {
    if (this.isBrowser && this.mediaQuery) {
      this.mediaQuery.addEventListener('change', this.handleResize);
      window.addEventListener('scroll', this.checkStickyZone);
      // Add wheel event listener with passive: false
      window.addEventListener('wheel', this.onWheel, { passive: false });
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleResize);
      window.removeEventListener('scroll', this.checkStickyZone);
      window.removeEventListener('wheel', this.onWheel);
    }
  }

  private handleResize = () => {
    this.updateProperties();
  };

  private checkStickyZone = () => {
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const stickyTop = 80; // matches top-20 (5rem = 80px)

    // Check if element is stuck at the top
    this.isInStickyZone =
      rect.top <= stickyTop + 10 && rect.top >= stickyTop - 10;
  };

  private updateProperties() {
    if (this.mediaQuery) {
      this.isHorizontal = this.mediaQuery.matches;
    }
  }

  private onWheel = (event: WheelEvent) => {
    if (!this.isBrowser || !this.isHorizontal) return; // Only work on desktop in browser

    const element = this.el.nativeElement;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const currentScroll = element.scrollLeft;

    // Check if we're at boundaries
    const atStart = currentScroll <= 0;
    const atEnd = currentScroll >= maxScrollLeft - 1;

    // Check if section is in the sticky zone
    const rect = element.getBoundingClientRect();
    const stickyTop = 80;
    const isStuck = Math.abs(rect.top - stickyTop) < 10;

    if (!isStuck) return; // Only intercept when stuck

    // Convert vertical scroll to horizontal
    if (event.deltaY !== 0) {
      const shouldScroll =
        (event.deltaY > 0 && !atEnd) || (event.deltaY < 0 && !atStart);

      if (shouldScroll) {
        event.preventDefault();
        event.stopPropagation();

        const scrollAmount = event.deltaY * 1.5;
        element.scrollLeft = Math.max(
          0,
          Math.min(currentScroll + scrollAmount, maxScrollLeft)
        );
      }
    }

    // Also handle direct horizontal scroll
    if (event.deltaX !== 0) {
      const shouldScroll =
        (event.deltaX > 0 && !atEnd) || (event.deltaX < 0 && !atStart);

      if (shouldScroll) {
        event.preventDefault();
        event.stopPropagation();
        element.scrollLeft += event.deltaX;
      }
    }
  };
}
