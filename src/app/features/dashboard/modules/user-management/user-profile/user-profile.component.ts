import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserInfo } from '../../../../../core/services/user-context.service';

@Component({
    selector: 'app-users-management',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersManagementComponent implements OnInit {
    users: UserInfo[] = [];
    loading = false;
    errorMessage = '';
    successMessage = '';
    isBrowser = false;

    private cdr = inject(ChangeDetectorRef);

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        if (!this.isBrowser) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.cdr.markForCheck();

        const token = this.authService.token;
        if (!token) {
            this.errorMessage = 'No authentication token found';
            this.loading = false;
            this.cdr.markForCheck();
            return;
        }

        this.http
            .get<{ body: UserInfo[]; message: string }>(
                `${(environment as any).apiUrl}/auth/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .subscribe({
                next: (response) => {
                    this.users = response.body || [];
                    this.loading = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Failed to load users';
                    this.loading = false;
                    this.cdr.markForCheck();
                },
            });
    }

    deleteUser(user: UserInfo): void {
        if (!this.isBrowser || !confirm(`Are you sure you want to delete user "${user.userName}"?`)) return;

        const token = this.authService.token;
        if (!token) {
            this.errorMessage = 'No authentication token found';
            this.cdr.markForCheck();
            return;
        }

        this.http
            .delete(`${(environment as any).apiUrl}/auth/users/${user.userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .subscribe({
                next: () => {
                    this.successMessage = `User "${user.userName}" deleted successfully`;
                    this.loadUsers();
                    this.cdr.markForCheck();
                    setTimeout(() => {
                        this.successMessage = '';
                        this.cdr.markForCheck();
                    }, 3000);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Failed to delete user';
                    this.cdr.markForCheck();
                },
            });
    }

    getRoleBadgeClass(role: string): string {
        switch ((role || '').toLowerCase()) {
            case 'admin':
            case 'superadmin':
                return 'bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider';
            case 'editor':
            case 'recruiter':
                return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider';
            default:
                return 'bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider';
        }
    }

    getStatusBadgeClass(isActive: boolean): string {
        return isActive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider';
    }
}