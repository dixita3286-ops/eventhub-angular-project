import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent {

  title = '';
  description = '';
  category = '';
  date = '';
  venue = '';
  registrationFees: number | null = null;

  eventFile: File | null = null;
  eventImage: File | null = null;

  message = '';

  onFileChange(event: any, type: 'file' | 'image') {
    if (type === 'file') {
      this.eventFile = event.target.files[0];
    } else {
      this.eventImage = event.target.files[0];
    }
  }

  createEvent() {
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 5);

    if (new Date(this.date) < minDate) {
      this.message = 'Event date must be at least 5 days from today.';
      return;
    }

    // 🔥 Normally API call jase (POST)
    console.log({
      title: this.title,
      description: this.description,
      category: this.category,
      date: this.date,
      venue: this.venue,
      registrationFees: this.registrationFees,
      eventFile: this.eventFile,
      eventImage: this.eventImage,
      status: 'pending'
    });

    this.message = 'Event created successfully! Waiting for admin approval.';

    // reset form
    this.title = '';
    this.description = '';
    this.category = '';
    this.date = '';
    this.venue = '';
    this.registrationFees = null;
    this.eventFile = null;
    this.eventImage = null;
  }
}
