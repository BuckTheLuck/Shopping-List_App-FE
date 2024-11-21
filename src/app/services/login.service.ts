import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginData } from '../models/login-data';
import { environment } from '../environments/enviroment';

@Injectable({
  providedIn: 'root'
})


export class LoginService {
  private baseUrl = environment.baseURL;

  private http = inject(HttpClient);
  
  constructor() {}

  login(data: LoginData): Observable<string> {
    return this.http.post(`${this.baseUrl}auth/login`, data, {responseType: 'text'});
    }
  }

