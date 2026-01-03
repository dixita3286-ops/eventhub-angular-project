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

    /* 🔥 REGISTERED EVENTS (ONLY IF LOGGED IN) */
    const userStr = sessionStorage.getItem('user');

    if (userStr) {
      const user = JSON.parse(userStr);

      this.http
        .get<any[]>(`http://localhost:5000/api/registrations/student/${user._id}`)
        .subscribe(data => {
          this.registeredIds.clear(); // safety
          data.forEach(r => {
            if (r.eventId?._id) {
              this.registeredIds.add(r.eventId._id);
            }
          });
        });

    } else {
      // 🔥 NOT LOGGED IN → show NOTHING as registered
      this.registeredIds.clear();
    }

    /* EVENTS */
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

  /* FILTERS */
  onSearch(value: string) {
    this.router.navigate([], {
      queryParams: { search: value },
      queryParamsHandling: 'merge'
    });
  }

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

  /* REGISTER */
  handleRegister(eventId: string) {

    const userStr = sessionStorage.getItem('user');

    // 🔴 NOT LOGGED IN
    if (!userStr) {
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

    // 🟢 PAYMENT METHOD
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
