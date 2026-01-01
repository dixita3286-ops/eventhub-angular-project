import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing implements OnInit {

  events: any[] = [];
  selectedEventId: string | null = null;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLogin();
    this.loadEvents();
  }

  // ================= LOGIN CHECK =================
  checkLogin() {
    this.isLoggedIn = !!localStorage.getItem('user');
  }

  // ================= LOAD EVENTS =================
  loadEvents() {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        this.events = data;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load events',
          confirmButtonColor: '#ff7a18'
        });
      });
  }

  // ================= LOGIN BUTTON =================
  studentLogin() {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login to continue',
      confirmButtonColor: '#ff7a18'
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  // ================= CARD TOGGLE =================
  toggleDetails(eventId: string) {
    this.selectedEventId =
      this.selectedEventId === eventId ? null : eventId;
  }

  // ================= REGISTER EVENT =================
  registerEvent(event: any) {
    const userStr = localStorage.getItem('user');

    // 🔒 not logged in
    if (!userStr) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to register for events',
        confirmButtonColor: '#ff7a18'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    const user = JSON.parse(userStr);

    fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event._id,
        userId: user._id
      })
    })
      .then(async res => {
        await res.json();

        // ✅ success
        if (res.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Registered!',
            text: 'You have successfully registered 🎉',
            confirmButtonColor: '#ff7a18',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/student/registrations']);
          });
        }

        // ⚠️ already registered
        else if (res.status === 409) {
          Swal.fire({
            icon: 'info',
            title: 'Already Registered',
            text: 'You are already registered for this event',
            confirmButtonColor: '#ff7a18'
          });
        }

        // ❌ failed
        else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Registration failed. Try again later.',
            confirmButtonColor: '#ff7a18'
          });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Something went wrong',
          confirmButtonColor: '#ff7a18'
        });
      });
  }
}
