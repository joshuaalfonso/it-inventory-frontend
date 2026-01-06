import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ItemStore } from '../../../item/store/item.store';
import { EmployeeStore } from '../../../employee/store/employee.store';
import { PurchaseOrderStore } from '../../store/purchase-order.store';
import { PurchaseOrderItemPost } from '../../purchase-order.model';
import { finalize, take, UnsubscriptionError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../../purchase-order.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';


// export interface PurchaseOrderPost {
//   purchase_order_id: number
//   purchase_order_date: string | null
//   purchase_order_number: string
//   purchase_requisition_number: string | null
//   delivery_date: string | null
//   total_quantity: number
//   purchase_order_item: PurchaseOrderItemPost[]
// }

// export interface PurchaseOrderItemPost {
//   purchase_order_item_id: number | undefined
//   item_id: number
//   employee_id: number
//   ordered_quantity: number
//   price: number
// }


@Component({
  selector: 'app-create-edit-purchase-order',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent ,ReactiveFormsModule, CalendarModule, InputTextModule, TableModule, InputNumberModule, DropdownModule],
  templateUrl: './create-edit-purchase-order.component.html',
  styleUrl: './create-edit-purchase-order.component.css'
})
export class CreateEditPurchaseOrderComponent implements OnInit {

  purchaseOrderStore = inject(PurchaseOrderStore);
  purchaseOrderService = inject(PurchaseOrderService);
  itemStore = inject(ItemStore);
  employeeStore = inject(EmployeeStore);
  route = inject(ActivatedRoute);

  purchaseOrderForm = this.fb.group({
    purchase_order_id: [0, [Validators.required]],
    purchase_order_date: this.fb.control<Date | null>(null, Validators.required),
    purchase_order_number: ['', [Validators.required]],
    purchase_requisition_number: ['', [Validators.required]],
    delivery_date: this.fb.control<Date | null>(null, Validators.required),
    total_quantity: [0],
    purchase_order_item: this.fb.array([])
  })

  submitted: boolean = false;
  isWorking: boolean = false;

  isLoading : boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.itemStore.loadItem();
    this.employeeStore.loadEmployee();

    const purchaseOrderID = this.route.snapshot.paramMap.get('purchase_order_id');
    const purchaseOrderIDNumber = Number(purchaseOrderID || 0)
    // this.purchaseOrderService.getPurchaseOrderByIDApi
    
    if (purchaseOrderIDNumber) {
      this.isLoading = true;
      this.purchaseOrderService.getPurchaseOrderByIDApi(purchaseOrderIDNumber)
      .pipe(
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          
          if (response) {
            this.purchaseOrderForm.patchValue({
              purchase_order_id: response.purchase_order_id,
              purchase_order_date: new Date(response.purchase_order_date),
              purchase_order_number: response.purchase_order_number,
              purchase_requisition_number: response.purchase_requisition_number,
              delivery_date: new Date(response.delivery_date ),
              total_quantity: response.total_quantity,
            })

            console.log(response.purchase_order_item)

            response.purchase_order_item.forEach((item) => this.purchaseOrderItems.push(this.createPurchaseOrderItem(item)))
          }

        },
        error: (err) => {
          console.log(err)
        }
      })
    }

  }

  goBack() {
    this.location.back();
  }

  createPurchaseOrderItem(
    data?: Partial<{
      purchase_order_item_id: number;
      item_id: number | null;
      employee_id: number | null;
      ordered_quantity: number;
      price: number;
    }>
  ): FormGroup {
    return this.fb.group({
      purchase_order_item_id: [data?.purchase_order_item_id ?? 0],
      item_id: [data?.item_id ?? null, Validators.required],
      employee_id: [data?.employee_id ?? null, Validators.required],
      ordered_quantity: [
        data?.ordered_quantity ?? 0,
        [Validators.required, Validators.min(1)],
      ],
      price: [
        data?.price ?? 0,
        [Validators.required, Validators.min(1)],
      ],
    });
  }


  get purchaseOrderItems(): FormArray {
    return this.purchaseOrderForm.get('purchase_order_item') as FormArray;
  }

  addRow() {
    this.purchaseOrderItems.push(this.createPurchaseOrderItem());
  }

  removeRow(index: number) {
    this.purchaseOrderItems.removeAt(index);
  }

  get totalQuantity() {
    let total = 0;

    this.purchaseOrderItems.value.forEach((item: any) => {
      if (item.ordered_quantity > 0) {
        total = total + item.ordered_quantity
      }
    });

    return total

  }

  onSubmit() {
    this.submitted = true;
    if (!this.purchaseOrderForm.valid) return
    const formValue = this.purchaseOrderForm.value
    

    const data = {
      ...formValue,
      purchase_order_id: formValue.purchase_order_id || 0,
      purchase_order_number: formValue.purchase_order_number || null,
      purchase_requisition_number: formValue.purchase_requisition_number || null,
      purchase_order_date: formValue.purchase_order_date ? new Date(formValue.purchase_order_date).toLocaleDateString('en-CA') : null,
      delivery_date: formValue.delivery_date ? new Date(formValue.delivery_date).toLocaleDateString('en-CA') : null,
      total_quantity: this.totalQuantity,
      purchase_order_item: formValue.purchase_order_item as PurchaseOrderItemPost[]
    }

    console.log(data)
    let obs = data.purchase_order_id ? this.purchaseOrderStore.updatePurchaseOrder(data) : this.purchaseOrderStore.createPurchaseOrder(data);

    obs
    .pipe(take(1)).subscribe({
      next: (response) => {
        if (response.success) {
          this.location.back();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'No response message.'
            
          })
        }
      },
      error: ({error}) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Something went wrong.'
        })
      }
    })


  }


}
