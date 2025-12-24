import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Clear any previous login
    localStorage.removeItem('user');
  }

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/' + user.role]);
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
