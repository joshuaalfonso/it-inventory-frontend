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
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { IncomingService } from '../../incoming.service';
import { IncomingStore } from '../../store/incoming.store';


@Component({
  selector: 'app-create-edit-incoming',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CalendarModule, DropdownModule, DialogModule, TableModule, InputNumberModule],
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
  incomingService = inject(IncomingService);
  incomingStore = inject(IncomingStore);
  fb = inject(FormBuilder);

  purchaseOrder!: PurchaseOrderList;
  isPurchaseOrderVisible: boolean = false;
  isPurchaseOrderLoading: boolean = false;
  @ViewChild('purchaseOrderDialog') purchaseOrderDialog!: Dialog;

  incomingForm = this.fb.group({
    incoming_id: [0, [Validators.required]],
    incoming_date: this.fb.control<Date | null>(null, Validators.required),
    purchase_order_id: this.fb.control<number>(0, Validators.min(1)),
    total_quantity: [0],
    remarks: [''],
    incoming_item: this.fb.array([])
  })

  selectedIncomingRow: any[] = [];

  submitted: boolean = false;
  isWorking: boolean = false;

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

  get incomingItems(): FormArray {
      return this.incomingForm.get('incoming_item') as FormArray;
  }

  onSelectItem(event: any) {
    // this.selectedIncomingRow.push(event);
    console.log(event)
    this.incomingItems.push(this.createIncomingItem(event))
  }

  onRemoveItem(event: any) {
    console.log(event)

    const index = this.incomingItems.value.findIndex((item: any) => item.purchase_order_item_id === event.purchase_order_item_id);

    this.incomingItems.removeAt(index)

  }

  createIncomingItem(
    data?: Partial<{
      incoming_item_id: number;
      incoming_id: number;
      purchase_order_item_id: number;
      ordered_quantity: number;
      received_quantity: number;
      item_id: number;
      item_name: string;
      image_name: string;
      brand_name: string;
      category_name: string;
      item_type_name: string;
      uom_name: string;
    }>
  ): FormGroup {
    return this.fb.group({
      incoming_item_id: [data?.incoming_id ?? 0, Validators.required],
      incoming_id: [data?.incoming_id ?? 0, Validators.required],
      purchase_order_item_id: [data?.purchase_order_item_id ?? 0, Validators.required],
      ordered_quantity: [data?.ordered_quantity ?? 0],
      received_quantity: [
        data?.received_quantity ?? 0,
        [Validators.required, Validators.min(1)],
      ],
      item_id: [data?.item_id ?? ''],
      item_name: [data?.item_name ?? ''],
      image_name: [data?.image_name ?? ''],
      brand_name: [data?.brand_name ?? ''],
      category_name: [data?.category_name ?? ''],
      item_type_name: [data?.item_type_name ?? ''],
      uom_name: [data?.uom_name ?? ''],
    });
  }

  addRow() {
    this.incomingItems.push(this.createIncomingItem());
  }

  removeRow(index: number) {
    this.incomingItems.removeAt(index);
    this.selectedIncomingRow.splice(index, 1)
  }

  get totalQuantity() {
    let total = 0;

    this.incomingItems.value.forEach((item: any) => {
      if (item.received_quantity > 0) {
        total = total + item.received_quantity
      }
    });

    return total

  }

  onSubmit() {
    this.submitted = true;

    if (!this.incomingForm.valid) return
    const formValue = this.incomingForm.value;
    
    const data = {
      ...formValue,
      purchase_order_id: formValue.purchase_order_id || 0,
      incoming_date: formValue.incoming_date ? new Date(formValue.incoming_date).toLocaleDateString('en-CA') : null,
      total_quantity: this.totalQuantity,
      incoming_item: formValue.incoming_item as any[]
    }

    console.log(data)
    // this.incomingService.createIncomingApi(data)
    this.incomingStore.createIncoming(data)
    .pipe(take(1)).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Successfully created.'
        })
        this.goBack();
      },
      error: ({error}) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Success',
          detail: error.message || 'Successfully created.'
        })
      }
    })

  }

}
