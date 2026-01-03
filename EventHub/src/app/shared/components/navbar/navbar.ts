import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
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

  constructor() {
    this.loadUser();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.closeMenu();
      });
  }

  loadUser() {
    const u = localStorage.getItem('user');
    this.user = u ? JSON.parse(u) : null;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  goTo(path: string) {
    this.closeMenu();
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
