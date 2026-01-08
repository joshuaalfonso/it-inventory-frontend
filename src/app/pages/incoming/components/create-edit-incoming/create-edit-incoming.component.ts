import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PurchaseOrderStore } from '../../../purchase-order/store/purchase-order.store';
import { PurchaseOrderService } from '../../../purchase-order/purchase-order.service';
import { Dialog, DialogModule } from 'primeng/dialog';
import { finalize, take } from 'rxjs';
import { PurchaseOrderList } from '../../../purchase-order/purchase-order.model';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';

@Component({
  selector: 'app-create-edit-incoming',
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarModule, DropdownModule, DialogModule, TableModule],
  templateUrl: './create-edit-incoming.component.html',
  styleUrl: './create-edit-incoming.component.css'
})
export class CreateEditIncomingComponent implements OnInit {

  imageBaseUrl = IMAGE_BASE_URL;

  route = inject(ActivatedRoute);
  location = inject(Location);
  messageService = inject(MessageService);

  purchaseOrderStore = inject(PurchaseOrderStore);
  purchaseOrderService = inject(PurchaseOrderService);

  purchaseOrder!: PurchaseOrderList;
  isPurchaseOrderVisible: boolean = false;
  isPurchaseOrderLoading: boolean = false;
  @ViewChild('purchaseOrderDialog') purchaseOrderDialog!: Dialog;

  ngOnInit(): void {
    this.purchaseOrderStore.loadPurchaseOrder();
  }

  goBack() {
    this.location.back();
  }

  onSelectPurchaseOrder(purchaseOrderID: number) {
    if (!purchaseOrderID) return

    this.isPurchaseOrderLoading = true;
    this.purchaseOrderService.getPurchaseOrderByIDApi(purchaseOrderID)
    .pipe(
      take(1),
      finalize(() => this.isPurchaseOrderLoading = false)
    )
    .subscribe({
      next: (response) => {
        console.log(response)
        this.isPurchaseOrderVisible = true;
        this.purchaseOrderDialog.maximize();
        this.purchaseOrder = response;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong.'
        })
      }
    })
  }

}
