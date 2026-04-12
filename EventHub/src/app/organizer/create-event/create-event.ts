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

  /* IMAGE */
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

  /* PDF */
  onPdfChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      Swal.fire('Invalid File', 'Only PDF allowed', 'warning');
      event.target.value = '';
      return;
    }

    this.eventFile = file;
  }

  /* CREATE EVENT */
  createEvent(eventForm: NgForm) {

    // Form validation
    if (eventForm.invalid) {
      Swal.fire('Invalid Form', 'Please fill all required fields', 'warning');
      return;
    }

    // Fee validation
    if (this.registrationFee === null || this.registrationFee < 0) {
      Swal.fire('Invalid Fee', 'Fee cannot be negative', 'warning');
      return;
    }

    // Date validation
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 5);

    if (new Date(this.date) < minDate) {
      Swal.fire('Invalid Date', 'Select date after 5 days', 'warning');
      return;
    }

    // File validation
    if (!this.eventImage) return;
    if (!this.eventFile) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

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
    .then(() => {

      Swal.fire('Success', 'Event Created Successfully', 'success');

      eventForm.resetForm();

      this.imagePreview = null;
      this.eventImage = null;
      this.eventFile = null;

      this.imageInput.nativeElement.value = '';
      this.pdfInput.nativeElement.value = '';

    })
    .catch(() => {
      Swal.fire('Error', 'Something went wrong', 'error');
    });
  }
}