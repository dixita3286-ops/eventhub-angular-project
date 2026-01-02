import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule],              // *ngIf, *ngFor, pipes mate
  templateUrl: './organizer-dashboard.html',
  styleUrls: ['./organizer-dashboard.css']
})
export class OrganizerDashboard {

  events: any[] = [];

  totalEvents = 0;
  pendingEvents = 0;
  approvedEvents = 0;
  rejectedEvents = 0;
  totalRegistrations = 0;

  constructor(private eventService: EventService) {
    this.loadData();
  }

  loadData() {
    this.events = this.eventService.getEvents();
    this.calculateStats();
  }

  calculateStats() {
    this.totalEvents = this.events.length;

    this.pendingEvents =
      this.events.filter(e => e.status === 'pending').length;

    this.approvedEvents =
      this.events.filter(e => e.status === 'approved').length;

    this.rejectedEvents =
      this.events.filter(e => e.status === 'rejected').length;

    this.totalRegistrations = this.events.reduce(
      (sum, e) => sum + (e.registeredCount || 0),
      0
    );
  }
}
