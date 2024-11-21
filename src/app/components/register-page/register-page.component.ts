import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { RegisterData } from '../../models/register-data';
import { Router } from '@angular/router';

export const StrongPasswordRegx: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,32}$/;

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  encapsulation: ViewEncapsulation.None,
})

export class RegisterPageComponent {
  registerForm: FormGroup;
  private registerService = inject(RegisterService);
  validDate: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.registerForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(StrongPasswordRegx)],
      ],
      retPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(32),
        ],
      ],
    } as unknown as RegisterData);
  }

  get firstNameFormField() {
    return this.registerForm.get('firstName');
  }
  get lastNameFormField() {
    return this.registerForm.get('lastName');
  }
  get passwordFormField() {
    return this.registerForm.get('password');
  }
  get retPasswordFormField() {
    return this.registerForm.get('retPassword');
  }
  get emailFormField() {
    return this.registerForm.controls['email'];
  }

  goToRoute(route: string) {
    this.router.navigateByUrl(route);
  }

  sendRegisterData() {
    setTimeout(() => {
      const data = { ...this.registerForm.value};
      console.log(data)
      if (
        this.registerForm.valid &&
        this.registerForm.value.password === this.registerForm.value.retPassword
      ) {
        this.registerService.postRegisterData(data).subscribe(
          (response) => {
            console.log('Data sent successfully:', response);
            this.goToRoute('login');
          },
          (error) => {
            console.error('Error sending data:', error);
          }
        );
      }
    }, 1000);
  }

  resetTouched(controlName: string) {
    this.registerForm.controls[controlName].markAsUntouched();
  }

  checkPasswordRequirements() {
    if (
      !this.passwordFormField?.value ||
      !this.passwordFormField?.value?.match('^(?=.*[A-Z])') ||
      !this.passwordFormField?.value?.match('^(?=.*[a-z])') ||
      !this.passwordFormField?.value?.match('(?=.*[!@#$%^&*])') ||
      !this.passwordFormField?.value?.match('.{8,}')
    ) {
      return true;
    } else {
      return false;
    }
  }

  isInvalidEmail() {
    return (
      this.emailFormField.invalid &&
      this.emailFormField.value !== '' &&
      this.emailFormField.touched
    );
  }

  isInvalidPassword() {
    return (
      this.retPasswordFormField?.value !== this.passwordFormField?.value &&
      this.retPasswordFormField?.dirty &&
      this.passwordFormField?.dirty
    );
  }

  isFormValid() {
    return (
      this.validDate &&
      this.registerForm.valid &&
      this.registerForm.value.password === this.registerForm.value.retPassword
    );
  }
      
}