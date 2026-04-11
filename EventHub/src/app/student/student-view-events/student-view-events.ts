import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-student-view-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-view-events.html',
  styleUrls: ['./student-view-events.css']
})
export class StudentViewEvents implements OnInit, OnDestroy {

  events: any[] = [];

  search = '';
  category = '';
  sort = 'desc';

  showMenu = false;
  typingTimer: any;

  registeredEvents: any[] = [];

  private routeSub!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reloadAll();

    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.reloadAll();
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  reloadAll() {
    this.loadEvents();
    this.loadMyRegistrations();
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

  /* ================= LOAD REGISTRATIONS ================= */

  loadMyRegistrations() {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.registeredEvents = [];
      return;
    }

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/student/${user._id}`)
      .then(res => res.json())
      .then(data => {
        this.registeredEvents = data;
        this.cdr.detectChanges();
      });
  }

  /* ================= GET REGISTRATION ================= */

  getRegistration(eventId: string) {
    return this.registeredEvents.find(
      (r: any) => r.eventId?._id === eventId
    );
  }

  /* ================= REGISTER ================= */

  registerEvent(eventId: string) {

    const existing = this.getRegistration(eventId);

    // ❌ prevent if pending/approved
    if (existing && existing.status !== 'rejected') return;

    const userStr = localStorage.getItem('user');

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

    const event = this.events.find(e => e._id === eventId);
    if (!event) return;

    const user = JSON.parse(userStr);

    /* ================= FREE ================= */

    if (event.registrationFee === 0) {

      Swal.fire({
        icon: 'info',
        title: 'Free Event',
        text: 'Register now?',
        showCancelButton: true,
        confirmButtonText: 'Register'
      }).then(res => {

        if (!res.isConfirmed) return;

        fetch(`http://localhost:5000/api/registrations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            userId: user._id,
            amount: 0,
            method: 'free'
          })
        })
        .then(() => {
          Swal.fire('Done!', 'Registered successfully', 'success');

          this.reloadAll();
          setTimeout(() => this.cdr.detectChanges(), 100);
        });

      });

      return;
    }

    /* ================= PAID (ONLY UPI NOW) ================= */

    Swal.fire({
      icon: 'question',
      title: 'UPI Payment',
      text: 'Proceed with UPI payment?',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#3085d6'
    }).then(res => {

      if (res.isConfirmed) {
        this.router.navigate(['/student/payment', eventId], {
          queryParams: { method: 'upi' }
        });
      }

    });

  }

}