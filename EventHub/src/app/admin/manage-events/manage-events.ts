import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-events.html',
  styleUrls: ['./manage-events.css']
})
export class ManageEvents implements OnInit {

  events: any[] = [];

  search = '';
  category = '';
  sort = 'desc';

  typingTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  /* ================= LOAD EVENTS (ADMIN) ================= */
  loadEvents() {
    const q = encodeURIComponent(this.search.trim());

    fetch(
      `http://localhost:5000/api/events/admin?search=${q}&category=${this.category}&sort=${this.sort}`
    )
      .then(res => res.json())
      .then(data => {
        this.events = data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error(err));
  }

  onSearchChange(value: string) {
    clearTimeout(this.typingTimer);
    this.search = value;

    this.typingTimer = setTimeout(() => {
      this.loadEvents();
    }, 300);
  }

  /* ================= ADMIN ACTIONS ================= */

  viewDetails(id: string) {
    this.router.navigate(['/admin/event-details', id]);
  }

  viewRegistrations(eventId: string) {
    this.router.navigate(['/admin/admin-registered-student', eventId]);
  }

  modifyEvent(id: string) {
    this.router.navigate(['/admin/admin-modify-events', id]);
  }

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
