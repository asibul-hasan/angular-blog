import { ChangeDetectionStrategy, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserInfo } from '../../../../../core/services/user-context.service'; // Import UserInfo

@Component({
    selector: 'app-users-management',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersManagementComponent implements OnInit {
    users: UserInfo[] = []; // Use UserInfo
    loading = false;
    errorMessage = '';
    successMessage = '';
    isBrowser = false;

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
        // Skip during SSR
        if (!this.isBrowser) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const token = this.authService.token;
        if (!token) {
            this.errorMessage = 'No authentication token found';
            this.loading = false;
            return;
        }

        this.http
            .get<{ body: UserInfo[]; message: string }>( // Use UserInfo
                `${(environment as any).apiUrl}/auth/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .subscribe({
                next: (response) => {
                    setTimeout(() => {
                        this.users = response.body;
                        this.loading = false;
                    }, 300);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Failed to load users';
                    this.loading = false;
                },
            });
    }

    deleteUser(user: UserInfo): void { // Use UserInfo
        if (!this.isBrowser || !confirm(`Are you sure you want to delete user "${user.userName}"?`)) return;

        const token = this.authService.token;
        if (!token) {
            this.errorMessage = 'No authentication token found';
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
                    setTimeout(() => (this.successMessage = ''), 3000);
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Failed to delete user';
                },
            });
    }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'admin':
                return 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/40 px-2 py-1 rounded-full text-xs';
            case 'editor':
                return 'bg-pink-600/20 text-pink-400 border border-pink-600/40 px-2 py-1 rounded-full text-xs';
            default:
                return 'bg-gray-700 text-gray-300 border border-gray-600 px-2 py-1 rounded-full text-xs';
        }
    }

    getStatusBadgeClass(isActive: boolean): string {
        return isActive
            ? 'bg-green-600/20 text-green-400 border border-green-600/40 px-2 py-1 rounded-full text-xs'
            : 'bg-red-600/20 text-red-400 border border-red-600/40 px-2 py-1 rounded-full text-xs';
    }
}