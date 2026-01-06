import { Component, inject, Input, OnInit, Signal, ViewChild } from '@angular/core';
import { ItemTypeList } from '../../item-type.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ItemTypeDialogStore } from '../../item-type.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-item-type-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './item-type-table.component.html',
  styleUrl: './item-type-table.component.css'
})
export class ItemTypeTableComponent implements OnInit {

  @Input() itemType!: Signal<ItemTypeList[]>;

  menus: MenuItem[] | undefined;
  
  dialogStore = inject(ItemTypeDialogStore);
  
  @ViewChild('menu') menu!: Menu;
  selectedItem!: ItemTypeList;

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
  
  openMenu(event: MouseEvent, item: ItemTypeList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
