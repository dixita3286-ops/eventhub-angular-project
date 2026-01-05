import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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

    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe(data => {
        this.students = data;
        this.cdr.detectChanges();
      });
  }

  /* ================= DELETE REGISTRATION ================= */
  deleteRegistration(registrationId: string, index: number) {

    Swal.fire({
      title: 'Remove Student?',
      text: 'This will cancel the registration',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      confirmButtonText: 'Yes, remove'
    }).then(result => {

      if (result.isConfirmed) {
        this.http
          .delete(`http://localhost:5000/api/registrations/${registrationId}`)
          .subscribe(() => {
            this.students.splice(index, 1);
            this.cdr.detectChanges();

            Swal.fire(
              'Removed',
              'Student registration cancelled',
              'success'
            );
          });
      }

    });
  }
}
