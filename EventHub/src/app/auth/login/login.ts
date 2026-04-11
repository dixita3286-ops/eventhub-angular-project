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

  // ================= TOGGLE PASSWORD =================
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ================= LOGIN =================
  login(): void {

    if (!this.email || !this.password) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please enter email and password',
        icon: 'warning',
        confirmButtonColor: '#ff9800'
      });
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (user: any) => {

        console.log('LOGIN SUCCESS:', user);

        // 🔥 SAVE USER
        localStorage.setItem('user', JSON.stringify(user));

        // 🎆 SMALL CONFETTI (OPTIONAL BUT COOL 😏)
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // 🔥 SUCCESS ALERT
        Swal.fire({
          title: 'Welcome Back 👋',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonColor: '#ff9800',
          background: '#1c1c1c',
          color: '#fff',
          timer: 1800,
          showConfirmButton: false
        });

        // 🔥 ROLE BASED REDIRECT (AFTER SHORT DELAY)
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
            Swal.fire('Error', 'Invalid user role', 'error');
            localStorage.removeItem('user');
          }

        }, 1800);

        this.loading = false;
      },

      error: () => {
        this.loading = false;

        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid email or password',
          icon: 'error',
          confirmButtonColor: '#ff9800'
        });
      }

    });
  }

  // ================= GO TO REGISTER =================
  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

}