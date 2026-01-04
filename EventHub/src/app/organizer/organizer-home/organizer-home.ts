import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-organizer-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './organizer-home.html',
  styleUrls: ['./organizer-home.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizerHome {

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
      `/organizer/category-event?category=${category}`
    );
  }
}
