import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  private router = inject(Router);

  user: any = null;
  showMenu = false;
  showProfileMenu = false;

  constructor() {
    this.loadUser();

    // 🔥 reload user on every navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.showMenu = false;
        this.showProfileMenu = false;
      });
  }

  loadUser() {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goTo(path: string) {
    this.showMenu = false;
    this.showProfileMenu = false;

    this.router.navigate([path]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;

    this.router.navigate(['/login']);
  }
}
