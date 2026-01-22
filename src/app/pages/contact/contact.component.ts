import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  contactForm!: FormGroup;
  key: any;
  emailId:any;
  num:any;

  constructor(private fb: FormBuilder, private apiService: ApiService,private toast:ToastrService,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required]
    })
    this.getContactDetails()
  }

  get name() {
    return this.contactForm.get('name')
  }

  get email() {
    return this.contactForm.get('email')
  }

  get message() {
    return this.contactForm.get('message')
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.sendMail()
    } else {
      this.contactForm.markAllAsTouched()
    }
  }

  sendMail() {
    const data = this.contactForm.value
    this.spinner.show()
    if (data) {
      this.apiService.sendMail(data).subscribe({
        next: (res: any) => {
          this.spinner.hide()
          this.contactForm.reset()
          this.toast.success("Mail Sent Successfully")
        },
        error: (error: any) => {
          this.spinner.hide()
          console.log(error);
        }
      })
    }
  }

  getContactDetails() {
    this.key = 'contact'
    if (this.key) {
      this.apiService.getPage(this.key).subscribe({
        next: (res: any) => {
          console.log(res);
          const contactDetails = res?.record?.content;
          this.emailId = contactDetails.split(",")[0]
          this.num = contactDetails.split(",")[1]
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }


}