import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/enviroment';
import { AuthService } from './auth.service';

export interface UserDetails {
  username: string;
  email: string;
}

export interface UserDetailsV2 {
  id: string;
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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl);
  }

  getAllUsers(): Observable<UserDetailsV2[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    
    return this.http.get<UserDetailsV2[]>(`${this.baseUrl}users`, { headers });
  }

  blockUser(uuid: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    
    return this.http.put(`${this.baseUrl}users/${uuid}/block`, {}, { headers, responseType: 'text' });  
  }
  
  unblockUser(uuid: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
  
    return this.http.put(`${this.baseUrl}users/${uuid}/unblock`, {}, { headers, responseType: 'text' });  
  }
  
  deleteUser(uuid: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    
    return this.http.delete(`${this.baseUrl}users/${uuid}`, { headers, responseType: 'text' }); 
}
}