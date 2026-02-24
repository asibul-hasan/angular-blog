import { ChangeDetectionStrategy, Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../../../shared';
import { ToastService } from '../../../../../core/services';
import { InternService, DomainTask } from '../../../../../shared/services';



@Component({
    selector: 'app-domain',
    imports: [CommonModule, ReactiveFormsModule, ...SHARED_IMPORTS],
    templateUrl: './domain.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DomainComponent implements OnInit {
    private fb = inject(FormBuilder);
    private internService = inject(InternService);
    private toast = inject(ToastService);
    private platformId = inject(PLATFORM_ID);

    public isLoading = signal(true);
    public isSubmitting = signal(false);
    public domainTasks = signal<DomainTask[]>([]);

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

    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.taskForm.markAllAsTouched();
            this.toast.warn('Validation', 'Please fill all required fields.');
            return;
        }

        this.isSubmitting.set(true);
        this.internService.createDomainTask(this.taskForm.value as any)
            .subscribe({
                next: (res) => {
                    this.toast.success('Created!', res.message);
                    this.isSubmitting.set(false);
                    const nextOrder = (this.taskForm.value.order ?? 1) + 1;
                    this.taskForm.reset({ domain: this.taskForm.value.domain, order: nextOrder, title: '', description: '' });
                    this.loadTasks();
                },
                error: (err) => {
                    this.toast.error('Error', err.error?.message || 'Failed to create task');
                    this.isSubmitting.set(false);
                }
            });
    }

    deleteTask(id: string): void {
        // Optimistic removal from UI since there is no delete endpoint yet
        this.domainTasks.update(tasks => tasks.filter(t => t._id !== id));
        this.toast.info('Removed', 'Task removed from view (no delete API yet).');
    }
}
