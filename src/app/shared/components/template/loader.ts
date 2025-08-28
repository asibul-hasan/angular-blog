import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../services/loader/loader';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf, AsyncPipe],
  template: `
    <div *ngIf="loader.isLoading$ | async" class="loader-overlay">
      <mat-spinner></mat-spinner>
    </div>
  `,
  styles: `.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
  }`,
})
export class LoaderComponent {
  public loader = inject(LoaderService);
}
