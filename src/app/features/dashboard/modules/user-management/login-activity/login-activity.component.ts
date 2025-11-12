import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginActivityService, LoginActivity } from '../../../../../shared/services/login-activity/login-activity.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { UpperSectionComponent } from '../../../../../shared/components/template/cards/page-upper-section.component';

@Component({
    selector: 'app-login-activity',
    standalone: true,
    imports: [CommonModule, UpperSectionComponent],
    templateUrl: './login-activity.component.html',
    styleUrls: ['./login-activity.component.css']
})
export class LoginActivityComponent implements OnInit {
    private loginActivityService = inject(LoginActivityService);
    private toast = inject(ToastService);

    activities: LoginActivity[] = [];
    activeSessions: LoginActivity[] = [];
    loading = false;
    currentPage = 1;
    totalPages = 1;
    totalActivities = 0;

    ngOnInit(): void {
        this.loadLoginActivities();
        this.loadActiveSessions();
    }

    loadLoginActivities(page: number = 1): void {
        this.loading = true;
        this.loginActivityService.getMyLoginActivities(page, 10).subscribe({
            next: (response) => {
                this.activities = response.body.activities;
                this.currentPage = response.body.currentPage;
                this.totalPages = response.body.totalPages;
                this.totalActivities = response.body.totalActivities;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading login activities:', error);
                this.toast.error('Error', 'Failed to load login activities');
                this.loading = false;
            }
        });
    }

    loadActiveSessions(): void {
        this.loginActivityService.getActiveSessions().subscribe({
            next: (response) => {
                this.activeSessions = response.body;
            },
            error: (error) => {
                console.error('Error loading active sessions:', error);
                this.toast.error('Error', 'Failed to load active sessions');
            }
        });
    }

    terminateSession(sessionId: string): void {
        if (confirm('Are you sure you want to terminate this session?')) {
            this.loginActivityService.terminateSession(sessionId).subscribe({
                next: (response) => {
                    this.toast.success('Success', 'Session terminated successfully');
                    // Reload active sessions
                    this.loadActiveSessions();
                    // Reload login activities
                    this.loadLoginActivities(this.currentPage);
                },
                error: (error) => {
                    console.error('Error terminating session:', error);
                    this.toast.error('Error', 'Failed to terminate session');
                }
            });
        }
    }

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.loadLoginActivities(page);
        }
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }

    getSessionDuration(durationSeconds?: number): string {
        if (!durationSeconds) return 'Active';

        const hours = Math.floor(durationSeconds / 3600);
        const minutes = Math.floor((durationSeconds % 3600) / 60);
        const seconds = durationSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
}