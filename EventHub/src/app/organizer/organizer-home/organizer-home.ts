import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-home.html',
  styleUrls: ['./organizer-home.css']
})
export class OrganizerHome {

  constructor(private router: Router) {}

  categories = [
    {
      name: 'Workshop',
      image: '/workshop.jpg'
    },
    {
      name: 'Seminar',
      image: '/seminar.jpg'
    },
    {
      name: 'Cultural',
      image: '/cultural.jpg'
    },
    {
      name: 'Sports',
      image: '/sports.jpg'
    },
    {
      name: 'Social',
      image: '/social.jpg'
    },
    {
      name: 'Exhibition',
      image: '/exhibition.jpg'
    }
  ];

  goToCategory(category: string) {
    this.router.navigate(
      ['/organizer/category-event'],
      { queryParams: { category } }
    );
  }
}
