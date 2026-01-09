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

  // search & dropdown
  searchText: string = '';
  roleFilter: string = 'all';

  private loaded = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadUsers();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    if (this.loaded) return;
    this.loaded = true;

    // users list
    this.http.get<any[]>('http://localhost:5000/api/users')
      .subscribe(data => {
        this.users = data;
        this.cdr.detectChanges();
      });

    // users count
    this.http.get<any>('http://localhost:5000/api/users/count')
      .subscribe(res => {
        this.totalUsers = res.totalUsers;
        this.cdr.detectChanges();
      });
  }

  // ✅ FINAL FILTER LOGIC (FIXED)
  get filteredUsers() {
    return this.users.filter(u => {

      const text = this.searchText.toLowerCase();
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const role = (u.role || '').toLowerCase();

      const matchText =
        name.includes(text) || email.includes(text);

      let matchRole = true;

      if (this.roleFilter !== 'all') {
        if (this.roleFilter === 'user') {
          // STUDENTS = user OR student
          matchRole = role === 'user' || role === 'student';
        } else {
          matchRole = role === this.roleFilter;
        }
      }

      return matchText && matchRole;
    });
  }

  // back button
  goBack() {
    window.history.back();
  }
}
