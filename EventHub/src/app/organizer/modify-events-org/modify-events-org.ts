import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-events-org',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-events-org.html',
  styleUrl: './modify-events-org.css'
})
export class ModifyEventsOrg implements OnInit {

  eventId!: number;

  event = {
    title: '',
    description: '',
    category: '',
    date: '',
    venue: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    // 🔹 Dummy data (later API thi aavse)
    if (this.eventId === 3) {
      this.event = {
        title: 'Cultural Fest',
        description: 'Annual cultural celebration',
        category: 'Cultural',
        date: '2026-02-01',
        venue: 'Open Ground'
      };
    }
  }

  updateEvent() {
    alert('Event Updated Successfully!');
    this.router.navigate(['/organizer/my-event']);
  }
}
