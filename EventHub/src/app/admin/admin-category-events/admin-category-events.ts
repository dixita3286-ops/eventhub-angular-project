import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-category-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-category-events.html',
  styleUrls: ['./admin-category-events.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminCategoryEvents implements OnInit {

  events$!: Observable<any[]>;
  category$!: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.category$ = this.route.queryParams.pipe(
      map(params => params['category'] || '')
    );

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
    this.router.navigate(['/admin/admin-event-details', id]);
  }
}
