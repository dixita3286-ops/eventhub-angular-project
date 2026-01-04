import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-public-category-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-events.html',
  styleUrls: ['./category-events.css'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryEvents implements OnInit {

  events$!: Observable<any[]>;
  category$!: Observable<string>;

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
    this.router.navigate(['/public/event-details', id]);
  }
}
