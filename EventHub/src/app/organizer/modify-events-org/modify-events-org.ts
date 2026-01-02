import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-events-org',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-events-org.html',
  styleUrl: './modify-events-org.css',
})
export class ModifyEventsOrg implements OnInit {

  eventId!: number;

  title = '';
  description = '';
  category = '';
  date = '';
  venue = '';

  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    // 🔹 DEMO DATA (PHP DB ni jagyae)
    const event = {
      title: 'Angular Workshop',
      description: 'Angular hands-on workshop',
      category: 'Workshop',
      date: '2026-01-10',
      venue: 'Auditorium'
    };

    // Prefill form
    this.title = event.title;
    this.description = event.description;
    this.category = event.category;
    this.date = event.date;
    this.venue = event.venue;
  }

  updateEvent() {
    // 🔥 Normally API call (PUT /events/:id)
    console.log({
      id: this.eventId,
      title: this.title,
      description: this.description,
      category: this.category,
      date: this.date,
      venue: this.venue,
      status: 'pending'
    });

    this.message = 'Event updated successfully! Waiting for admin approval.';

    // redirect after update
    setTimeout(() => {
      this.router.navigate(['/organizer/my-event']);
    }, 1200);
  }
}
