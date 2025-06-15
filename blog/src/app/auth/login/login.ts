import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';

  private auth = inject(Auth);
  private router = inject(Router);

  async login() {
    try {
      const result = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('✅ Logged in user:', result.user.email);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('❌ Login failed:', error);
    }
  }
}
