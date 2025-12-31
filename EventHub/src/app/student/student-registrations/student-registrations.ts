import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-student-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-registrations.html',
  styleUrls: ['./student-registrations.css']
})
export class StudentRegistrations implements OnInit, OnDestroy {

  registrations: any[] = [];
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 🔥 FIRST LOAD
    this.loadMyRegistrations();

    // 🔥 LOAD AFTER EVERY NAVIGATION COMPLETES
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadMyRegistrations();
      });
  }

  loadMyRegistrations() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.registrations = [];
      return;
    }

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/user/${user._id}`)
      .then(res => res.json())
      .then(data => {
        this.registrations = data;
      })
      .catch(() => {
        this.registrations = [];
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
