import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var WOW: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  loginForm!: FormGroup;
  passwordVisible: boolean = false

  constructor(private fb: FormBuilder, private apiService: ApiService, private spinner: NgxSpinnerService, private router: Router, private toast: ToastrService) { }

  ngAfterViewInit(): void {
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  passVisibile() {
    this.passwordVisible = !this.passwordVisible
  }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show()
      console.log(this.loginForm.value);
      this.login(this.loginForm.value)
    } else {
      this.loginForm.markAllAsTouched()
    }
  }

  login(data: any) {
    this.apiService.login(data).subscribe({
      next: (response: any) => {
        setTimeout(() => this.toast.success("Login Successfully"), 2000)
        const token = response.user.token
        localStorage.setItem('token', token)
        localStorage.setItem('userId', response.user.id)
        this.router.navigate(['/'])
        window.location.reload()
        this.spinner.hide()
        
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toast.error("Something went wrong")
      }
    })
  }

}

