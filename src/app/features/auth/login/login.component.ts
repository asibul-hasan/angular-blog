// src/app/auth/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl = '';
  showPassword = false;
  userType: 'admin' | 'intern' = 'admin'; // Default to admin

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize form in constructor
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    // Get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  initForm(): void {
    if (this.userType === 'intern') {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        domain: ['', [Validators.required]], // Domain field for interns
        rememberMe: [false],
      });
    } else {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false],
      });
    }
  }

  toggleUserType(): void {
    this.userType = this.userType === 'admin' ? 'intern' : 'admin';
    this.initForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    // Call the actual login API
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        // Navigate based on user role from auth service
        if (this.authService.isAdmin) {
          this.router.navigate(['/dashboard']);
        } else {
          // For interns or other roles, navigate to appropriate page
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error details:', error);
        this.loading = false;
        // The authService throws an Error object containing the formatted message
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    });
  }
}