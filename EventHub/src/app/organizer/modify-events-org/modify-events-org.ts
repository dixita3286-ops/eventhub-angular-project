import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modify-events-org',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-events-org.html',
  styleUrls: ['./modify-events-org.css']
})
export class ModifyEventsOrg implements OnInit {

  eventId: string = '';

  event = {
    title: '',
    description: '',
    category: '',
    date: '',
    venue: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // ✅ SAFEST WAY: subscribe param (snapshot pan chale, but aa best)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        console.error('Event ID not found in route');
        return;
      }

      this.eventId = id;
      this.loadEventDetails();
    });
  }

  /* ================= LOAD EVENT DETAILS ================= */
  loadEventDetails() {
    fetch(`http://localhost:5000/api/events/${this.eventId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch event');
        }
        return res.json();
      })
      .then(data => {
        // ✅ AUTO FILL FORM (SAFE DATE HANDLING)
        this.event = {
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          date: data.date ? data.date.split('T')[0] : '',
          venue: data.venue || ''
        };
      })
      .catch(err => {
        console.error('Failed to load event', err);
      });
  }

  /* ================= UPDATE EVENT ================= */
  updateEvent() {
    fetch(`http://localhost:5000/api/events/${this.eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.event)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Update failed');
        }
        return res.json();
      })
      .then(() => {
        alert('Event Updated Successfully!');
        this.router.navigate(['/organizer/my-event']);
      })
      .catch(err => {
        console.error('Update failed', err);
      });
  }
}
