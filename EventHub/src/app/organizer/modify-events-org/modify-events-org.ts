import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-modify-events-org',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './modify-events-org.html',
  styleUrls: ['./modify-events-org.css']
})
export class ModifyEventsOrg implements OnInit {

  eventId: string = '';

  categories: string[] = [
    'Workshop',
    'Seminar',
    'Cultural',
    'Sports',
    'Social',
    'Exhibition'
  ];

  event: any = {
    title: '',
    description: '',
    category: '',
    date: '',
    venue: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      console.log("Received ID:", id); // 🔥 DEBUG

      if (!id) {
        alert("Invalid Event ID");
        return;
      }

      this.eventId = id;
      this.loadEventDetails();
    });
  }

  /* ================= LOAD EVENT ================= */
  loadEventDetails() {
    this.http.get<any>(`http://localhost:5000/api/events/${this.eventId}`)
      .subscribe({
        next: (data) => {

          console.log("Fetched Event:", data); // 🔥 DEBUG

          this.event = {
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            date: data.date ? data.date.split('T')[0] : '',
            venue: data.venue || ''
          };

          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Load error:', err);
          alert("Failed to load event");
        }
      });
  }

  /* ================= UPDATE EVENT ================= */
  updateEvent() {

    console.log("Updating ID:", this.eventId);   // 🔥 DEBUG
    console.log("Sending Data:", this.event);    // 🔥 DEBUG

    this.http.put(`http://localhost:5000/api/events/${this.eventId}`, this.event)
      .subscribe({
        next: (res: any) => {
          console.log("Update Success:", res);

          alert('✅ Event Updated Successfully!');
          this.router.navigate(['/organizer/my-event']);
        },
        error: (err) => {
          console.error('❌ Update failed:', err);

          // 🔥 SHOW ACTUAL ERROR
          if (err.status === 404) {
            alert("❌ API not found (Check backend route)");
          } else {
            alert("❌ Update failed");
          }
        }
      });
  }
}