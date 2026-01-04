import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Status = 'approved' | 'pending' | 'rejected' | 'all';

@Component({
  selector: 'app-my-event',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './my-event.html',
  styleUrls: ['./my-event.css']
})
export class MyEvent implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];
  status: Status = 'all';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef   // 🔥 ADDED
  ) {}

  ngOnInit(): void {

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.error('User not found in localStorage');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('Organizer ID:', user._id);

    this.http
      .get<any[]>(`http://localhost:5000/api/events/organizer/${user._id}`)
      .subscribe({
        next: (res) => {
          console.log('Events API response:', res);

          this.events = res || [];
          this.applyFilter();

          // 🔥 FORCE UI RENDER (MAIN FIX)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  applyFilter() {
    if (this.status === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(
        e => e.status === this.status
      );
    }
  }

  setStatus(s: Status) {
    this.status = s;
    this.applyFilter();
  }

  createEvent() {
    this.router.navigate(['/organizer/create-event']);
  }

  modify(id: string) {
    this.router.navigate(['/organizer/modify-events-org', id]);
  }

  viewDetails(id: string) {
    this.router.navigate(['/organizer/event-details', id]);
  }

  viewRegistrations(id: string) {
    this.router.navigate(['/organizer/registered-student', id]);
  }
}
