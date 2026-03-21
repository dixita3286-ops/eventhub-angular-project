import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  amount:number = 0;

  upiId:string = "dixita3286@okicici";
  upiLink:string = '';
  qrCode:string = '';

  cardNumber = '';
  expiry = '';
  cvv = '';

  loading:boolean = true;
  isSubmitting:boolean = false;

  paymentProof:any = null; // 🔥 screenshot

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(q => {
      this.method = q['method'];
    });

    this.route.paramMap.subscribe(p => {

      this.eventId = p.get('id')!;

      this.http.get<any>(`http://localhost:5000/api/events/${this.eventId}`)
      .subscribe(event => {

        this.amount = event.registrationFee;

        this.generateQR();

        this.loading = false;
        this.cd.detectChanges();

      });

    });

    const user = localStorage.getItem('user');

    if(!user){
      Swal.fire('Error','Login required','error');
      this.router.navigate(['/login']);
      return;
    }

    this.userId = JSON.parse(user)._id;

  }

  generateQR(){

    this.upiLink =
    `upi://pay?pa=${this.upiId}&pn=Dixita&am=${this.amount}&cu=INR`;

    this.qrCode =
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' +
    encodeURIComponent(this.upiLink);

  }

  // 🔥 Upload Screenshot
  uploadProof(event:any){
    this.paymentProof = event.target.files[0];
  }

  // 🔥 Confirmation popup
  confirmPayment(){

    if(!this.paymentProof){
      Swal.fire('Upload Required','Please upload payment screenshot','warning');
      return;
    }

    Swal.fire({
      title:'Confirm Payment',
      text:'Are you sure you completed the payment?',
      icon:'question',
      showCancelButton:true,
      confirmButtonText:'Yes, Paid'
    }).then((result)=>{

      if(result.isConfirmed){
        this.payNow();
      }

    });

  }

  payNow(){

    this.isSubmitting = true;

    const formData = new FormData();

    formData.append('eventId', this.eventId);
    formData.append('userId', this.userId);
    formData.append('amount', this.amount.toString());
    formData.append('method', this.method);

    // 🔥 attach screenshot
    formData.append('paymentProof', this.paymentProof);

    Swal.fire({
      title:'Submitting...',
      allowOutsideClick:false,
      didOpen:()=>Swal.showLoading()
    });

    this.http.post(
      'http://localhost:5000/api/registrations',
      formData
    ).subscribe({

      next:()=>{

        Swal.fire(
          'Submitted',
          'Waiting for admin verification',
          'success'
        ).then(()=>{
          this.router.navigate(['/student/registrations']);
        });

      },

      error:(err)=>{

        this.isSubmitting = false;

        if(err.status === 409){
          Swal.fire('Already Registered','You already joined','info');
        }else{
          Swal.fire('Error','Submission failed','error');
        }

      }

    });

  }

  cancelPayment(){
    this.router.navigate(['/student/view-events']);
  }

}