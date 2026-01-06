import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { DepartmentList } from '../../department.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { DepartmentDialogStore } from '../../department.component';

@Component({
  selector: 'app-department-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './department-table.component.html',
  styleUrl: './department-table.component.css'
})
export class DepartmentTableComponent {

  @Input() department!: Signal<DepartmentList[]>;

  menus: MenuItem[] | undefined;
  
  dialogStore = inject(DepartmentDialogStore);
  
  @ViewChild('menu') menu!: Menu;
  selectedItem!: DepartmentList;

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

  openMenu(event: MouseEvent, item: DepartmentList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
