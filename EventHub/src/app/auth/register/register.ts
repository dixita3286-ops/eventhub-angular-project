import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  name = '';
  email = '';
  password = '';
  role = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    if (!this.name || !this.email || !this.password || !this.role) {
      alert('Please fill all fields');
      return;
    }

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        alert('Registration successful. Please login.');
        this.router.navigate(['/login']);   // landing / login
      },
      error: (err) => {
        alert(err.error?.message || 'Registration failed');
      }
    });
  }

  // 🔥 THIS FIXES YOUR ISSUE
 goToLogin(): void {
  console.log('login click');   // 🔥 test
  this.router.navigate(['/login']);
}

}
