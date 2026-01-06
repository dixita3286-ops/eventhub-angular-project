import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

type Status = 'all' | 'approved' | 'pending' | 'rejected';
type Tab = 'my' | 'all';

@Component({
  selector: 'app-my-event',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './my-event.html',
  styleUrls: ['./my-event.css']
})
export class MyEvent implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];

  /* 🔥 DEFAULT = ALL EVENTS OF THIS ORGANIZER */
  activeTab: Tab = 'all';
  status: Status = 'all';
  search: string = '';
  category: string = '';
  dateSort: 'newest' | 'oldest' = 'newest';

  organizerId!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    this.organizerId = user._id;

    this.fetchEvents();
  }

  /* ================= FETCH EVENTS ================= */
  fetchEvents() {

    // 🔥 IMPORTANT CHANGE HERE
    // All Events = this organizer ni badhii events
    const url = `http://localhost:5000/api/events/organizer/${this.organizerId}`;

    this.http.get<any[]>(url).subscribe({
      next: res => {
        this.events = res || [];
        this.applyAllFilters();
        this.cdr.detectChanges();
      },
      error: err => console.error('API Error:', err)
    });
  }

  /* ================= FILTER LOGIC ================= */
  applyAllFilters() {
    let data = [...this.events];

    // STATUS FILTER (only when My Events selected)
    if (this.activeTab === 'my' && this.status !== 'all') {
      data = data.filter(e => e.status === this.status);
    }

    // SEARCH (TITLE)
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      data = data.filter(e =>
        e.title?.toLowerCase().includes(q)
      );
    }

    // CATEGORY
    if (this.category) {
      data = data.filter(e => e.category === this.category);
    }

    // DATE SORT
    data.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return this.dateSort === 'oldest' ? da - db : db - da;
    });

    this.filteredEvents = data;
  }

  /* ================= UI ACTIONS ================= */
  changeTab(tab: Tab) {
    this.activeTab = tab;
    this.status = 'all';
    this.applyAllFilters();   // 🔥 no refetch needed
  }

  setStatus(s: Status) {
    this.status = s;
    this.applyAllFilters();
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

viewRegistrations(eventId: string) {
  this.router.navigate(['/organizer/registered-student', eventId]);
}


}
