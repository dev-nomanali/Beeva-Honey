import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api-service';
import { AuthService } from '../../Services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var WOW: any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editMode = false;

  constructor(private apiService: ApiService,private fb: FormBuilder, public authService:AuthService,private router:Router,private spinner:NgxSpinnerService,private toast:ToastrService) { }

  ngOnInit() {
    this.initForm();
    this.getProfile();
    this.disableForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.enableForm();
    } else {
      this.disableForm();
      this.getProfile();
    }
  }

  enableForm() {
    this.profileForm.enable();
  }

  disableForm() {
    this.profileForm.disable();
  }

  getProfile() {
    const id = localStorage.getItem('userId');
    if (id) {
      this.apiService.getProfile(id).subscribe({
        next: (res: any) => {
          if (res) {
            this.profileForm.patchValue({
              username: res.record.username || '',
              email: res.record.email || '',
              phone: res.record.phone || '',
              address: res.record.address || ''
            });
          }
          if (!this.editMode) {
            this.disableForm();
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  editProfile() {
    const id = localStorage.getItem('userId')
    if (id) {
      this.apiService.updateProfile(id, this.profileForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          setTimeout(() =>
            window.location.reload(), 1000)
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.editProfile()
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  get username() {
    return this.profileForm.get('username');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phone() {
    return this.profileForm.get('phone');
  }

  get address() {
    return this.profileForm.get('address');
  }

  logout() {
    this.spinner.show()
    this.apiService.logout().subscribe({
      next: (res: any) => {
        localStorage.clear()
        this.authService.isLoggedIn = false;
        this.router.navigate(['/'])
        this.spinner.hide()
        this.toast.success("Logout Successfully")
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toast.error("Something went wrong")
      }
    })
  }

}

