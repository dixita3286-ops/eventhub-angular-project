import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
        console.log('EVENTS FROM BACKEND:', data);
      })
      .catch(err => console.error(err));
  }

  // ================= HERO BUTTON =================
  exploreEvents() {
    document.querySelector('.events-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  // ================= LOGIN BUTTON =================
  studentLogin() {
    alert('Please login first');
    this.router.navigate(['/login']);
  }

  // ================= CARD TOGGLE =================
  toggleDetails(eventId: string) {
    this.selectedEventId =
      this.selectedEventId === eventId ? null : eventId;
  }

  // ================= REGISTER EVENT =================
  registerEvent(event: any) {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      alert('Login required to register');
      this.router.navigate(['/login']);
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
        const data = await res.json();

        // ✅ SUCCESS
        if (res.status === 201) {
          alert('Registered successfully');
          this.router.navigate(['/student/registrations']);
          return;
        }

        // ✅ ALREADY REGISTERED
        if (res.status === 409) {
          alert('You are already registered for this event');
          this.router.navigate(['/student/registrations']);
          return;
        }

        alert(data.message || 'Registration failed');
      })
      .catch(err => {
        console.error(err);
        alert('Registration failed');
      });
  }
}
