import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type EventStatus = 'all' | 'approved' | 'pending' | 'rejected';

@Component({
  selector: 'app-my-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-event.html',
  styleUrl: './my-event.css',
})
export class MyEvent {

  constructor(private router: Router) {}

  // dropdown tab
  activeTab: 'my' | 'all' = 'my';

  // status filter
  status: EventStatus = 'all';

  // ✅ STRICT typed list (ERROR fix)
  statusList: EventStatus[] = [
    'all',
    'approved',
    'pending',
    'rejected'
  ];

  // sample events (later API thi aavse)
  events = [
    {
      id: 1,
      title: 'Angular Workshop',
      date: '2026-01-10',
      venue: 'Auditorium',
      status: 'approved' as EventStatus
    },
    {
      id: 2,
      title: 'Tech Seminar',
      date: '2026-01-15',
      venue: 'Hall A',
      status: 'pending' as EventStatus
    },
    {
      id: 3,
      title: 'Cultural Fest',
      date: '2026-02-01',
      venue: 'Open Ground',
      status: 'rejected' as EventStatus
    }
  ];

  filteredEvents = [...this.events];

  applyFilters() {
    this.filteredEvents = this.events.filter(e => {
      if (this.status === 'all') return true;
      return e.status === this.status;
    });
  }

  goCreate() {
    this.router.navigate(['/organizer/create-event']);
  }

  editEvent(id: number) {
    this.router.navigate(['/organizer/modify-events-org'], {
      queryParams: { id }
    });
  }
}
