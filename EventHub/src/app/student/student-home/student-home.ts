import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {

  showMenu = false;

  categories = [
    { name: 'Workshop', image: '/career_guidance.png' },
    { name: 'Seminar', image: '/ai_seminar.png' },
    { name: 'Cultural', image: '/cultural_fest.png' },
    { name: 'Sports', image: '/badminton_championship.png' },
    { name: 'Social', image: '/blood_donation.png' },
    { name: 'Exhibition', image: '/exhibition.jpg' }
  ];

  constructor(private router: Router) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  goToCategory(category: string) {
    this.router.navigate(['/student/category-events'], {
      queryParams: { category }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
