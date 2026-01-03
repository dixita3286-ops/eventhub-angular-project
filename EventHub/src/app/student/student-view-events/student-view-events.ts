import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private cdr: ChangeDetectorRef) {}

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

  /* ================= REGISTER EVENT ================= */
  registerEvent(eventId: string) {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      alert('Please login first');
      return;
    }

    const user = JSON.parse(userStr);

    fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId: eventId,
        userId: user._id
      })
    })
      .then(res => {
        if (res.status === 409) {
          throw new Error('Already registered');
        }
        return res.json();
      })
      .then(() => {
        alert('🎉 Registered successfully!');
      })
      .catch(err => {
        alert(err.message || 'Registration failed');
      });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }
}
