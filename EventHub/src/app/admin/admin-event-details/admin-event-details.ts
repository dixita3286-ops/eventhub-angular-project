import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-event-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-event-details.html',
  styleUrls: ['./admin-event-details.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminEventDetails implements OnInit, OnDestroy {

  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // 🔥 SCROLL LOCK ON
    document.body.style.overflow = 'hidden';

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.loading = false;
        return;
      }

      this.fetchEvent(id);
    });
  }

  /* ================= FETCH EVENT ================= */
  fetchEvent(id: string) {
    this.http
      .get(`http://localhost:5000/api/events/${id}`)
      .subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ================= DOWNLOAD ================= */
  downloadFile(filePath: string) {
    window.location.href = 'http://localhost:5000' + filePath;
  }

  /* ================= UNLOCK SCROLL ================= */
  ngOnDestroy(): void {
    document.body.style.overflow = 'auto'; // 🔥 IMPORTANT
  }
}