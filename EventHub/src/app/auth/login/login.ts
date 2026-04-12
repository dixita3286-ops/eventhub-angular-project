import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {

    if (!this.email || !this.password) {
      Swal.fire('Oops!', 'Enter email & password', 'warning');
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (user: any) => {

        localStorage.setItem('user', JSON.stringify(user));

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // 🔥 CHECK FLAG
        const justRegistered = localStorage.getItem('justRegistered');

        if (!justRegistered) {
          Swal.fire({
            title: 'Welcome Back 👋',
            text: 'Login successful!',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          });
        } else {
          // 🔥 REMOVE FLAG
          localStorage.removeItem('justRegistered');
        }

        setTimeout(() => {

          if (user.role === 'student') {
            this.router.navigateByUrl('/student');
          }
          else if (user.role === 'admin') {
            this.router.navigateByUrl('/admin');
          }
          else if (user.role === 'organizer') {
            this.router.navigateByUrl('/organizer');
          }
          else {
            Swal.fire('Error', 'Invalid role', 'error');
            localStorage.removeItem('user');
          }

        }, 1500);

        this.loading = false;
      },

      error: () => {
        this.loading = false;

        Swal.fire('Login Failed', 'Invalid credentials', 'error');
      }

    });
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

}