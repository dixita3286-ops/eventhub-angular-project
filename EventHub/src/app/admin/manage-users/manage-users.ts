import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  console.log("Deleting user:", id); // 🔥 DEBUG

  if (!confirm('Are you sure you want to delete this user?')) return;

  this.http.delete(`http://localhost:5000/api/users/${id}`)
    .subscribe({
      next: (res) => {

        console.log("Deleted:", res); // 🔥 DEBUG

        // remove from UI
        this.users = this.users.filter(u => u._id !== id);

        alert('User deleted successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Delete error:", err);
        alert('Delete failed');
      }
    });
}
  goBack() {
    window.history.back();
  }
}