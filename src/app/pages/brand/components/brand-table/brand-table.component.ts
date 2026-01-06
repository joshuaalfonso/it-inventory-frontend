import { Component, inject, Input, OnInit, Signal, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BrandList } from '../../brand.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BrandDialogStore } from '../../brand.component';

@Component({
  selector: 'app-brand-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './brand-table.component.html',
  styleUrl: './brand-table.component.css'
})
export class BrandTableComponent implements OnInit {

  @Input() brand!: Signal<BrandList[]>;

  menus: MenuItem[] | undefined;

  dialogStore = inject(BrandDialogStore);

  @ViewChild('menu') menu!: Menu;
  selectedItem!: BrandList;

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



  openMenu(event: MouseEvent, item: BrandList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
