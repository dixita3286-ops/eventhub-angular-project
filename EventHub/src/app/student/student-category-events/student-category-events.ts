import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

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

    // 🔹 CATEGORY ONLY (NO MUTATION)
    this.category$ = this.route.queryParams.pipe(
      map(params => params['category'] || '')
    );

    // 🔹 REGISTERED EVENTS
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.http
        .get<any[]>(`http://localhost:5000/api/registrations/student/${user._id}`)
        .subscribe(data => {
          data.forEach(r => {
            if (r.eventId?._id) {
              this.registeredIds.add(r.eventId._id);
            }
          });
        });
    }

    // 🔹 EVENTS (PURE STREAM)
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

  viewDetails(id: string) {
    this.router.navigate(['/student/event-details', id]);
  }

  register(id: string) {
    this.router.navigate(['/student/payment'], {
      queryParams: { event_id: id }
    });
  }
}
