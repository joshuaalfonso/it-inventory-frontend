import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseOrderService } from '../../purchase-order.service';
import { PurchaseOrderList } from '../../purchase-order.model';
import { finalize, take } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, LoadingSpinnerComponent, DividerModule, TableModule, RouterModule, AnimateOnScrollModule],
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.css'
})
export class PurchaseOrderDetailComponent implements OnInit {

  route = inject(ActivatedRoute);
  purchaseOrderService = inject(PurchaseOrderService);
  location = inject(Location);

  purchaseOrder: PurchaseOrderList | undefined;
  isLoading: boolean = false;
  error: boolean = false;
  imageBaseUrl = IMAGE_BASE_URL;

  ngOnInit(): void {
    const purchaseOrderID = this.route.snapshot.paramMap.get('purchase_order_id');
    const purchaseOrderIDNumber = Number(purchaseOrderID || 0);
    
    if (purchaseOrderIDNumber) {
      this.error = false;
      this.isLoading = true;
      this.purchaseOrderService.getPurchaseOrderByIDApi(purchaseOrderIDNumber)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          console.log(response)
          this.purchaseOrder = response;
        },
        error: (error) => {
          console.error(error)
          this.error = true;
        }
      })
    }

  }

  goBack() {
    this.location.back();
  }

}
