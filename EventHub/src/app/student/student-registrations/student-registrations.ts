import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-registrations',
  standalone: true,
  imports: [
    CommonModule,   // ✅ ngIf, ngFor, ngClass
    FormsModule,    // ✅ ngModel
    DatePipe        // ✅ date pipe
  ],
  templateUrl: './student-registrations.html',
  styleUrls: ['./student-registrations.css']
})
export class StudentRegistrations implements OnInit {

  registrations: any[] = [];
  filteredStudents: any[] = [];

  search: string = '';
  status: string = '';
  loading = true;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyRegistrations();
  }

  /* ================= LOAD ================= */
  loadMyRegistrations() {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.loading = false;
      return;
    }

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/student/${user._id}`)
      .then(res => res.json())
      .then(data => {
        this.registrations = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loading = false;
      });
  }

  /* ================= FILTER ================= */
  applyFilter() {
    this.filteredStudents = this.registrations.filter(r => {
      const matchSearch =
        this.search === '' ||
        r.eventId?.title?.toLowerCase().includes(this.search.toLowerCase());

      const matchStatus =
        this.status === '' || r.status === this.status;

      return matchSearch && matchStatus;
    });
  }

  /* ================= BACK ================= */
  goBack() {
    this.router.navigate(['/student']);
  }
}
