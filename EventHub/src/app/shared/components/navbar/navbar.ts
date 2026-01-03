import { Component, inject, OnInit } from '@angular/core';
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
export class Navbar implements OnInit {

  private router = inject(Router);

  user: any = null;
  showMenu = false;

  ngOnInit(): void {
    // 🔥 first load
    this.loadUser();

    // 🔥 update navbar on every route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.closeMenu();
      });
  }

  // ✅ SESSION STORAGE ONLY
  loadUser() {
    const u = sessionStorage.getItem('user');
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
    // 🔥 proper logout
    sessionStorage.clear();
    this.user = null;
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
