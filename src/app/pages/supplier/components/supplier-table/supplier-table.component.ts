import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { SupplierList } from '../../supplier.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { SupplierDialogStore } from '../../supplier.component';

@Component({
  selector: 'app-supplier-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './supplier-table.component.html',
  styleUrl: './supplier-table.component.css'
})
export class SupplierTableComponent {

  @Input() supplier!: Signal<SupplierList[]>;

  menus: MenuItem[] | undefined;

  dialogStore = inject(SupplierDialogStore);
    
  @ViewChild('menu') menu!: Menu;
  selectedItem!: SupplierList;

  ngOnInit(): void {
    this.menus = [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => this.dialogStore.openDialog(this.selectedItem)
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash'
          }
        ]
      }
    ];
  }

  openMenu(event: MouseEvent, item: SupplierList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
