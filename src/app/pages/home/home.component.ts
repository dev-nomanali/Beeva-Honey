import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../../Services/api-service';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var WOW: any;

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterLink, CommonModule, FormsModule]
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Initialize WOW.js for animations
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }

    // Initialize carousels after view is ready
    if (typeof $ !== 'undefined') {
      setTimeout(() => {
        // Initialize product carousel
        if ($('.product-carousel').length > 0) {
          $('.product-carousel').owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            margin: 25,
            loop: true,
            center: true,
            dots: false,
            nav: true,
            navText: [
              '<i class="bi bi-chevron-left"></i>',
              '<i class="bi bi-chevron-right"></i>'
            ],
            responsive: {
              0: { items: 1 },
              576: { items: 1 },
              768: { items: 2 },
              992: { items: 3 }
            }
          });
        }

        // Initialize testimonial carousel
        if ($('.testimonial-carousel').length > 0) {
          $('.testimonial-carousel').owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            items: 1,
            loop: true,
            dots: true,
            nav: false
          });
        }
      }, 100);
    }
  }



  products: any;
  tagline: any;
  key: any;
  email:any;
  num:any;

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toast: ToastrService) { }

  ngOnInit() {
    this.getAllProduct()
    this.key = 'home'
    this.getTagline(this.key)
    this.getContactDetails()
  }


  getTagline(key: string) {
    if (this.key) {
      this.apiService.getPage(this.key).subscribe({
        next: (res: any) => {
          console.log(res);
          this.tagline = res?.record?.content;
        },
        error: (error: any) => {
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
          this.email = contactDetails.split(",")[0]
          this.num = contactDetails.split(",")[1]
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }


  getAllProduct() {
    this.apiService.getAllProduct().subscribe({
      next: (response: any) => {
        console.log(response);
        this.products = response.slice(0, 3)
        this.products.forEach((product: any) => {
          product.count = 1
          product.originalPrice = product.price
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  quantAdd(productCount: any) {
    productCount.count++
    let price = productCount.count * productCount.originalPrice
    productCount.price = price
  }

  quantDel(productCount: any) {
    if (productCount.count > 1) {
      productCount.count--
      productCount.price = productCount.count * productCount.originalPrice  // ✨ Use original price
    }
    return
  }

  addToCart(productId: any, quantity: any) {
    this.spinner.show()
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   this.router.navigate(['/login']);
    //   this.spinner.hide()
    //   return
    // }
    const session_id = this.getSesionId()
    const payload = { productId: productId, quantity: quantity, session_id: session_id }
    console.log(payload);
    this.apiService.addToCart(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['/cart'])
        this.spinner.hide()
        this.toast.success("Item Added To Cart")
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toast.error("Something went wrong")
      }
    })
  }

  getSesionId() {
    let session_id = localStorage.getItem('session_id')
    if (!session_id) {
      session_id = crypto.randomUUID();
      localStorage.setItem('session_id', session_id)
    }
    return session_id;
  }

  scroll() {
    window.scrollTo(0, 0)
  }


}