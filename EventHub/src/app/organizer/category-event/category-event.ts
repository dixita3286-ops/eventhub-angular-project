import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-event.html',
  styleUrl: './category-event.css',
})
export class CategoryEvent implements OnInit {

  // filters
  category: string = '';
  search: string = '';
  date: string = '';

  // event lists
  events: any[] = [];
  filteredEvents: any[] = [];

  // extra info
  totalApprovedEvents = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 🔹 sample data (PHP DB ni jagyae)
    this.events = [
      {
        id: 1,
        title: 'Angular Workshop',
        category: 'Workshop',
        date: '2026-01-10',
        venue: 'Auditorium',
        description: 'Angular hands-on workshop',
        status: 'approved',
        image: 'assets/default-event.jpg'
      },
      {
        id: 2,
        title: 'Tech Seminar',
        category: 'Seminar',
        date: '2026-01-15',
        venue: 'Hall A',
        description: 'Latest tech trends',
        status: 'approved',
        image: 'assets/default-event.jpg'
      }
    ];

    // only approved events count
    this.totalApprovedEvents =
      this.events.filter(e => e.status === 'approved').length;

    // 🔹 URL thi category (?category=Workshop)
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.applyFilters();
    });

    // initial load
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {

      const matchCategory =
        !this.category || event.category === this.category;

      const matchSearch =
        !this.search ||
        event.title.toLowerCase().includes(this.search.toLowerCase()) ||
        event.venue.toLowerCase().includes(this.search.toLowerCase()) ||
        event.description.toLowerCase().includes(this.search.toLowerCase());

      const matchDate =
        !this.date || event.date === this.date;

      return (
        event.status === 'approved' &&
        matchCategory &&
        matchSearch &&
        matchDate
      );
    });
  }

  // 🔹 clear all filters
  clearFilters(): void {
    this.search = '';
    this.date = '';
    this.applyFilters();
  }

  // 🔹 navigate to event details page
  viewDetails(eventId: number): void {
    this.router.navigate(['/event-details', eventId]);
  }
}
