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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef   // 👈 important
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

        this.cd.detectChanges();   // 👈 force UI refresh

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

  payNow(){

    Swal.fire({
      title:'Processing Payment...',
      allowOutsideClick:false,
      didOpen:()=>Swal.showLoading()
    });

    setTimeout(()=>{

      this.http.post(
        'http://localhost:5000/api/registrations',
        {
          eventId:this.eventId,
          userId:this.userId,
          amount:this.amount,
          method:this.method
        }
      ).subscribe({

        next:()=>{

          Swal.fire(
            'Payment Successful',
            'Registration completed',
            'success'
          ).then(()=>{
            this.router.navigate(['/student/registrations']);
          });

        },

        error:(err)=>{

          if(err.status === 409){

            Swal.fire(
              'Already Registered',
              'You already joined this event',
              'info'
            );

          }else{

            Swal.fire(
              'Error',
              'Registration failed',
              'error'
            );

          }

        }

      });

    },1500);

  }

  cancelPayment(){
    this.router.navigate(['/student/view-events']);
  }

}