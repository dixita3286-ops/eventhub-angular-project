import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-registrations.html',
  styleUrls: ['./student-registrations.css']
})
export class StudentRegistrations implements OnInit {

  registrations: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.loadMyRegistrations();
  }

  loadMyRegistrations() {
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/student/${user._id}`)
      .then(res => res.json())
      .then(data => {
        console.log('MY REGISTRATIONS:', data);

        this.registrations = data;
        this.loading = false;

        // 🔥 FORCE UI UPDATE
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
