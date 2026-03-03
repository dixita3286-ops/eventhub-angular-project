import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class Events implements OnInit {

  events: any[] = [];

  search = '';
  category = '';
  sort = 'desc';
  typingTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadEvents();
  }

  /* ================= LOAD EVENTS ================= */
  loadEvents() {
    const q = encodeURIComponent(this.search.trim());

    fetch(
      `http://localhost:5000/api/events?search=${q}&category=${this.category}&sort=${this.sort}`
    )
      .then(res => res.json())
      .then(data => {
        this.events = data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error(err));
  }

  /* ================= SEARCH ================= */
  onSearchChange(value: string) {
    clearTimeout(this.typingTimer);
    this.search = value;

    this.typingTimer = setTimeout(() => {
      this.loadEvents();
    }, 300);
  }

  /* ================= REGISTER ================= */
  registerEvent(eventId: string) {

    const userStr = localStorage.getItem('user');

    // 🔴 NOT LOGGED IN
    if (!userStr) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to register for this event',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then(res => {
        if (res.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // 🟢 LOGGED IN → GO TO PAYMENT
    Swal.fire({
      title: 'Proceed to Payment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(res => {
      if (res.isConfirmed) {
        this.router.navigate(
          ['/student/payment', eventId],
          { queryParams: { method: 'upi' } }
        );
      }
    });
  }
}