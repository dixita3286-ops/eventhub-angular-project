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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (!eventId) return;

    this.loadStudents(eventId);
  }

  /* LOAD DATA */
  loadStudents(eventId: string) {
    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe({
        next: (data) => {
          this.students = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  /* APPROVE */
  approve(id: string) {
    this.http.put(`http://localhost:5000/api/registrations/approve/${id}`, {})
    .subscribe(() => {

      this.students = this.students.map(s =>
        s._id === id ? { ...s, status: 'approved' } : s
      );

      this.cdr.detectChanges();
    });
  }

  /* REJECT */
  reject(id: string) {
    this.http.put(`http://localhost:5000/api/registrations/reject/${id}`, {})
    .subscribe(() => {

      this.students = this.students.map(s =>
        s._id === id ? { ...s, status: 'rejected' } : s
      );

      this.cdr.detectChanges();
    });
  }

  /* CANCEL */
  cancelRegistration(id: string) {

    if (!confirm('Cancel this registration?')) return;

    this.http
      .delete(`http://localhost:5000/api/registrations/${id}`)
      .subscribe(() => {

        this.students = this.students.filter(s => s._id !== id);
        this.cdr.detectChanges();

        alert('Registration cancelled');
      });
  }

}