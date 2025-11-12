import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    public isLoading$ = new BehaviorSubject<boolean>(false);
    private renderer: Renderer2;
    private loadingCount = 0;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private rendererFactory: RendererFactory2
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    show() {
        this.loadingCount++;
        if (this.loadingCount === 1) {
            this.isLoading$.next(true);
            this.renderer.addClass(this.document.body, 'loader-active');
        }
    }

    hide() {
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
            this.isLoading$.next(false);
            this.renderer.removeClass(this.document.body, 'loader-active');
        }
    }
}
