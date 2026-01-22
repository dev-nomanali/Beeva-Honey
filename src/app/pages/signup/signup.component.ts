import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api-service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var WOW: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Initialize WOW.js for animations
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }

  signupForm!: FormGroup;
  passwordVisible: boolean = false

  constructor(private fb: FormBuilder, private apiService: ApiService,private spinner:NgxSpinnerService,private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required]
    })
  }

  passVisibile() {
    this.passwordVisible = !this.passwordVisible
  }

  get email() {
    return this.signupForm.get("email")
  }

  get password() {
    return this.signupForm.get("password")
  }

  get username() {
    return this.signupForm.get('username')
  }

  get phone() {
    return this.signupForm.get('phone')
  }

  get address() {
    return this.signupForm.get('address')
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.signUp(this.signupForm.value)
    } else {
      this.signupForm.markAllAsTouched()
    }
  }


  signUp(data: any) {
    this.spinner.show()
    this.apiService.signup(data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(['/login'])
        this.spinner.hide()
        this.toastr.success("Account created successfully")
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide()
      }
    })
  }
 
}