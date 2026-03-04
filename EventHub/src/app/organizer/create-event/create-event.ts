import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent implements OnInit {

  title = '';
  description = '';
  category = '';
  date = '';
  venue = '';
  registrationFee: number | null = null;

  eventImage: File | null = null;
  eventPdf: File | null = null;

  message = '';
  minDate = '';

  imagePreview: string | null = null;

  /* ================= INIT ================= */

  ngOnInit() {

    const today = new Date();

    // minimum date = today + 5 days
    today.setDate(today.getDate() + 5);

    this.minDate = today.toISOString().split('T')[0];

  }

  /* ================= IMAGE CHANGE ================= */

  onFileChange(event: any) {

  if (event.target.files.length > 0) {

    this.eventImage = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(this.eventImage as File);

  }

}
  /* ================= PDF CHANGE ================= */

  onPdfChange(event: any) {

    if (event.target.files.length > 0) {
      this.eventPdf = event.target.files[0];
    }

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

    /* ===== VALIDATION ===== */

    if (!this.title || !this.category || !this.date || !this.venue || this.registrationFee === null) {
      this.message = 'Please fill all required fields.';
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
    formData.append('registrationFee', this.registrationFee.toString());
    formData.append('createdBy', user._id);

    if (this.eventImage) {
      formData.append('eventImage', this.eventImage);
    }

    if (this.eventPdf) {
      formData.append('eventPdf', this.eventPdf);
    }

    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {

      this.message = data.message || 'Event created successfully!';

      /* RESET FORM */

      this.title = '';
      this.description = '';
      this.category = '';
      this.date = '';
      this.venue = '';
      this.registrationFee = null;

      this.eventImage = null;
      this.eventPdf = null;
      this.imagePreview = null;

    })
    .catch(err => {

      console.error(err);
      this.message = 'Error creating event.';

    });

  }

}