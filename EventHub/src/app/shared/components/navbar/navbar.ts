import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // 🔥🔥🔥 FINAL FIX 🔥🔥🔥
  goTo(path: string) {
    this.showMenu = false;
    this.showProfileMenu = false;

    this.router.navigate([path], {
      queryParams: { reload: Date.now() } // ⭐ FORCE ROUTE RELOAD
    }).then(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;

    this.router.navigate(['/login'], {
      queryParams: { reload: Date.now() }
    });
  }
}
