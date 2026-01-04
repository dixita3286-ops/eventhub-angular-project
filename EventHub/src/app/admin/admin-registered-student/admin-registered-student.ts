import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-registered-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-registered-student.html',
  styleUrls: ['./admin-registered-student.css']
})
export class AdminRegisteredStudent implements OnInit {

  students: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // 🔥 ADD THIS
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (!eventId) return;

    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe(data => {
        this.students = data;

        this.cdr.detectChanges();   // 🔥 FORCE UI UPDATE
      });
  }
}
