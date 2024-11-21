import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RegisterData } from '../models/register-data';
import { Observable } from 'rxjs';
import { environment } from '../environments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class RegisterService { 
  private baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) {}

  postRegisterData(data: RegisterData): Observable<string>{
    return this.http.post(this.baseUrl + 'users', data, {responseType: 'text'});
  }
}
