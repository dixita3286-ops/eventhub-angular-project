import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
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
export class StudentEventDetails implements OnInit, OnDestroy {

  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // 🔥 SCROLL LOCK
    document.body.style.overflow = 'hidden';

    // 🔥 FORCE INITIAL TOP POSITION (FIX GLITCH)
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

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
    this.loading = true;
    this.event = null;

    this.http
      .get(`http://localhost:5000/api/events/${id}`)
      .subscribe({
        next: (data) => {

          this.event = data;
          this.loading = false;

          this.cdr.detectChanges();

          // 🔥 FORCE PERFECT CENTER AFTER DATA LOAD
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 50);
        },

        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ================= DOWNLOAD ================= */

  downloadFile(filePath: string) {
    const fileUrl = 'http://localhost:5000' + filePath;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'event-file';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('❌ File download failed', err);
      }
    });
  }

  /* ================= UNLOCK SCROLL ================= */

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto'; // 🔥 RESTORE SCROLL
  }
}