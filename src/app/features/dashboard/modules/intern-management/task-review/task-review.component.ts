import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, TaskSubmission } from '../../../../../shared/services';



@Component({
  selector: 'app-task-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ...SHARED_IMPORTS],
  templateUrl: './task-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskReviewComponent implements OnInit {
  private internService = inject(InternService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public submissions = signal<TaskSubmission[]>([]);
  public isLoading = signal<boolean>(true);
  
  // UI State for Modal or inline editor
  public selectedSubmission = signal<TaskSubmission | null>(null);
  public feedbackText = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
        this.fetchPendingSubmissions();
    }
  }

  fetchPendingSubmissions(): void {
    this.isLoading.set(true);
    this.internService.getPendingSubmissions()
      .subscribe({
        next: (res) => {
          this.submissions.set(res.body);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error', 'Failed to fetch pending submissions');
          this.isLoading.set(false);
        }
      });
  }

  selectSubmission(sub: TaskSubmission): void {
    this.selectedSubmission.set(sub);
    this.feedbackText.set(sub.feedback || '');
  }

  closeEditor(): void {
    this.selectedSubmission.set(null);
    this.feedbackText.set('');
  }

  reviewSubmission(status: 'approved' | 'rejected'): void {
    const sub = this.selectedSubmission();
    if (!sub) return;

    if (status === 'rejected' && !this.feedbackText().trim()) {
      this.toast.warn('Validation', 'Feedback is required when rejecting a submission.');
      return;
    }

    this.internService.reviewSubmission(sub._id, status, this.feedbackText())
       .subscribe({
         next: (res) => {
           this.toast.success('Success', `Task ${status} successfully.`);
           this.closeEditor();
           this.fetchPendingSubmissions();
         },
         error: (err) => {
           console.error(err);
           this.toast.error('Error', `Failed to ${status} task.`);
         }
       });
  }
}
