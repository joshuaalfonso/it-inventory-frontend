import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { PurchaseOrderList } from '../../purchase-order.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { PurchaseOrderStore } from '../../store/purchase-order.store';
import { take } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-purchase-order-table',
  standalone: true,
  imports: [CommonModule, RouterModule ,TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule, ConfirmDialogModule],
  templateUrl: './purchase-order-table.component.html',
  styleUrl: './purchase-order-table.component.css'
})
export class PurchaseOrderTableComponent {

  @Input() purchaseOrder!: Signal<PurchaseOrderList[]>;

   menus: MenuItem[] | undefined;
  
  // dialogStore = inject(BrandDialogStore);

  @ViewChild('menu') menu!: Menu;
  selectedItem!: PurchaseOrderList;

  router = inject(Router);
  purchaseOrderStore = inject(PurchaseOrderStore);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  // [routerLink]="['/purchase-order/create-edit', 0]" 

  ngOnInit(): void {
    
  }

  openMenu(event: MouseEvent, item: PurchaseOrderList) {
    this.selectedItem = item;
    this.menu.toggle(event);
      if (this.selectedItem.status === 0) {
        this.menus = [
          {
            label: 'Options',
            items: [
               {
                label: 'View Details',
                icon: 'pi pi-eye',
                command: () => this.router.navigate(['/purchase-order/', this.selectedItem.purchase_order_id]),
              },
              {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.router.navigate(['/purchase-order/create-edit', this.selectedItem.purchase_order_id]),
              },
              {
                label: 'Approve',
                icon: 'pi pi-check',
                // command: () => this.approve()
                command: () => this.confirmApprovePO()
              }
            ]
          }
        ];
      } else {
        this.menus = [
          {
            label: 'Options',
            items: [
              {
                label: 'View Details',
                icon: 'pi pi-eye',
                command: () => this.router.navigate(['/purchase-order/', this.selectedItem.purchase_order_id]),
              },
            ]
          }
        ]
      }
  }

  approve() {
    if (!this.selectedItem.purchase_order_id) return;
    this.purchaseOrderStore.approvePurchaseOrder(this.selectedItem.purchase_order_id)
    .pipe(take(1))
    .subscribe({
      next: (response) => {
        console.log(response)
        this.messageService.add({
          severity: 'info',
          summary: 'Approved',
          detail: response.message || 'Item approved.'
        })
      },
      error: ({error}) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Something went wrong.'
        })
      }
    })
  }

  confirmApprovePO() {
    this.confirmationService.confirm({
      // target: event.target as EventTarget,
      message: `Are you sure that you want to approve '${this.selectedItem.purchase_order_number}' ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptLabel:"Yes, Approve",
      rejectLabel:"Cancel",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
          this.approve();
      },
      // reject: () => {
      //     this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      // }
    });
  }

}
