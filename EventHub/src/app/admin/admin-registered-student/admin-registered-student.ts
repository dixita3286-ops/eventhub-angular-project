import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {

    window.scrollTo(0, 0);

    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (!eventId) return;

    this.loadStudents(eventId);
  }

  /* LOAD STUDENTS */
  loadStudents(eventId: string) {
    this.loading = true;

    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe({
        next: (data) => {

          this.zone.run(() => {
            this.students = data || [];
            this.loading = false;

            this.cdr.detectChanges();

            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 50);
          });

        },
        error: () => {
          this.zone.run(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  /* 🔥 CANCEL REGISTRATION */
  cancelRegistration(id: any) {

  if (!confirm('Are you sure?')) return;

  this.http.delete(`http://localhost:5000/api/registrations/${id}`)
    .subscribe({
      next: () => {

        this.zone.run(() => {

          this.students = this.students.filter(s => s._id !== id);

          this.cdr.detectChanges();

        });

        alert('Cancelled successfully');

      },
      error: () => {
        alert('Error cancelling registration');
      }
    });
}

}