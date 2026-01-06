import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PurchaseOrderTableComponent } from './components/purchase-order-table/purchase-order-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PurchaseOrderStore } from './store/purchase-order.store';
import { ItemStore } from '../item/store/item.store';
import { EmployeeStore } from '../employee/store/employee.store';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, PurchaseOrderTableComponent, LoadingSpinnerComponent],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent implements OnInit {

  purchaseOrderStore = inject(PurchaseOrderStore);


  ngOnInit(): void {
    this.purchaseOrderStore.loadPurchaseOrder();
  }

}
