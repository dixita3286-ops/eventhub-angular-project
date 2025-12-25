import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  user: any = null;
  showMenu = false;
  showProfileMenu = false;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/login']);
  }

  goTo(path: string) {
    this.showMenu = false;
    this.router.navigate([path]);
  }
}
