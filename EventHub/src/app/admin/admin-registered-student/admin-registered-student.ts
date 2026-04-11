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
    private zone: NgZone   // 🔥 ADD
  ) {}

  ngOnInit(): void {

    // 🔥 ALWAYS START FROM TOP
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

            // 🔥 FORCE UI + SCROLL FIX
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
}