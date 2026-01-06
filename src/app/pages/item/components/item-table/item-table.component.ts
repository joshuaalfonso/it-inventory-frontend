import { Component, inject, Input, OnInit, Signal, ViewChild } from '@angular/core';
import { ItemList } from '../../item.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ImageModule } from 'primeng/image';
import { IMAGE_BASE_URL } from '../../../../shared/constant/image';
import { MenuItem } from 'primeng/api';
import { ItemDialogStore } from '../../item.component';

@Component({
  selector: 'app-item-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule , MenuModule, InputTextModule, IconFieldModule, InputIconModule, ImageModule, MenuModule],
  templateUrl: './item-table.component.html',
  styleUrl: './item-table.component.css'
})
export class ItemTableComponent implements OnInit {

  dialogStore = inject(ItemDialogStore);

  @Input() item!: Signal<ItemList[]>;
  
  imageBaseUrl = IMAGE_BASE_URL;

  menus: MenuItem[] | undefined;
  @ViewChild('menu') menu!: Menu;
  selectedItem!: ItemList;

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

    openMenu(event: MouseEvent, item: ItemList) {
      this.selectedItem = item;
      this.menu.toggle(event);
    }

}
