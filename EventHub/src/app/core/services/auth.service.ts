import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }
}
