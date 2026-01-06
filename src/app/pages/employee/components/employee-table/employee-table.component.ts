import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { EmployeeList } from '../../employee.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { EmployeeDialogStore } from '../../employee.component';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css'
})
export class EmployeeTableComponent {

  @Input() employee!: Signal<EmployeeList[]>;

  menus: MenuItem[] | undefined;
  
  dialogStore = inject(EmployeeDialogStore);
  
  @ViewChild('menu') menu!: Menu;
  selectedItem!: EmployeeList;

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

  openMenu(event: MouseEvent, item: EmployeeList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
