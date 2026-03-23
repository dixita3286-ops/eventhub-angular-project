import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // 🔥 ADD

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
  rejected: any[] = []; // 🔥 ADD

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

          // 🔥 FILTER ALL 3 TYPES
          this.approved = data.filter(r => r.status === 'approved');
          this.pending = data.filter(r => r.status === 'pending');
          this.rejected = data.filter(r => r.status === 'rejected'); // 🔥 ADD

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

    Swal.fire({
      title: 'Cancel Registration?',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel'
    }).then(res => {

      if (!res.isConfirmed) return;

      this.http
        .delete(`http://localhost:5000/api/registrations/${id}`)
        .subscribe(() => {

          this.approved = this.approved.filter(r => r._id !== id);
          this.pending = this.pending.filter(r => r._id !== id);
          this.rejected = this.rejected.filter(r => r._id !== id); // 🔥 ADD

          this.cdr.detectChanges();

          Swal.fire('Done!', 'Registration cancelled', 'success');

        });

    });

  }

  /* ================= REJECT POPUP ================= */

  showRejectReason(reason: string) {
  Swal.fire({
    title: ' Registration Rejected ❌',
    text: reason || 'No reason provided',
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ff9800',
    background: '#111',
    color: '#fff'
  });
}

}