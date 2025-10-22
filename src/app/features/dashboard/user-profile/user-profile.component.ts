import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { AuthService, User } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<{ body: User[]; message: string }>(
        `${environment.apiUrl}/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .subscribe({
        next: (response) => {
          // ✅ use browser setTimeout for delay simulation
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

  deleteUser(userId: string, userName: string): void {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    this.http
      .delete(`${environment.apiUrl}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe({
        next: () => {
          this.successMessage = `User "${userName}" deleted successfully`;
          this.loadUsers();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete user';
        },
      });
  }

  // ✅ Tailwind-based badges
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
