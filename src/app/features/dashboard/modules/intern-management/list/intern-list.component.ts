import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, InternProfile } from '../../../../../shared/services';



@Component({
  selector: 'app-intern-list',
  standalone: true,
  imports: [CommonModule, ...SHARED_IMPORTS],
  templateUrl: './intern-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternListComponent implements OnInit {
  private internService = inject(InternService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public interns = signal<InternProfile[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchInterns();
    } else {
      this.isLoading.set(false);
    }
  }

  fetchInterns(): void {
    this.isLoading.set(true);
    this.internService.getAllInterns()
      .subscribe({
        next: (res) => {
          this.interns.set(res.body);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.toast.warn('Error', 'Failed to fetch interns');
          this.isLoading.set(false);
        }
      });
  }

  updateStatus(internId: string, newStatus: string): void {
    this.internService.updateInternStatus(internId, newStatus)
      .subscribe({
        next: (res) => {
          this.toast.success('Success', res.message);
          this.fetchInterns(); // refresh list
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error', 'Failed to update status');
        }
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-500';
      case 'completed': return 'bg-blue-500/20 text-blue-500';
      case 'terminated': return 'bg-red-500/20 text-red-500';
      default: return 'bg-yellow-500/20 text-yellow-500'; // pending
    }
  }
}
