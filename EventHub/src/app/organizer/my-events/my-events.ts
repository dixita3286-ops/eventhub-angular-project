import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule],          // *ngIf, *ngFor mate
  templateUrl: './my-events.html',
  styleUrls: ['./my-events.css']    // ❌ styleUrl → ✅ styleUrls
})
export class MyEvents {

  events: any[] = [];

  constructor(private eventService: EventService) {
    // load all events created by organizer
    this.events = this.eventService.getEvents();
  }

}
