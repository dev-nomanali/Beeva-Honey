import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // apiUrl = 'http://localhost:3014/api/';
   apiUrl = '';
  // apiUrl = 'https://api-kinnaur.stacknize.com/api/';
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient) { }

  checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.isLoggedIn = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, });

    this.http.get(`${this.apiUrl}auth/check-login`, { headers }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoggedIn = res.isLoggedIn;
      },
      error: () => {
        this.isLoggedIn = false;
      },
    });
  }
}
