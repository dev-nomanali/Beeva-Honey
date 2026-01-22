import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../Services/api-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.error = null;
    this.spinner.show();

    this.apiService.getOrders().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.loading = false;
        if (res && res.success && Array.isArray(res.orders)) {
          this.orders = res.orders;
        } else {
          this.orders = [];
          this.error = 'No orders found';
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.loading = false;
        this.error = 'Failed to load orders';
        this.toast.error('Failed to load orders. Please try again.');
        console.error('Error fetching orders:', err);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'success':
      case 'delivered':
        return 'badge bg-success';
      case 'pending':
      case 'processing':
        return 'badge bg-warning';
      case 'cancelled':
      case 'failed':
        return 'badge bg-danger';
      case 'shipped':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  canCancel(orderDate: string): boolean {
    const orderCreatedTime = new Date(orderDate).getTime();
    const currentTime = Date.now();
    const timeDifference = currentTime - orderCreatedTime;
    const hoursPassed = timeDifference / (1000 * 60 * 60);
    if (hoursPassed < 24) {
      return true;   // can cancel
    }
    return false;    // can't cancel
  }


  cancelOrder(orderId: any) {
    if (orderId) {
      this.spinner.show()
      this.apiService.cancelOrder(orderId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.spinner.hide();
          this.toast.success("Order cancelled successfully")
          this.fetchOrders()
        },
        error: (error: any) => {
          console.log(error);
          this.spinner.hide()
          this.toast.error("Something went wrong")
        }
      })

    }

  }



}
