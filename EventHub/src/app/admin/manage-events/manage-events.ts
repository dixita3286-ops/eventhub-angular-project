import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-events.html',
  styleUrls: ['./manage-events.css']
})
export class ManageEvents implements OnInit {

  events: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  /* ================= LOAD EVENTS ================= */
  loadEvents() {
    fetch('http://localhost:5000/api/events/admin/approved')
      .then(res => res.json())
      .then(data => {
        this.events = data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error(err));
  }

  /* ================= IMAGE FIX ADD ================= */

  getImageUrl(image: string) {

    if (!image) {
      return 'assets/default.jpg';
    }

    // old images from public folder
    if (image.includes('/public')) {
      return 'http://localhost:5000' + image;
    }

    // uploaded images
    return 'http://localhost:5000/uploads/images/' + image;
  }

  /* ================= VIEW DETAILS ================= */
  viewDetails(id: string) {
    this.router.navigate(['/admin/event-details', id]);
  }

  /* ================= VIEW REGISTRATIONS ================= */
  viewRegistrations(eventId: string) {
    this.router.navigate(['/admin/admin-registered-student', eventId]);
  }

  /* ================= MODIFY ================= */
  modifyEvent(id: string) {
    this.router.navigate(['/admin/admin-modify-events', id]);
  }

  /* ================= DELETE ================= */
  deleteEvent(id: string) {

    Swal.fire({
      title: 'Delete Event?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then(res => {

      if (res.isConfirmed) {

        fetch(`http://localhost:5000/api/events/${id}`, {
          method: 'DELETE'
        })
        .then(() => {

          this.events = this.events.filter(e => e._id !== id);
          this.cdr.detectChanges();

          Swal.fire('Deleted!', 'Event has been removed.', 'success');

        })
        .catch(() => {
          Swal.fire('Error', 'Failed to delete event', 'error');
        });

      }

    });
  }

}