import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {

  eventId!: number;

  // demo data (PHP DB ni jagyae)
  event: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    // 🔹 Normally API call aavse (GET /events/:id)
    this.event = {
      id: this.eventId,
      title: 'Angular Workshop',
      description: 'Angular hands-on workshop with real projects.',
      category: 'Workshop',
      date: '2026-01-10',
      venue: 'Auditorium',
      registrationFees: 500,
      image: 'assets/default-event.jpg',
      file: 'sample-event.pdf'
    };
  }

  downloadFile() {
    // 🔥 demo download (backend ma API hase)
    const link = document.createElement('a');
    link.href = 'assets/sample-event.pdf';
    link.download = 'event-file.pdf';
    link.click();
  }
}
