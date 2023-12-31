import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthenticationBody } from 'src/app/common/auth/authentication-body';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: LocalStorageService,
    private router: Router
  ) {}

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value#
    if (this.signInForm.invalid) {
      this.signInForm.markAsDirty();
      return;
    }
    let requestEmail: string | null = this.signInForm!.controls['email'].value;
    let requestPassword: string | null =
      this.signInForm!.controls['password'].value;

    if (requestEmail && requestPassword) {
      const body: AuthenticationBody = new AuthenticationBody(
        requestEmail,
        requestPassword
      );

      this.authService.authenticate(body).subscribe((data) => {
        this.storageService.persistToken(data.token, new Date(data.expiration));
      });
      this.router.navigateByUrl('/main');
    }
  }
}
