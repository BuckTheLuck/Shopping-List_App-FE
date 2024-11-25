import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AdminLoginService } from '../../services/admin-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrl: './admin-login-page.component.css',
  encapsulation: ViewEncapsulation.None
})

export class AdminLoginPageComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  passwordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private AdminLoginService: AdminLoginService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  loginAdmin() {
    if (this.loginForm.valid){
      const data = {...this.loginForm.value};
      console.log(data);
      this.authService.adminAuthorization(data).subscribe(
        (response: any) => {
          console.log("Login successful:", response);
          this.goToRoute('panel');
        },
        (error: any) => {
          console.error("Login failed:", error);
          this.loginError = true;
        }
      );
    }
  }

  goToRoute(route: string) {
    this.router.navigateByUrl(route);
  }
}
