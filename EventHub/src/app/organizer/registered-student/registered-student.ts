import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registered-student',
  standalone: true,
  imports: [
    CommonModule,   // ngIf, ngFor, ngClass
    FormsModule,    // ngModel
    DatePipe        // date pipe
  ],
  templateUrl: './registered-student.html',
  styleUrls: ['./registered-student.css']
})
export class RegisteredStudent implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];

  search: string = '';
  status: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  /* ================= LOAD STUDENTS ================= */
  loadStudents() {
    fetch('http://localhost:5000/api/registrations/organizer')
      .then(res => res.json())
      .then(data => {
        this.students = data;
        this.applyFilter();
      })
      .catch(err => console.error(err));
  }

  /* ================= FILTER ================= */
  applyFilter() {
    this.filteredStudents = this.students.filter(s => {
      const matchSearch =
        this.search === '' ||
        s.studentName?.toLowerCase().includes(this.search.toLowerCase()) ||
        s.email?.toLowerCase().includes(this.search.toLowerCase());

      const matchStatus =
        this.status === '' || s.status === this.status;

      return matchSearch && matchStatus;
    });
  }

  /* ================= BACK ================= */
  goBack() {
    this.router.navigate(['/organizer']);
  }
}
