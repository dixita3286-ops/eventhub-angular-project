import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-modify-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-modify-events.html',
  styleUrls: ['./admin-modify-events.css']
})
export class AdminModifyEvents implements OnInit {

  eventId!: string;
  event: any = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.loadEvent();
  }

  loadEvent() {
  this.http
    .get<any>(`http://localhost:5000/api/events/${this.eventId}`)
    .subscribe(data => {

      // 🔥 FIX DATE FORMAT
      if (data.date) {
        data.date = data.date.split('T')[0];
      }

      this.event = data;
      this.cdr.detectChanges();
    });
}

  updateEvent() {
    this.http
      .put(`http://localhost:5000/api/events/${this.eventId}`, this.event)
      .subscribe(() => {
        this.router.navigate(['/admin/manage-events']);
      });
  }
}
