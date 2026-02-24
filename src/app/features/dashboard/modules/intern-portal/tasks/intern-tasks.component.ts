import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, InternTask } from '../../../../../shared/services';

@Component({
  selector: 'app-intern-tasks',
  standalone: true,
  imports: [CommonModule, ...SHARED_IMPORTS],
  templateUrl: './intern-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternTasksComponent implements OnInit {
  private internService = inject(InternService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public tasks = signal<InternTask[]>([]);
  public isLoading = signal(true);
  public isSubmitting = signal<string | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchTasks();
    } else {
      this.isLoading.set(false);
    }
  }

  fetchTasks() {
    this.isLoading.set(true);
    this.internService.getMyTasks()
      .subscribe({
        next: (res) => {
          this.tasks.set(res.body);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error', 'Failed to load tasks');
          this.isLoading.set(false);
        }
      });
  }

  submitTask(taskId: string, url: string) {
    if (!url) {
      this.toast.warn('Validation', 'Please provide a valid submission link');
      return;
    }

    this.isSubmitting.set(taskId);
    
    this.internService.submitTask(taskId, url)
      .subscribe({
        next: (res) => {
          this.toast.success('Success', 'Task submitted successfully!');
          this.isSubmitting.set(null);
          this.fetchTasks(); // Refresh to get updated status
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error', 'Failed to submit task');
          this.isSubmitting.set(null);
        }
      });
  }
}
