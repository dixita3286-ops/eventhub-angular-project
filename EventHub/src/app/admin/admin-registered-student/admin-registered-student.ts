import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-registered-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-registered-student.html',
  styleUrls: ['./admin-registered-student.css']
})
export class AdminRegisteredStudent implements OnInit {

  students: any[] = [];

  // 🔥 modal
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (!eventId) return;

    this.loadStudents(eventId);
  }

  /* LOAD */
  loadStudents(eventId: string) {
    this.http
      .get<any[]>(`http://localhost:5000/api/registrations/event/${eventId}`)
      .subscribe(data => {
        this.students = data;
        this.cdr.detectChanges();
      });
  }

  /* APPROVE */
  approve(id: string) {
    this.http.put(`http://localhost:5000/api/registrations/approve/${id}`, {})
      .subscribe(() => {

        this.students = this.students.map(s =>
          s._id === id ? { ...s, status: 'approved' } : s
        );

        this.cdr.detectChanges();
      });
  }

  /* REJECT WITH REASON */
  rejectWithReason(id: string) {

    const reason = prompt("Enter reject reason:");

    if (!reason) return;

    this.http.put(`http://localhost:5000/api/registrations/reject/${id}`, { reason })
      .subscribe(() => {

        this.students = this.students.map(s =>
          s._id === id
            ? { ...s, status: 'rejected', rejectReason: reason }
            : s
        );

        this.cdr.detectChanges();
      });
  }

  /* IMAGE OPEN */
  openImage(image: string) {
    this.selectedImage = 'http://localhost:5000/uploads/images/' + image;
    document.body.style.overflow = 'hidden';
  }

  /* IMAGE CLOSE */
  closeImage() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}