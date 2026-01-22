import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: any[] = [];
  summary: { totalItems: number; totalQuantity: number; totalAmount: number, totalShippingCharges: number, discount: any, subtotal: any, grossAmount: any } | null = null;
  error: string | null = null;
  // paymentType: string = 'COD';
  paymentType: string = 'Razorpay';
  couponCode: string = '';
  addressForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private spinner: NgxSpinnerService, private toast: ToastrService, private router: Router) { }

  ngOnInit() {
    this.fetchCart()
    console.log(this.cartItems);
    
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      altPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      terms: [false, Validators.requiredTrue],
    })
  }

  get name() {
    return this.addressForm.get('name')
  }

  get email() {
    return this.addressForm.get('email')
  }

  get addressLine1() {
    return this.addressForm.get('addressLine1')
  }

  get addressLine2() {
    return this.addressForm.get('addressLine2')
  }

  get city() {
    return this.addressForm.get('city')
  }

  get state() {
    return this.addressForm.get('state')
  }

  get zipCode() {
    return this.addressForm.get('zipCode')
  }

  get altPhone() {
    return this.addressForm.get('altPhone')
  }

  get terms() {
    return this.addressForm.get('terms');
  }


  fetchCart() {
    this.error = null;
    const session_id = localStorage.getItem('session_id')
    if (session_id) {
      this.apiService.getCart(session_id!).subscribe({
        next: (res: any) => {
          if (res && res.success && res.data) {
            this.cartItems = res.data.items || []
            this.summary = res.data.summary || null
            console.log(this.summary);

          } else if (res && res.message === 'Your Cart is empty') {
            this.cartItems = []
            this.summary = { totalItems: 0, totalQuantity: 0, totalAmount: 0, totalShippingCharges: 0, discount: 0, subtotal: 0, grossAmount: 0 }
          }
        },
        error: (err: any) => {
          this.error = 'Failed to load cart';
        }
      })
    }

  }

  increment(item: any) {
    const newQty = (item.quantity || 1) + 1
    this.updateQuantity(item.productId, newQty)
  }

  decrement(item: any) {
    const current = item.quantity || 1
    const newQty = current > 1 ? current - 1 : 1
    if (newQty !== current) {
      this.updateQuantity(item.productId, newQty)
    }
  }

  updateQuantity(productId: number, quantity: number) {
    const session_id = localStorage.getItem('session_id')
    this.apiService.updateCart(productId, { quantity: quantity, session_id: session_id }).subscribe({
      next: () => this.fetchCart(),
      error: () => this.fetchCart()
    })
  }

  deleteProduct(productId: number) {
    const session_id = localStorage.getItem('session_id')
    this.spinner.show()
    this.apiService.deleteFromCart(productId, session_id).subscribe({
      next: (res: any) => {
        this.fetchCart()
        this.spinner.hide()
        this.toast.success("Item Deleted From Cart")
      },
      error: (error: any) => {
        this.spinner.hide()
        console.log(error);
        this.toast.error("Something went wrong")
      }
    })

  }

  clearCart() {
    this.spinner.show()
    const session_id = localStorage.getItem('session_id')
    this.apiService.clearCart(session_id).subscribe({
      next: (res) => {
        console.log(res);
        this.spinner.hide()
        this.toast.success("Cart Cleared")
        this.fetchCart()
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toast.error("Something went wrong")
      }
    })
  }

  checkout() {
    const amount = this.summary?.totalAmount
    const session_id = localStorage.getItem('session_id')
    if (!amount) {
      this.toast.error("Invalid amount for checkout");
      return;
    }

    if (!this.paymentType) {
      this.toast.warning("Please select a payment type");
      return;
    }

    // if (this.paymentType === "COD") {
    //   this.spinner.show();
    //   const data = { name: this.name?.value, email: this.email?.value, amount: amount, paymentType: 'COD', address1: this.addressLine1?.value, address2: this.addressLine2?.value, city: this.city?.value, state: this.state?.value, zipCode: this.zipCode?.value, altPhone: this.altPhone?.value, session_id: session_id }
    //   this.apiService.createOrder(data).subscribe({
    //     next: (res: any) => {
    //       this.spinner.hide();
    //       if (res.success) {
    //         this.apiService.clearCart(session_id).subscribe({
    //           next: () => {
    //             this.fetchCart();
    //             this.spinner.hide();
    //             this.router.navigate(['/store']);
    //             this.toast.success("Order placed successfully (COD)");
    //           },
    //           error: (clearErr) => {
    //             console.error("Unable to clear cart after COD order:", clearErr);
    //             this.spinner.hide()
    //           }
    //         });
    //       } else {
    //         this.toast.error("Failed to place COD order");
    //         this.spinner.hide()
    //       }
    //     },
    //     error: (err) => {
    //       this.spinner.hide();
    //       console.error("COD Order Error:", err);
    //       this.toast.error("Server error while placing COD order");
    //     }
    //   });
    // }

    if (this.paymentType === 'Razorpay') {
      const data = { name: this.name?.value, email: this.email?.value, amount: amount, paymentType: 'Razorpay', address1: this.addressLine1?.value, address2: this.addressLine2?.value, city: this.city?.value, state: this.state?.value, zipCode: this.zipCode?.value, altPhone: this.altPhone?.value, session_id: session_id }
      console.log('Payload of Razorpay', data);
      this.apiService.createOrder(data).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.success && res.order) {
            const options = {
              key: 'rzp_test_RckkIXSi11DJwB',
              amount: res.order.amount,
              currency: res.order.currency,
              name: 'Tea House',
              description: 'Order Payment',
              order_id: res.order.id,
              handler: (response: any) => {
                this.apiService.verifyPayment({
                  ...response,
                 amount: res?.order?.amount,
                  name: this.name?.value,
                  email: this.email?.value,
                  session_id: session_id,
                  address1: this.addressLine1?.value,
                  address2: this.addressLine2?.value,
                  city: this.city?.value,
                  state: this.state?.value,
                  zipCode: this.zipCode?.value,
                  altPhone: this.altPhone?.value
                }).subscribe({
                  next: (verifyRes: any) => {
                    if (verifyRes.success) {
                      this.toast.success("Payment verified successfully!");
                      this.router.navigate(['/store'])
                      this.apiService.clearCart(session_id).subscribe({
                        next: () => {
                          this.fetchCart();
                        },
                        error: (clearErr) => {
                          console.error("Unable to clear cart after payment:", clearErr);
                        }
                      });
                    } else {
                      this.toast.error("Payment verification failed!");
                    }
                  },
                  error: (err) => {
                    console.error("Verification Error:", err);
                    this.toast.error("Server error while verifying payment!");
                  }
                });
              },
              prefill: {
                name: 'John Doe',
                email: 'john@example.com',
                contact: '9999999999',
              },
              theme: {
                color: '#8B4513'
              }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            console.error('Order creation failed', res);
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    }

    // else if (this.paymentType === 'Razorpay') {
    //   this.apiService.createOrder({ amount: amount, paymentType: 'Razorpay' }).subscribe({
    //     next: (res: any) => {
    //       console.log(res);
    //       if (res.success && res.order) {
    //         const options = {
    //           key: 'rzp_test_RckkIXSi11DJwB',
    //           amount: res.order.amount,
    //           currency: res.order.currency,
    //           name: 'Tea House',
    //           description: 'Order Payment',
    //           order_id: res.order.id,
    //           handler: (response: any) => {
    //             this.apiService.verifyPayment(response).subscribe({
    //               next: (verifyRes: any) => {
    //                 if (verifyRes.success) {
    //                   this.toast.success("Payment verified successfully!");
    //                   this.apiService.clearCart().subscribe({
    //                     next: () => {
    //                       this.fetchCart();
    //                     },
    //                     error: (clearErr) => {
    //                       console.error("Unable to clear cart after payment:", clearErr);
    //                     }
    //                   });
    //                 } else {
    //                   this.toast.error("Payment verification failed!");
    //                 }
    //               },
    //               error: (err) => {
    //                 console.error("Verification Error:", err);
    //                 this.toast.error("Server error while verifying payment!");
    //               }
    //             });
    //           },
    //           prefill: {
    //             name: 'John Doe',
    //             email: 'john@example.com',
    //             contact: '9999999999',
    //           },
    //           theme: {
    //             color: '#8B4513'
    //           }
    //         };

    //         const rzp = new (window as any).Razorpay(options);
    //         rzp.open();
    //       } else {
    //         console.error('Order creation failed', res);
    //       }
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     }
    //   })
    // }
  }

  placeOrder() {
    if (this.addressForm.valid) {
      console.log("Address Data:", this.addressForm.value);
      this.checkout()
    } else {
      console.log('form is invalid');
      this.addressForm.markAllAsTouched()
    }
  }


  applyCoupon() {
    const session_id = localStorage.getItem("session_id");

    if (!this.couponCode) {
      this.toast.warning("Please enter a coupon code");
      return;
    }

    this.apiService.getCart(session_id!, this.couponCode).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.cartItems = res.data.items;
          this.summary = res.data.summary;
          this.toast.success("Coupon applied!");
          // this.fetchCart()
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => {
        this.toast.error("Invalid or expired coupon");
      }
    });

  }


}