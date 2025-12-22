import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],   // ⭐ THIS LINE FIXES ngModel
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
  console.log('Login button clicked');

  this.authService.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: (user) => {
      console.log('Login success:', user);

      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (user.role === 'organizer') {
        this.router.navigate(['/organizer']);
      } else {
        this.router.navigate(['/student']);
      }
    },
    error: (err) => {
      console.error('Login error', err);
      alert('Invalid email or password');
    }
  });
}

}
