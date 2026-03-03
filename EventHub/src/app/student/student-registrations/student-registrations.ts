import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-registrations.html',
  styleUrls: ['./student-registrations.css']
})
export class StudentRegistrations implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];
  loading = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  /* ================= LOAD REGISTRATIONS ================= */
  loadRegistrations() {

    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);

    fetch(`http://localhost:5000/api/registrations/student/${user._id}`)
      .then(res => res.json())
      .then(data => {
        this.students = data;
        this.filteredStudents = data;
        this.loading = false;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error(err);
        this.loading = false;
      });
  }

  /* ================= CANCEL REGISTRATION ================= */
  cancelRegistration(registrationId: string) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this registration?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No'
    }).then(result => {

      if (result.isConfirmed) {

        fetch(`http://localhost:5000/api/registrations/${registrationId}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(() => {

            // Remove instantly from UI
            this.filteredStudents =
              this.filteredStudents.filter(
                r => r._id !== registrationId
              );

            Swal.fire(
              'Cancelled!',
              'Your registration has been cancelled.',
              'success'
            );

            this.cdr.detectChanges();
          })
          .catch(err => console.error(err));
      }

    });
  }

}