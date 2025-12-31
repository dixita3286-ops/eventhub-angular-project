import { Component, OnInit } from '@angular/core';
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
export class Login implements OnInit {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;   // ⭐ REQUIRED

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('user');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (user: any) => {        // ⭐ type fixed
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/' + user.role]);
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
