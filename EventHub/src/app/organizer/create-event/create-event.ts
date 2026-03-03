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
  registrationFee: number | null = null; // ✅ FIXED NAME

  eventImage: File | null = null;

  message = '';

  /* ================= FILE CHANGE ================= */
  onFileChange(event: any) {
    this.eventImage = event.target.files[0];
  }

  /* ================= CREATE EVENT ================= */
  createEvent() {

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 5);

    if (new Date(this.date) < minDate) {
      this.message = 'Event date must be at least 5 days from today.';
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.message = 'You must login first.';
      return;
    }

    const user = JSON.parse(userStr);

    const formData = new FormData();

    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('date', this.date);
    formData.append('venue', this.venue);
    formData.append('registrationFee', String(this.registrationFee));
    formData.append('createdBy', user._id); // 🔥 IMPORTANT

    if (this.eventImage) {
      formData.append('eventImage', this.eventImage);
    }

    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {

        this.message = 'Event request sent to admin for approval.';

        // Reset form
        this.title = '';
        this.description = '';
        this.category = '';
        this.date = '';
        this.venue = '';
        this.registrationFee = null;
        this.eventImage = null;

      })
      .catch(err => {
        console.error(err);
        this.message = 'Error creating event.';
      });

  }

}