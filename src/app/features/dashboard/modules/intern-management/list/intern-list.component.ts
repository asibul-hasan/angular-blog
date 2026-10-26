import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, InternProfile } from '../../../../../shared/services';

@Component({
  selector: 'app-intern-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ...SHARED_IMPORTS],
  templateUrl: './intern-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternListComponent implements OnInit {
  private internService = inject(InternService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public interns = signal<InternProfile[]>([]);
  public isLoading = signal<boolean>(true);

  public searchQuery = signal<string>('');
  public selectedDomain = signal<string>('all');
  public selectedStatus = signal<string>('all');

  public activeInterns = computed(() => this.interns().filter((i) => i.status === 'active'));
  public completedInterns = computed(() => this.interns().filter((i) => i.status === 'completed'));
  public pendingInterns = computed(() => this.interns().filter((i) => i.status === 'pending'));

  public domainsList = computed(() => {
    const set = new Set<string>();
    this.interns().forEach((i) => {
      if (i.domain) set.add(i.domain);
    });
    return Array.from(set);
  });

  public filteredInterns = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const domain = this.selectedDomain().toLowerCase();
    const status = this.selectedStatus().toLowerCase();

    return this.interns().filter((i) => {
      const name = (i.userId?.name || '').toLowerCase();
      const email = (i.userId?.email || '').toLowerCase();
      const phone = (i.phone || '').toLowerCase();
      const internDomain = (i.domain || '').toLowerCase();
      const internStatus = (i.status || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);
      const matchesDomain = domain === 'all' || internDomain === domain;
      const matchesStatus = status === 'all' || internStatus === status;

      return matchesSearch && matchesDomain && matchesStatus;
    });
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchInterns();
    } else {
      this.isLoading.set(false);
    }
  }

  fetchInterns(): void {
    this.isLoading.set(true);
    this.internService.getAllInterns().subscribe({
      next: (res) => {
        this.interns.set(res.body || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.warn('Error', 'Failed to fetch interns');
        this.isLoading.set(false);
      },
    });
  }

  updateStatus(internId: string, newStatus: string): void {
    this.internService.updateInternStatus(internId, newStatus).subscribe({
      next: (res) => {
        this.toast.success('Success', res.message || `Status updated to ${newStatus}`);
        this.fetchInterns();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error', 'Failed to update status');
      },
    });
  }

  getDomainBadge(domain: string): { bg: string; text: string; border: string } {
    const d = (domain || '').toLowerCase();
    if (d.includes('python')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    if (d.includes('web')) return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' };
    if (d.includes('machine') || d.includes('ml')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    if (d.includes('artific') || d.includes('ai')) return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
    return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' };
  }
}
