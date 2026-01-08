import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef   // 🔥 THIS IS THE KEY
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
          this.students = data || [];
          this.applyFilter();
          this.loading = false;

          // 🔥 FORCE UI REFRESH
          this.cdr.detectChanges();
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ================= FILTER ================= */
  applyFilter() {
    this.filteredStudents = this.students.filter(s => {

      const matchSearch =
        !this.search ||
        s.name?.toLowerCase().includes(this.search.toLowerCase()) ||
        s.email?.toLowerCase().includes(this.search.toLowerCase());

      const matchStatus =
        !this.status || s.status === this.status;

      return matchSearch && matchStatus;
    });
  }

  /* ================= BACK ================= */
  goBack() {
    this.router.navigate(['/organizer/my-event']);
  }
}
