import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registered-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    HttpClientModule
  ],
  templateUrl: './registered-student.html',
  styleUrls: ['./registered-student.css']
})
export class RegisteredStudent implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];

  search = '';
  status = '';
  loading = true;

  eventId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,   // 🔥 ADD
    private zone: NgZone              // 🔥 ADD
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');

      if (!id) {
        this.loading = false;
        return;
      }

      this.eventId = id;
      this.loadStudents();
    });
  }

  /* ================= LOAD STUDENTS ================= */
  loadStudents() {
    this.loading = true;

    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${this.eventId}`)
      .subscribe({
        next: data => {

          // 🔥 IMPORTANT FIX
          this.zone.run(() => {
            this.students = (data || []).filter(s => s.status === 'approved');
            this.applyFilter();
            this.loading = false;

            this.cdr.detectChanges(); // 🔥 force UI update
          });

        },
        error: err => {
          console.error('Error loading students:', err);

          this.zone.run(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  /* ================= FILTER ================= */
  applyFilter() {

    const searchLower = this.search.toLowerCase();

    this.filteredStudents = this.students.filter(s => {

      const matchSearch =
        !this.search ||
        (s.name || '').toLowerCase().includes(searchLower) ||
        (s.email || '').toLowerCase().includes(searchLower);

      const matchStatus =
        !this.status || (s.status || 'registered') === this.status;

      return matchSearch && matchStatus;
    });

    this.cdr.detectChanges(); // 🔥 ensure update
  }

  /* ================= BACK ================= */
  goBack() {

    localStorage.setItem('activeTab', 'my');
    this.router.navigate(['/organizer/my-event']);
  }
}