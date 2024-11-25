import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginData } from '../../models/login-data';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  
  goToRoute(route: string) {
    this.router.navigateByUrl(route);
  }

  login() {
    if (this.loginForm.valid){
      const data = {...this.loginForm.value};
      console.log(data);
      this.authService.userAuthorization(data).subscribe(
        (response: any) => {
          console.log("Login successful:", response);
          this.goToRoute('main');
        },
        (error: any) => {
          console.error("Login failed:", error);
          this.snackBar.open('Login failed: Incorrect credientials or user is blocked.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          
          this.loginError = true;
        }
      );
    }
  }

  resetTouched(controlName: string) {
    this.loginForm.controls[controlName].markAsUntouched();
    this.loginError = false;
  }

  get emailFormField() {
    return this.loginForm.controls['email'];
  }
  get passwordFormField() {
    return this.loginForm.get('password');
  }

  isInvalidEmail() {
    return (
      this.emailFormField.invalid &&
      this.emailFormField.value !== '' &&
      this.emailFormField.touched
    );
  }
}
