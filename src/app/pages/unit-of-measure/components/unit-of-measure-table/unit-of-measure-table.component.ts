import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { UnitOfMeasureList } from '../../unit-of-measure.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { UnitOfMeasureDialogStore } from '../../unit-of-measure.component';

@Component({
  selector: 'app-unit-of-measure-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './unit-of-measure-table.component.html',
  styleUrl: './unit-of-measure-table.component.css'
})
export class UnitOfMeasureTableComponent {

  @Input() unitOfMeasure!: Signal<UnitOfMeasureList[]>;

  menus: MenuItem[] | undefined;
  
  dialogStore = inject(UnitOfMeasureDialogStore);
  
  @ViewChild('menu') menu!: Menu;
  selectedItem!: UnitOfMeasureList;

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

  openMenu(event: MouseEvent, item: UnitOfMeasureList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
