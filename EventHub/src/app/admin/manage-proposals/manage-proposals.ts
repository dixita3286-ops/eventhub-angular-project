import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-proposals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-proposals.html',
  styleUrls: ['./manage-proposals.css']
})
export class ManageProposals implements OnInit {

  proposals: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProposals();
  }

  /* ================= LOAD PROPOSALS ================= */

  loadProposals() {

    fetch('http://localhost:5000/api/events/admin/pending')
      .then(res => res.json())
      .then(data => {

        this.proposals = data.filter((e: any) => e.status === 'pending');

        this.cdr.detectChanges();

      })
      .catch(err => console.error(err));

  }

  /* ================= IMAGE URL FIX ================= */

  getImageUrl(image: string) {

    if (!image) {
      return '';
    }

    // old images (public folder)
    if (image.includes('/public')) {
      return 'http://localhost:5000' + image;
    }

    // new uploaded images
    return 'http://localhost:5000/uploads/images/' + image;

  }

  /* ================= UPDATE STATUS ================= */

  updateStatus(eventId: string, status: string) {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${status} this proposal?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(result => {

      if (result.isConfirmed) {

        fetch(`http://localhost:5000/api/events/${eventId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
        .then(() => {

          this.loadProposals();

          Swal.fire(
            'Success!',
            `Proposal ${status} successfully.`,
            'success'
          );

        })
        .catch(() => {

          Swal.fire('Error', 'Failed to update status', 'error');

        });

      }

    });

  }

}