import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {
  products: any;
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private toast: ToastrService) { }

  ngOnInit() {
    this.getAllProduct()
  }

  getAllProduct() {
    this.apiService.getAllProduct().subscribe({
      next: (response: any) => {
        console.log(response);
        this.products = response
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
    this.apiService.addToCart(payload).subscribe({
      next: (res: any) => {
        console.log(res);
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

  searchProduct() {
    const query = this.searchTerm.trim();
    if (!query) {
      this.getAllProduct();
      return;
    }

    this.apiService.searchProduct(query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res.record;
      },
      error: (err) => {
        console.log('Search Error:', err);
      }
    });
  }


}


