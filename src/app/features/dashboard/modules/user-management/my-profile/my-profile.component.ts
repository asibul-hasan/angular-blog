import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../../../../shared/services/auth/auth.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
    currentUser: User | null = null;
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    isBrowser = false;
    activeTab: 'profile' | 'password' = 'profile';

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private toast: ToastService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
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

        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
            if (user) {
                this.profileForm.patchValue({
                    name: user.name,
                    email: user.email,
                });
            }
        });
    }

    updateProfile(): void {
        if (this.profileForm.invalid) {
            this.toast.warn('Please fill all required fields');
            return;
        }

        this.loading = true;
        this.authService.updateProfile(this.profileForm.value).subscribe({
            next: () => {
                this.toast.success('Success', 'Profile updated successfully');
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
        if (!this.currentUser?.name) return 'U';
        const names = this.currentUser.name.split(' ');
        if (names.length > 1) {
            return names[0][0] + names[names.length - 1][0];
        }
        return names[0][0];
    }
}