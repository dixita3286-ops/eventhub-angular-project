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

  selectedImage: string | null = null;
  selectedPayment: any = null;

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

  /* LOAD DATA */
  loadPayments() {
    this.http.get<any[]>('http://localhost:5000/api/registrations/payments')
      .subscribe(data => {

        let filtered = data.filter(p => p.method !== 'free');

        this.payments = this.sortPayments(filtered);

        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  /* 🔥 SORT FUNCTION */
  sortPayments(list: any[]) {
    return list.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });
  }

  /* APPROVE */
  approve(id: string) {
    const item = this.payments.find(p => p._id === id);
    if (!item || item.status !== 'pending') return;

    this.http.put(`http://localhost:5000/api/registrations/approve/${id}`, {})
      .subscribe(() => {

        // ✅ UPDATE STATUS
        this.payments = this.payments.map(p =>
          p._id === id
            ? { ...p, status: 'approved', animate: 'approved' }
            : p
        );

        // 🔥 RE-SORT
        this.payments = this.sortPayments(this.payments);

        this.launchConfetti();
        this.closeImage();
        this.cdr.detectChanges();
      });
  }

  /* CONFETTI 🎉 */
  launchConfetti() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  /* REJECT */
  rejectWithReason(id: string) {
    const item = this.payments.find(p => p._id === id);
    if (!item || item.status !== 'pending') return;

    this.closeImage();

    setTimeout(() => {

      Swal.fire({
        title: 'Reject Payment ❌',
        input: 'text',
        inputPlaceholder: 'Enter reason...',
        showCancelButton: true
      }).then(res => {

        if (!res.value) return;

        this.http.put(`http://localhost:5000/api/registrations/reject/${id}`, {
          reason: res.value
        }).subscribe(() => {

          // ✅ UPDATE STATUS
          this.payments = this.payments.map(p =>
            p._id === id
              ? {
                  ...p,
                  status: 'rejected',
                  rejectReason: res.value,
                  animate: 'rejected'
                }
              : p
          );

          // 🔥 RE-SORT
          this.payments = this.sortPayments(this.payments);

          this.cdr.detectChanges();
        });

      });

    }, 200);
  }

  /* OPEN MODAL */
  openImage(payment: any) {
    this.selectedPayment = payment;
    this.selectedImage = 'http://localhost:5000/uploads/images/' + payment.paymentProof;

    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
    this.isZoomed = false;
  }

  /* CLOSE MODAL */
  closeImage() {
    this.selectedImage = null;
    this.selectedPayment = null;
  }

  /* DOUBLE CLICK ZOOM */
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    this.scale = this.isZoomed ? 2 : 1;
    this.updateTransform();
  }

  /* DRAG IMAGE */
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

  /* APPLY TRANSFORM */
  updateTransform() {
    const img = document.querySelector('.modal-img') as HTMLElement;
    if (img) {
      img.style.transform =
        `scale(${this.scale}) translate(${this.posX}px, ${this.posY}px)`;
    }
  }
}