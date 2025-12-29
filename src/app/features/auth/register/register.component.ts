import { Component, OnInit, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    loading = false;
    submitted = false;
    errorMessage = '';
    successMessage = '';
    showPassword = false;
    showConfirmPassword = false;

    private authService = inject(AuthService);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);
    private userContextService = inject(UserContextService); // Inject UserContextService

    ngOnInit(): void {
        // Redirect if already logged in
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/']);
        }

        this.registerForm = this.formBuilder.group(
            {
                name: ['', [Validators.required, Validators.minLength(2)]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required]],
                agreeToTerms: [false, [Validators.requiredTrue]],
            },
            {
                validators: this.passwordMatchValidator,
            }
        );
    }

    passwordMatchValidator(g: FormGroup) {
        const password = g.get('password')?.value;
        const confirmPassword = g.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    get f() {
        return this.registerForm.controls;
    }

    togglePasswordVisibility(field: string): void {
        if (field === 'password') {
            this.showPassword = !this.showPassword;
        } else {
            this.showConfirmPassword = !this.showConfirmPassword;
        }
    }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = '';
        this.successMessage = '';

        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        const { name, email, password } = this.registerForm.value;

        this.authService.register({ name, email, password }).subscribe({
            next: (response) => {
                this.successMessage = 'Registration successful! Redirecting...';
                // Navigate based on user role from UserContextService
                if (this.userContextService.isAdmin()) {
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1500);
                } else {
                    // For regular users, navigate to appropriate page
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1500);
                }
            },
            error: (error) => {
                this.errorMessage =
                    error.error?.message || 'Registration failed. Please try again.';
                this.loading = false;
            },
        });
    }
}