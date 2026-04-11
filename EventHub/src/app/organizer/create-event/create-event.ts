import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

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

  minDate = '';

  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('pdfInput') pdfInput!: ElementRef;

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
      Swal.fire({
        icon: 'warning',
        title: 'Invalid File',
        text: 'Only PDF files allowed.'
      });

      event.target.value = '';
      return;
    }

    this.eventFile = file;
  }

  /* CREATE EVENT */
  createEvent(eventForm: NgForm) {

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 5);

    if (new Date(this.date) < minDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Event date must be at least 5 days from today.'
      });
      return;
    }

    if (!this.eventImage) {
      Swal.fire({
        icon: 'warning',
        title: 'Image Required',
        text: 'Please upload event image.'
      });
      return;
    }

    if (!this.eventFile) {
      Swal.fire({
        icon: 'warning',
        title: 'PDF Required',
        text: 'Please upload event PDF.'
      });
      return;
    }

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'You must login first.'
      });
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

      Swal.fire({
        icon: 'success',
        title: 'Event Created',
        text: 'Event created successfully. Waiting for admin approval.',
        confirmButtonColor: '#3085d6'
      });

      /* ✅ RESET FORM */
      eventForm.resetForm();

      this.imagePreview = null;
      this.eventImage = null;
      this.eventFile = null;

      /* ✅ CLEAR FILE INPUTS */
      this.imageInput.nativeElement.value = '';
      this.pdfInput.nativeElement.value = '';

    })
    .catch(err => {

      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error creating event.'
      });

    });

  }

}