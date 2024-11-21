import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/enviroment';

export interface UserDetails {
  username: string;
  email: string;
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
}
