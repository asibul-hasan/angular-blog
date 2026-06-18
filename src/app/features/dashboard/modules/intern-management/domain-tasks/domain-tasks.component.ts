import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, DomainTask } from '../../../../../shared/services';



@Component({
  selector: 'app-domain-tasks',
  imports: [CommonModule, ReactiveFormsModule, ...SHARED_IMPORTS],
  templateUrl: './domain-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainTasksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private internService = inject(InternService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  public isSubmitting = signal(false);
  public isLoading = signal(true);
  public domainTasks = signal<DomainTask[]>([]);

  public groupedTasks = computed(() => {
    const groups: Record<string, DomainTask[]> = {};
    this.domainTasks().forEach(task => {
      if (!groups[task.domain]) {
        groups[task.domain] = [];
      }
      groups[task.domain].push(task);
    });
    // Sort tasks within each group by order
    Object.keys(groups).forEach(domain => {
      groups[domain].sort((a, b) => a.order - b.order);
    });
    return groups;
  });

  public assistantDomains = computed(() => Object.keys(this.groupedTasks()));

  public availableDomains = [
    'Web Development', 'Graphic Design', 'Data Science',
    'Digital Marketing', 'App Development', 'Cyber Security',
    'UI/UX Design', 'Cloud Computing', 'Machine Learning', 'Artificial Intelligence'
  ];

  public taskForm = this.fb.group({
    domain: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    order: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    } else {
      this.isLoading.set(false);
    }
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.internService.getDomainTasks()
      .subscribe({
        next: (res) => {
          this.domainTasks.set(res.body);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.toast.warn('Validation', 'Please fill out all fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
    this.internService.createDomainTask(this.taskForm.value as any)
      .subscribe({
        next: (res) => {
          this.toast.success('Success', 'Domain Task created successfully!');
          this.isSubmitting.set(false);
          const nextOrder = (this.taskForm.value.order ?? 1) + 1;
          this.taskForm.reset({ domain: this.taskForm.value.domain, order: nextOrder, title: '', description: '' });
          this.loadTasks();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Error', 'Failed to create task');
          this.isSubmitting.set(false);
        }
      });
  }
}
