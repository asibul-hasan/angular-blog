import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    <div *ngIf="loader.isLoading$ | async" class="top-loader-bar" aria-hidden="true">
      <div class="top-loader-glow"></div>
    </div>
  `,
  styles: [
    `
      .top-loader-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: transparent;
        z-index: 9999;
        overflow: hidden;
        pointer-events: none;
      }

      .top-loader-glow {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #f76179, #f49725, #255ff4, #f76179);
        background-size: 200% 100%;
        animation: top-loader-slide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        box-shadow: 0 0 10px rgba(247, 97, 121, 0.7);
      }

      @keyframes top-loader-slide {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  public loader = inject(LoaderService);
}
