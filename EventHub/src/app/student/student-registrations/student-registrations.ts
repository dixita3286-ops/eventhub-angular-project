import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-registrations.html',
  styleUrls: ['./student-registrations.css']
})
export class StudentRegistrations implements OnInit {

  approved: any[] = [];
  pending: any[] = [];

  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  /* ================= LOAD ================= */
  loadRegistrations() {

    const user = localStorage.getItem('user');

    if (!user) return;

    const userId = JSON.parse(user)._id;

    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/student/${userId}`)
      .subscribe({
        next: (data) => {

          console.log('My Registrations:', data);

          // 🔥 FILTER
          this.approved = data.filter(r => r.status === 'approved');
          this.pending = data.filter(r => r.status === 'pending');

          this.loading = false;
          this.cdr.detectChanges();

        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });

  }

  /* ================= CANCEL ================= */
  cancelRegistration(id: string) {

    if (!confirm('Are you sure you want to cancel registration?')) return;

    this.http
      .delete(`http://localhost:5000/api/registrations/${id}`)
      .subscribe(() => {

        this.approved = this.approved.filter(r => r._id !== id);
        this.pending = this.pending.filter(r => r._id !== id);

        this.cdr.detectChanges();

        alert('Registration cancelled');

      });

  }

}