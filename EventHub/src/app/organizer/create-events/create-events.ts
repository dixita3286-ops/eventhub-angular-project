import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-events.html',
  styleUrls: ['./create-events.css']
})
export class CreateEvents {

  title = '';
  date = '';
  time = '';
  price: number | null = null;
  description = '';
  venue = '';
  city = '';
  imagePreview: string | null = null;

  constructor(private eventService: EventService) {}

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  createEvent() {
    const eventData = {
      id: Date.now(),
      title: this.title,
      date: this.date,
      time: this.time,
      price: this.price,
      description: this.description,
      venue: this.venue,
      city: this.city,
      image: this.imagePreview,
      status: 'pending',
      registeredCount: 0
    };

    this.eventService.createEvent(eventData);

    alert('🎉 Event created! Sent for admin approval.');

    // reset
    this.title = '';
    this.date = '';
    this.time = '';
    this.price = null;
    this.description = '';
    this.venue = '';
    this.city = '';
    this.imagePreview = null;
  }
}
