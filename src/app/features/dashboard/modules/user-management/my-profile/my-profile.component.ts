import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { UserContextService, UserInfo } from '../../../../../core/services/user-context.service';

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
    currentUser: UserInfo | null = null;
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    isBrowser = false;
    activeTab: 'profile' | 'password' = 'profile';

    private authService = inject(AuthService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);
    private platformId = inject(PLATFORM_ID);
    public userContextService = inject(UserContextService); // Inject UserContextService

    constructor() {
        this.isBrowser = isPlatformBrowser(this.platformId);

        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        if (!this.isBrowser) return;

        // Initialize currentUser from UserContextService
        this.currentUser = this.userContextService.user();
        if (this.currentUser) {
            this.profileForm.patchValue({
                name: this.currentUser.userName,
                email: this.currentUser.email,
            });
        }
    }

    updateProfile(): void {
        if (this.profileForm.invalid) {
            this.toast.warn('Please fill all required fields');
            return;
        }

        this.loading = true;
        this.authService.updateProfile(this.profileForm.value).subscribe({
            next: (response) => {
                this.toast.success('Success', 'Profile updated successfully');
                // Update the user context after successful profile update
                this.userContextService.setCurrentUser(response.body);
                this.loading = false;
            },
            error: (err) => {
                this.toast.error('Error', err.error?.message || 'Failed to update profile');
                this.loading = false;
            },
        });
    }

    changePassword(): void {
        if (this.passwordForm.invalid) {
            this.toast.warn('Please fill all required fields');
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

        if (newPassword !== confirmPassword) {
            this.toast.error('Error', 'Passwords do not match');
            return;
        }

        this.loading = true;
        this.authService.changePassword(currentPassword, newPassword).subscribe({
            next: () => {
                this.toast.success('Success', 'Password changed successfully');
                this.passwordForm.reset();
                this.loading = false;
            },
            error: (err) => {
                this.toast.error('Error', err.error?.message || 'Failed to change password');
                this.loading = false;
            },
        });
    }

    get userInitials(): string {
        const user = this.userContextService.user();
        if (!user || !user.userName) return 'U';
        const names = user.userName.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return names[0][0];
    }
}
