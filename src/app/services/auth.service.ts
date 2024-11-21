import { Injectable, inject } from '@angular/core';
import { LoginService } from './login.service';
import { LoginData } from '../models/login-data';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { UserDetails } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLogged$ = new BehaviorSubject<boolean>(false);
  isLogged$ = this._isLogged$.asObservable();
  private loginService = inject(LoginService);
  decodedToken: any;
  userDetails?: UserDetails;

  constructor() {
    const user_token = localStorage.getItem('token');
    this._isLogged$.next(!!user_token);
   }

  userAuthorization(data: LoginData) {
    return this.loginService.login(data).pipe(
      tap((response: string) => {
        if (response) {
          localStorage.setItem('token', response);
          this._isLogged$.next(true);
          this.decodeToken();
        } else {
          console.error('No token found in response');
        }
      }),
      catchError((error: any) => {
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  decodeToken() {
    const user_token = localStorage.getItem('token');
    if(user_token) {
      this.decodedToken = JSON.parse(atob(user_token.split('.')[1]));
      console.log(this.decodedToken);
    } else {
      this.decodedToken = null;
    }
  }

  checkTokenExpiration(): void {
    const expTime = this.decodedToken.expTime * 1000;
    const currTime = new Date().getTime();

    if(expTime <= currTime) {
      this._isLogged$.next(false);
    }
  }

  userLogOut() {
    this._isLogged$.next(false);
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this._isLogged$.value;
  }
}
