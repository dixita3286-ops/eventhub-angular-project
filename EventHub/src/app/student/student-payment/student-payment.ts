import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-payment.html',
  styleUrls: ['./student-payment.css']
})
export class StudentPayment implements OnInit {

  eventId!: string;
  method!: 'upi' | 'card';
  userId!: string;

  // form
  upiId = '';
  cardNumber = '';
  expiry = '';
  cvv = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // ✅ EVENT ID FROM ROUTE
    this.route.paramMap.subscribe(p => {
      this.eventId = p.get('id')!;
    });

    // ✅ METHOD FROM QUERY
    this.route.queryParams.subscribe(q => {
      this.method = q['method'];
    });

    // ✅ USER FROM LOCAL STORAGE
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      Swal.fire('Error', 'User not logged in', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.userId = JSON.parse(userStr)._id;
  }

  payNow() {

    // 🔒 BASIC VALIDATION
    if (this.method === 'upi' && !this.upiId) {
      Swal.fire('Invalid UPI', 'Enter UPI ID', 'error');
      return;
    }

    if (this.method === 'card' && (!this.cardNumber || !this.expiry || !this.cvv)) {
      Swal.fire('Invalid Card', 'Fill all card details', 'error');
      return;
    }

    // 🔄 LOADER
    Swal.fire({
      title: 'Processing payment...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    // ⏳ FAKE PAYMENT DELAY
    setTimeout(() => {

      // 🔥 REAL REGISTRATION API CALL
      this.http.post(
        'http://localhost:5000/api/registrations',
        {
          eventId: this.eventId,
          userId: this.userId
        }
      ).subscribe({
        next: () => {
          Swal.fire('Success', 'Registration successful 🎉', 'success')
            .then(() => this.router.navigate(['/student/registrations']));
        },
        error: (err) => {
          if (err.status === 409) {
            Swal.fire('Info', 'You are already registered', 'info');
          } else {
            Swal.fire('Error', 'Registration failed', 'error');
          }
        }
      });

    }, 1500);
  }

  cancelPayment() {
    this.router.navigate(['/student/view-events']);
  }
}
