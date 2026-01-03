import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-view-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-view-events.html',
  styleUrls: ['./student-view-events.css']
})
export class StudentViewEvents implements OnInit {

  events: any[] = [];

  search = '';
  category = '';
  sort = 'desc';

  showMenu = false;
  typingTimer: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

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

  onSearchChange(value: string) {
    clearTimeout(this.typingTimer);
    this.search = value;

    this.typingTimer = setTimeout(() => {
      this.loadEvents();
    }, 300);
  }

  /* ================= REGISTER EVENT (PAYMENT FLOW) ================= */
  registerEvent(eventId: string) {

    const userStr = localStorage.getItem('user');

    // 🔴 NOT LOGGED IN
    if (!userStr) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to register',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then(res => {
        if (res.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    // 🟢 PAYMENT SELECTION
    Swal.fire({
      title: 'Select Payment Method',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'UPI',
      cancelButtonText: 'Card',
      reverseButtons: true
    }).then(res => {

      if (res.isConfirmed) {
        this.router.navigate(
          ['/student/payment', eventId],
          { queryParams: { method: 'upi' } }
        );
      }

      if (res.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(
          ['/student/payment', eventId],
          { queryParams: { method: 'card' } }
        );
      }

    });
  }

  /* ================= MENU ================= */
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }
}
