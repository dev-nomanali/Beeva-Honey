import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://localhost:3014/api/';
  // private baseUrl = 'https://api-kinnaur.stacknize.com/api/';

  constructor(private http: HttpClient) { }

  // ------------------ AUTH HEADERS ------------------ //
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*',
      'Content-Type': 'application/json'
    });
  }


  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login`, data);
  }

  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/register`, data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/forgot-password`, data);
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/verify-otp`, data);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/reset-password`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/logout`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  getProfile(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}auth/get-profile/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfile(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}auth/edit-profile/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }


  getAllProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}auth/getAll`, {
      headers: this.getAuthHeaders()
    });
  }

  searchProduct(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}auth/product/search?name=${name}`);
  }


  // getCart(session_id: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}cart/getcart`, { params: { session_id: session_id } });
  // }

  getCart(session_id: string, couponCode: string = ''): Observable<any> {
    const params: any = { session_id };

    if (couponCode) {
      params.couponCode = couponCode;
      params.currDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    }

    return this.http.get(`${this.baseUrl}cart/getcart`, { params });
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}cart/add`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteFromCart(productId: any, session_id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}cart/${productId}`, { params: { session_id: session_id } });
  }

  updateCart(productId: any, quantity: any): Observable<any> {
    return this.http.put(`${this.baseUrl}cart/update/${productId}`, quantity, {
      headers: this.getAuthHeaders()
    });
  }

  clearCart(session_id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}cart/clear`, { params: { session_id: session_id } });
  }


  createOrder(amount: any): Observable<any> {
    return this.http.post(`${this.baseUrl}payment/create-order`, amount, {
      headers: this.getAuthHeaders()
    });
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}payment/verify-payment`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}payment/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  cancelOrder(orderId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}payment/cancel-order/${orderId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }


  sendMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}send-mail`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getPage(key: any): Observable<any> {
    return this.http.get(`${this.baseUrl}${key}`);
  }
}
