import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-public-event-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './event-details.html',
  styleUrls: ['./event-details.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicEventDetails implements OnInit {

  event: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.loading = false;
        return;
      }

      this.fetchEvent(id);
    });
  }

  fetchEvent(id: string) {
    this.loading = true;

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

  downloadFile(filePath: string) {
    window.location.href = 'http://localhost:5000' + filePath;
  }
}
