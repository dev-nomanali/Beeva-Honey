import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get otp() {
    return this.resetPasswordForm.get('otp');
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (this.newPassword?.value !== this.confirmPassword?.value) {
      this.toast.error('Passwords do not match');
      return;
    }

    const payload = {
      otp: this.otp?.value,
      newPassword: this.newPassword?.value
    };

    this.spinner.show();
    this.apiService.resetPassword(payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.toast.success('Password reset successfully');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
        this.toast.error(error?.error?.message || 'Unable to reset password');
      }
    });
  }
}


