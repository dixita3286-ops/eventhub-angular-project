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

   categories = [
    { name: 'Workshop', image: '/career_guidance.png' },
    { name: 'Seminar', image: '/ai_seminar.png' },
    { name: 'Cultural', image: '/cultural_fest.png' },
    { name: 'Sports', image: '/badminton_championship.png' },
    { name: 'Social', image: '/blood_donation.png' },
    { name: 'Exhibition', image: '/exhibition.jpg' }
  ];

  constructor(private router: Router) {}

  goToCategory(category: string) {
    console.log('CLICKED:', category); // 🔥 test
    this.router.navigate(
      ['/student/student-category-events'],
      { queryParams: { category } }
    );
  }
}
