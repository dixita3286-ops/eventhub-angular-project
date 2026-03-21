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

  /* ================= LOAD DATA ================= */
  loadStudents(eventId: string) {
    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe({
        next: (data) => {
          console.log('Registrations:', data);
          this.students = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading registrations', err);
        }
      });
  }

  /* ================= APPROVE ================= */
  approve(id: string) {

    this.http.put(`http://localhost:5000/api/registrations/approve/${id}`, {})
    .subscribe(() => {

      this.students = this.students.map(s => {
        if (s._id === id) s.status = 'approved';
        return s;
      });

      alert('Approved');

    });

  }

  /* ================= REJECT ================= */
  reject(id: string) {

    this.http.put(`http://localhost:5000/api/registrations/reject/${id}`, {})
    .subscribe(() => {

      this.students = this.students.map(s => {
        if (s._id === id) s.status = 'rejected';
        return s;
      });

      alert('Rejected');

    });

  }

  /* ================= VIEW IMAGE ================= */
  viewImage(image: string) {

    const url = 'http://localhost:5000/uploads/images/' + image;
    window.open(url, '_blank');

  }

  /* ================= CANCEL ================= */
  cancelRegistration(registrationId: string) {

    if (!registrationId) {
      alert('Registration ID missing');
      return;
    }

    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    this.http
      .delete(`http://localhost:5000/api/registrations/${registrationId}`)
      .subscribe({
        next: () => {
          this.students = this.students.filter(
            s => s._id !== registrationId
          );
          this.cdr.detectChanges();
          alert('Registration cancelled successfully');
        },
        error: (err) => {
          console.error('Cancel failed', err);
          alert('Failed to cancel registration');
        }
      });
  }

}