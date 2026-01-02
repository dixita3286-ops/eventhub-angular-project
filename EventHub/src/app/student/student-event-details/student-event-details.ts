import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './student-event-details.html',
  styleUrls: ['./student-event-details.css']
})
export class StudentEventDetails implements OnInit {

  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ SUBSCRIBE TO PARAM CHANGES
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      console.log('EVENT ID:', id);

      if (!id) {
        console.error('❌ ID NOT FOUND');
        this.loading = false;
        return;
      }

      this.fetchEvent(id);
    });
  }

  fetchEvent(id: string) {
    this.loading = true;
    this.event = null;

    this.http
      .get(`http://localhost:5000/api/events/${id}`)
      .subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;

          // 🔥 FORCE UI UPDATE
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  downloadFile(file: string) {
    window.location.href = 'http://localhost:5000/files/' + file;
  }
}
