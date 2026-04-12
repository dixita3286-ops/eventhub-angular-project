import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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

  register(form: NgForm): void {

    if (form.invalid) {
      Swal.fire('Invalid Form', 'Fill all fields properly', 'warning');
      return;
    }

    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailPattern.test(this.email)) {
      Swal.fire('Invalid Email', 'Only Gmail allowed', 'warning');
      return;
    }

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({

      next: () => {

        // 🔥 FLAG FOR NEW USER
        localStorage.setItem('justRegistered', 'true');

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        Swal.fire({
          title: '🎉 Welcome!',
          text: 'Account created successfully!',
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/login']);
        });

      },

      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Registration failed', 'error');
      }

    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}