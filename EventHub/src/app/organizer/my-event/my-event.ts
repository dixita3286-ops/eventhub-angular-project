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

    // ✅ RESTORE STATE
    this.activeTab = (localStorage.getItem('activeTab') as Tab) || 'all';
    this.status = (localStorage.getItem('status') as Status) || 'all';
    this.search = localStorage.getItem('search') || '';
    this.category = localStorage.getItem('category') || '';
    this.dateSort = (localStorage.getItem('dateSort') as any) || 'newest';

    this.fetchEvents();
  }

  /* ================= FETCH EVENTS ================= */
  fetchEvents() {

    let url = '';

    if (this.activeTab === 'my') {
      url = `http://localhost:5000/api/events/organizer/${this.organizerId}`;
    } else {
      url = `http://localhost:5000/api/events`;
    }

    this.http.get<any[]>(url).subscribe({
      next: res => {
        this.events = res || [];
        this.applyAllFilters();
        this.cdr.detectChanges();
      },
      error: err => console.error('API Error:', err)
    });
  }

  /* ================= FILTER ================= */
  applyAllFilters() {
    let data = [...this.events];

    if (this.activeTab === 'my' && this.status !== 'all') {
      data = data.filter(e => e.status === this.status);
    }

    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      data = data.filter(e => e.title?.toLowerCase().includes(q));
    }

    if (this.category) {
      data = data.filter(e => e.category === this.category);
    }

    data.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return this.dateSort === 'oldest' ? da - db : db - da;
    });

    this.filteredEvents = data;

    // ✅ SAVE STATE
    localStorage.setItem('activeTab', this.activeTab);
    localStorage.setItem('status', this.status);
    localStorage.setItem('search', this.search);
    localStorage.setItem('category', this.category);
    localStorage.setItem('dateSort', this.dateSort);
  }

  /* ================= ACTIONS ================= */

  changeTab(tab: Tab) {
    this.activeTab = tab;
    this.status = 'all';

    localStorage.setItem('activeTab', tab);

    this.fetchEvents();
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