import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent implements OnInit {

  title = '';
  description = '';
  category = '';
  date = '';
  venue = '';
  registrationFee: number | null = null;

  eventImage: File | null = null;
  eventFile: File | null = null;

  imagePreview: string | null = null;

  message = '';
  minDate = '';

  ngOnInit() {

    const today = new Date();
    today.setDate(today.getDate() + 5);

    this.minDate = today.toISOString().split('T')[0];

  }

  /* IMAGE CHANGE */

  onFileChange(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    this.eventImage = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(file);

  }

  /* PDF CHANGE */

  onPdfChange(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.message = 'Only PDF files allowed.';
      return;
    }

    this.eventFile = file;

  }

  /* CREATE EVENT */

  createEvent() {

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 5);

    if (new Date(this.date) < minDate) {
      this.message = 'Event date must be at least 5 days from today.';
      return;
    }

    if (!this.eventImage) {
      this.message = 'Please upload event image.';
      return;
    }

    if (!this.eventFile) {
      this.message = 'Please upload event PDF.';
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
    formData.append('registrationFee', this.registrationFee!.toString());
    formData.append('createdBy', user._id);

    formData.append('eventImage', this.eventImage);
    formData.append('eventFile', this.eventFile);

    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {

      this.message = 'Event created successfully. Waiting for admin approval.';

      this.title = '';
      this.description = '';
      this.category = '';
      this.date = '';
      this.venue = '';
      this.registrationFee = null;

      this.eventImage = null;
      this.eventFile = null;
      this.imagePreview = null;

    })
    .catch(err => {

      console.error(err);
      this.message = 'Error creating event.';

    });

  }

}