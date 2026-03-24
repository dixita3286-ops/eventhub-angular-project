import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-manage-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-payments.html',
  styleUrls: ['./manage-payments.css']
})
export class ManagePayments implements OnInit {

  payments: any[] = [];
  filteredPayments: any[] = [];

  selectedFilter: string = 'all';
  searchText: string = '';

  selectedImage: string | null = null;

  // 🔥 zoom + drag
  isZoomed = false;
  scale = 1;
  posX = 0;
  posY = 0;

  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.http.get<any[]>('http://localhost:5000/api/registrations/payments')
      .subscribe(data => {
        this.payments = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let data = [...this.payments];

    if (this.selectedFilter !== 'all') {
      data = data.filter(p => p.status === this.selectedFilter);
    }

    if (this.searchText) {
      data = data.filter(p =>
        p.userId?.name?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredPayments = data;
  }

  onSearch(event: any) {
    this.searchText = event.target.value;
    this.applyFilters();
  }

  approve(id: string) {

    const item = this.payments.find(p => p._id === id);
    if (item.status !== 'pending') return;

    this.http.put(`http://localhost:5000/api/registrations/approve/${id}`, {})
      .subscribe(() => {

        this.payments = this.payments.map(p =>
          p._id === id ? { ...p, status: 'approved', animate: 'approved' } : p
        );

        this.applyFilters();
        this.launchConfetti();
        this.cdr.detectChanges();
      });
  }

  launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  rejectWithReason(id: string) {

    const item = this.payments.find(p => p._id === id);
    if (item.status !== 'pending') return;

    Swal.fire({
      title: 'Reject Payment',
      input: 'text',
      showCancelButton: true
    }).then(res => {

      if (!res.value) return;

      this.http.put(`http://localhost:5000/api/registrations/reject/${id}`, {
        reason: res.value
      }).subscribe(() => {

        this.payments = this.payments.map(p =>
          p._id === id
            ? { ...p, status: 'rejected', rejectReason: res.value, animate: 'rejected' }
            : p
        );

        this.applyFilters();
        this.cdr.detectChanges();
      });

    });
  }

  /* IMAGE OPEN */
  openImage(image: string) {
    this.selectedImage = 'http://localhost:5000/uploads/images/' + image;

    // reset
    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
  }

  closeImage() {
    this.selectedImage = null;
  }

  /* DOUBLE CLICK ZOOM */
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    this.scale = this.isZoomed ? 2 : 1;
    this.updateTransform();
  }

  /* DRAG */
  startDrag(event: MouseEvent) {
    if (!this.isZoomed) return;

    const startX = event.clientX - this.posX;
    const startY = event.clientY - this.posY;

    const move = (e: MouseEvent) => {
      this.posX = e.clientX - startX;
      this.posY = e.clientY - startY;
      this.updateTransform();
    };

    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }

  updateTransform() {
    const img = document.querySelector('.modal-img') as HTMLElement;
    if (img) {
      img.style.transform = `scale(${this.scale}) translate(${this.posX}px, ${this.posY}px)`;
    }
  }
}