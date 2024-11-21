import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/enviroment';
import { UserDetails } from '../models/user-details-data';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  uuid: string | null = null;
  private baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient, private authService:AuthService ) { }

  deleteAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
       this.uuid = this.authService.decodedToken.sub;
    }
    else {
      throw new Error('UUID not found');
    }
    const url = `${this.baseUrl}users/${this.uuid}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(url, {headers});
  }

  logoutAllAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('token'); 

    const url = `${this.baseUrl}auth/logout-all`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const options = {
      headers: headers,
      withCredentials: true,
      
      observe: 'response' as 'response',
      responseType: 'json' as 'json'
    };

    document.cookie = `refreshToken=${refreshToken}; path=/`;

    return this.http.delete<any>(url, options);
  }

  logoutAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('token'); 

    const url = `${this.baseUrl}auth/logout`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const options = {
      headers: headers,
      withCredentials: true,
      
      observe: 'response' as 'response',
      responseType: 'json' as 'json'
    };

    document.cookie = `refreshToken=${refreshToken}; path=/`;

    return this.http.delete<any>(url, options);
  }

  
  
    getCookie(name: string): string {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
    return '';
    }


  getProfileData(): Observable<any> {
    const token = localStorage.getItem('token');
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
       this.uuid = this.authService.decodedToken.sub;
    }
    else {
      throw new Error('UUID not found');
    }
    const url = `${this.baseUrl}users/${this.uuid}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url,{ headers });
  }

  getProfileDetails(): Observable<UserDetails> {
    const token = localStorage.getItem('token');
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
       this.uuid = this.authService.decodedToken.sub;
    }
    else {
      throw new Error('UUID not found');
    }
    const url = `${this.baseUrl}users/${this.uuid}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<UserDetails>(url, { headers });
  }

  postProfileData(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
       this.uuid = this.authService.decodedToken.sub;
    }
    else {
      throw new Error('UUID not found');
    }
    const url = `${this.baseUrl}users/${this.uuid}`;
    console.log(data)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
    return this.http.put<any>(url, data,{headers, responseType: 'text' as 'json' });
  }

  changePassword(newPassword: any): Observable<any> {
    console.log(newPassword)
    const token = localStorage.getItem('token');
    this.authService.decodeToken();
    if (this.authService.decodedToken) {
       this.uuid = this.authService.decodedToken.sub;
    }
    else {
      throw new Error('UUID not found');
    }
    
    
    const url = `${this.baseUrl}users/pass/${this.uuid}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<any>(url, newPassword ,{ headers });
  }
}
