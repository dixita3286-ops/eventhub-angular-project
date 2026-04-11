import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsers implements OnInit {

  users: any[] = [];
  totalUsers = 0;

  searchText: string = '';
  roleFilter: string = 'all';

  // 🔥 EDIT STATE
  editingUser: any = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /* ===== LOAD USERS ===== */
  loadUsers() {

    this.http.get<any[]>('http://localhost:5000/api/users')
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
      });

    this.http.get<any>('http://localhost:5000/api/users/count')
      .subscribe(res => {
        this.totalUsers = res.totalUsers;
        this.cdr.detectChanges();
      });
  }

  /* ===== FILTER ===== */
  get filteredUsers() {
    return this.users
      .filter(u => (u.role || '').toLowerCase() !== 'admin')
      .filter(u => {

        const text = this.searchText.toLowerCase();
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const role = (u.role || '').toLowerCase();

        const matchText =
          name.includes(text) || email.includes(text);

        let matchRole = true;

        if (this.roleFilter !== 'all') {

          if (this.roleFilter === 'user') {
            matchRole = role === 'user' || role === 'student';
          } else {
            matchRole = role === this.roleFilter;
          }
        }

        return matchText && matchRole;
      });
  }

  /* ===== EDIT USER ===== */
  startEdit(user: any) {
    this.editingUser = { ...user }; // clone
  }

  cancelEdit() {
    this.editingUser = null;
  }

  saveEdit() {
    this.http.put(`http://localhost:5000/api/users/${this.editingUser._id}`, this.editingUser)
      .subscribe(() => {

        // update UI
        this.users = this.users.map(u =>
          u._id === this.editingUser._id ? this.editingUser : u
        );

        this.editingUser = null;
        alert('User updated successfully');
        this.cdr.detectChanges();
      });
  }

  /* ===== DELETE USER ===== */
 deleteUser(id: string) {

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to undo this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff9800',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    background: '#1c1c1c',
    color: '#fff'
  }).then((result) => {

    if (result.isConfirmed) {

      this.http.delete(`http://localhost:5000/api/users/${id}`)
        .subscribe({
          next: () => {

            this.users = this.users.filter(u => u._id !== id);

            Swal.fire({
              title: 'Deleted!',
              text: 'User has been deleted.',
              icon: 'success',
              confirmButtonColor: '#ff9800',
              background: '#1c1c1c',
              color: '#fff'
            });

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);

            Swal.fire({
              title: 'Error!',
              text: 'Delete failed',
              icon: 'error',
              confirmButtonColor: '#ff9800'
            });
          }
        });

    }

  });
}
  goBack() {
    window.history.back();
  }
}