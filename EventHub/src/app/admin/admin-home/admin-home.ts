import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminHome {

  categories = [
    { name: 'Workshop', image: 'http://localhost:5000/public/career_guidance.png' },
    { name: 'Seminar', image: 'http://localhost:5000/public/ai_seminar.png' },
    { name: 'Cultural', image: 'http://localhost:5000/public/cultural_fest.png' },
    { name: 'Sports', image: 'http://localhost:5000/public/badminton_championship.png' },
    { name: 'Social', image: 'http://localhost:5000/public/blood_donation.png' },
    { name: 'Exhibition', image: 'http://localhost:5000/public/exhibition.jpg' }
  ];

  constructor(private router: Router) {}

  goToCategory(category: string) {
    this.router.navigateByUrl(
      `/admin/admin-category-events?category=${category}`
    );
  }
}
