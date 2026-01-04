import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);

  user: any = null;
  showMenu = false;

  ngOnInit(): void {
    // ✅ Load user initially
    this.loadUser();

    // ✅ Update navbar on every route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.closeMenu();
      });
  }

  // ✅ FIX: use AuthService + localStorage
  loadUser() {
    this.user = this.authService.getUser();
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
    this.authService.logout();
    this.user = null;
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
