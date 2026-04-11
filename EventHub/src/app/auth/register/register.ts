import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

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
      Swal.fire({
        title: 'Oops!',
        text: 'Please fill all fields',
        icon: 'warning',
        confirmButtonColor: '#ff9800'
      });
      return;
    }

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({

      // ✅ SUCCESS
      next: () => {

        // 🎆 CONFETTI FIREWORK
        const duration = 2000;
        const end = Date.now() + duration;

        const fire = () => {
          confetti({
            particleCount: 6,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });

          confetti({
            particleCount: 6,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });

          if (Date.now() < end) {
            requestAnimationFrame(fire);
          }
        };

        fire();

        // 🔥 SWEET ALERT
        Swal.fire({
          title: '🎉 Welcome!',
          html: '<b>Your account has been created successfully!</b><br>Click below to login 🚀',
          icon: 'success',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#ff9800',
          background: '#1c1c1c',
          color: '#fff'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });

      },

      // ❌ ERROR
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.error?.message || 'Registration failed',
          icon: 'error',
          confirmButtonColor: '#ff9800'
        });
      }

    });
  }

  // 🔥 LOGIN BUTTON (if used anywhere)
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}