import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoginTab = true;

  // Registration form properties
  regName = '';
  regEmail = '';
  regPhone = '';
  regRole = 'job_seeker';
  regPassword = '';

  switchTab(tab: string) {
    this.isLoginTab = tab === 'login';
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('email', response.email);

        // Decode JWT to extract userId
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
            || payload['sub']
            || payload['nameid'];
          if (userId) localStorage.setItem('userId', userId);
        } catch (e) { console.warn('Could not parse JWT', e); }

        // Redirect based on role
        if (response.role.toLowerCase() === 'employer') {
          this.router.navigate(['/employee-dashboard']);
        } else {
          this.router.navigate(['/find-jobs']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error || 'Login failed. Check your credentials.';
        console.error(err);
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';
    
    const payload = {
      fullName: this.regName,
      email: this.regEmail,
      phone: this.regPhone,
      role: this.regRole,
      password: this.regPassword
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please sign in.';
        this.isLoginTab = true;
        // Clear fields
        this.regName = '';
        this.regEmail = '';
        this.regPhone = '';
        this.regPassword = '';
      },
      error: (err) => {
        this.errorMessage = err.error || 'Registration failed. Try again.';
        console.error(err);
      }
    });
  }
}