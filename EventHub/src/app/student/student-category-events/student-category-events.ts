import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-category-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-category-events.html',
  styleUrls: ['./student-category-events.css']
})
export class StudentCategoryEvents implements OnInit {

  events$!: Observable<any[]>;
  category$!: Observable<string>;

  registeredIds = new Set<string>();
  isLoggedIn = false;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    /* CATEGORY */
    this.category$ = this.route.queryParams.pipe(
      map(params => params['category'] || '')
    );

    /* USER CHECK (NO DEPENDENCY ON CLICK) */
    const userStr = localStorage.getItem('user');
    this.isLoggedIn = !!userStr;

    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user._id;

      /* 🔥 FETCH REGISTERED EVENTS IMMEDIATELY */
      this.http
        .get<any[]>(`http://localhost:5000/api/registrations/student/${this.userId}`)
        .subscribe(data => {
          this.registeredIds.clear();
          data.forEach(r => {
            if (r.eventId?._id) {
              this.registeredIds.add(r.eventId._id);
            }
          });
        });
    }

    /* EVENTS (ALWAYS LOAD) */
    this.events$ = this.route.queryParams.pipe(
      switchMap(params =>
        this.http.get<any[]>(
          'http://localhost:5000/api/events',
          {
            params: {
              category: params['category'] || '',
              search: params['search'] || '',
              sort: params['sort'] || 'date_asc'
            }
          }
        )
      )
    );
  }

  /* SEARCH */
  onSearch(value: string) {
    this.router.navigate([], {
      queryParams: { search: value },
      queryParamsHandling: 'merge'
    });
  }

  /* SORT */
  onSort(value: string) {
    this.router.navigate([], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge'
    });
  }

  /* DETAILS */
  viewDetails(id: string) {
    this.router.navigate(['/student/event-details', id]);
  }

  /* REGISTER CLICK */
  handleRegister(eventId: string) {

    /* 🔴 NOT LOGGED IN */
    if (!this.isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to register',
        showCancelButton: true,
        confirmButtonText: 'Login'
      }).then(res => {
        if (res.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    /* 🟢 ALREADY REGISTERED (SAFETY) */
    if (this.registeredIds.has(eventId)) {
      return;
    }

    /* 🟢 PAYMENT */
    Swal.fire({
      title: 'Select Payment Method',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'UPI',
      cancelButtonText: 'Card',
      reverseButtons: true
    }).then(res => {

      if (res.isConfirmed) {
        this.router.navigate(
          ['/student/payment', eventId],
          { queryParams: { method: 'upi' } }
        );
      }

      if (res.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(
          ['/student/payment', eventId],
          { queryParams: { method: 'card' } }
        );
      }

    });
  }
}
