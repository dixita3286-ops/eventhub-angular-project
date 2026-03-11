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

  // REGISTERED EVENTS
  registeredEventIds: string[] = [];

  private routeSub!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {

    this.reloadAll();

    // navbar navigation refresh fix
    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.reloadAll();
      });

  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  /* ================= RELOAD ================= */

  reloadAll() {
    this.loadEvents();
    this.loadMyRegistrations();
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

  /* ================= LOAD MY REGISTRATIONS ================= */

  loadMyRegistrations() {

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.registeredEventIds = [];
      return;
    }

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/student/${user._id}`)
      .then(res => res.json())
      .then(data => {

        this.registeredEventIds = data.map(
          (r: any) => r.eventId?._id
        );

        this.cdr.detectChanges();

      });

  }

  /* ================= CHECK REGISTERED ================= */

  isRegistered(eventId: string): boolean {
    return this.registeredEventIds.includes(eventId);
  }

  /* ================= REGISTER EVENT ================= */

  registerEvent(eventId: string) {

    if (this.isRegistered(eventId)) return;

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

    // find event data
    const event = this.events.find(e => e._id === eventId);

    if (!event) return;

    const user = JSON.parse(userStr);

    /* ================= FREE EVENT ================= */

    if (event.registrationFee === 0) {

      Swal.fire({
        icon: 'info',
        title: 'Free Event',
        text: 'This event is free. Register now?',
        showCancelButton: true,
        confirmButtonText: 'Register'
      }).then(res => {

        if (!res.isConfirmed) return;

        fetch(`http://localhost:5000/api/registrations`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            eventId:eventId,
            userId:user._id,
            amount:0,
            method:'free'
          })
        })
        .then(res=>res.json())
        .then(()=>{

          Swal.fire(
            'Registered!',
            'You are registered for this free event.',
            'success'
          );

          this.reloadAll();

        })
        .catch(err=>console.error(err));

      });

      return;

    }

    /* ================= PAID EVENT ================= */

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