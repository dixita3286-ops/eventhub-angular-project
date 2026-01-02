import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-organizer-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organizer-home.html',
  styleUrls: ['./organizer-home.css']
})
export class OrganizerHome {

  organizerName = 'Organizer';

  categories = [
    { name: 'Workshop', image: 'assets/images/workshop.jpg' },
    { name: 'Seminar', image: 'assets/images/seminar.jpg' },
    { name: 'Cultural', image: 'assets/images/cultural.jpg' },
    { name: 'Sports', image: 'assets/images/sports.jpg' },
    { name: 'Social', image: 'assets/images/social.jpg' },
    { name: 'Exhibition', image: 'assets/images/exhibition.jpg' }
  ];

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
