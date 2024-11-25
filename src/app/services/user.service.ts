import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/enviroment';

export interface UserDetails {
  username: string;
  email: string;
}

export interface UserDetailsV2 {
  uuid: string;
  email: string;
  firstname: string;
  lastname: string;
  role: number;
  blocked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl);
  }

  getAllUsers(): Observable<UserDetailsV2[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    
    return this.http.get<UserDetailsV2[]>(`${this.baseUrl}users`, { headers });
  }
}