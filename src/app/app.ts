import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './Services/api-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'Tea-shop-app';
  showModal: boolean = false;
  private routerSubscription?: Subscription;
  key: any;
  email:any;
  num:any;

  constructor(private router: Router, public authService: AuthService, private spinner: NgxSpinnerService, private toast: ToastrService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    this.getContactDetails()

    // this.authService.checkLogin()

  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }


  openModel(){
    this.showModal = true
  }

  closeModal() {
    this.showModal = false
  }

  getContactDetails() {
    this.key = 'contact'
    if (this.key) {
      this.apiService.getPage(this.key).subscribe({
        next: (res: any) => {
          console.log(res);
          const contactDetails = res?.record?.content;
          this.email = contactDetails.split(",")[0]
          this.num = contactDetails.split(",")[1]
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }

  // logout() {
  //   this.spinner.show()
  //   this.apiService.logout().subscribe({
  //     next: (res: any) => {
  //       localStorage.clear()
  //       this.authService.isLoggedIn = false;
  //       this.router.navigate(['/'])
  //       this.spinner.hide()
  //       this.toast.success("Logout Successfully")
  //     },
  //     error: (error: any) => {
  //       console.log(error);
  //       this.spinner.hide()
  //       this.toast.error("Something went wrong")
  //     }
  //   })
  // }
}
