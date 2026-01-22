import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  verifyOtpForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.verifyOtpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get otp() {
    return this.verifyOtpForm.get('otp');
  }

  get newPassword() {
    return this.verifyOtpForm.get('newPassword');
  }

  get confirmPassword() {
    return this.verifyOtpForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.verifyOtpForm.invalid) {
      this.verifyOtpForm.markAllAsTouched();
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
    this.apiService.verifyOtp(payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.toast.success('OTP verified successfully, password updated');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        this.spinner.hide();
        this.toast.error(error?.error?.message || 'Invalid OTP');
      }
    });
  }
}


