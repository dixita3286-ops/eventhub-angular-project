import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit, OnDestroy {

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
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

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

  // 🔥 SCROLL UNLOCK WHEN LEAVING PAGE
  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}