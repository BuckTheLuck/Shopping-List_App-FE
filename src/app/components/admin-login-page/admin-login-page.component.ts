import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrl: './admin-login-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminLoginPageComponent {
  loginForm!: FormGroup;
  loginError: boolean = false;
  passwordFieldType: string = 'password';
 //obsluga loginAdmin()
}
