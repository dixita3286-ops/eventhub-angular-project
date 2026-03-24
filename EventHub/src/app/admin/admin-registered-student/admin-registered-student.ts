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

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (!eventId) return;

    this.loadStudents(eventId);
  }

  /* LOAD STUDENTS */
  loadStudents(eventId: string) {
    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe({
        next: (data) => {
          this.students = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}