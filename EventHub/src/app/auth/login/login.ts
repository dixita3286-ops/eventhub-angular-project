import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
      alert('Please enter email and password');
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

        // 🔥 ROLE BASED REDIRECT (FIXED)
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
          alert('Invalid user role');
          localStorage.removeItem('user');
        }

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        alert('Invalid email or password');
      }
    });
  }

  // ================= GO TO REGISTER =================
  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }
}
