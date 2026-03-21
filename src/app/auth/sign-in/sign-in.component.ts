import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiErrorResponse } from '../../core/models/api.models';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly signInForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [true],
  });

  protected submit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.signInForm.getRawValue();

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.signIn({ email, password }, rememberMe).subscribe({
      next: async () => {
        this.isSubmitting.set(false);
        await this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  protected showError(controlName: 'email' | 'password') {
    const control = this.signInForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && error.error) {
      const apiError = error.error as ApiErrorResponse;
      return apiError.message || 'Unable to sign in right now.';
    }

    return 'Unable to sign in right now.';
  }
}
