import { Component, inject, Input, OnInit, Signal, ViewChild } from '@angular/core';
import { CategoryList } from '../../category.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuItem } from 'primeng/api';
import { CategoryDialogStore } from '../../category.component';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent implements OnInit {

  @Input() category!: Signal<CategoryList[]>;

  menus: MenuItem[] | undefined;

  dialogStore = inject(CategoryDialogStore);
  
  @ViewChild('menu') menu!: Menu;
  selectedItem!: CategoryList;

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

  openMenu(event: MouseEvent, item: CategoryList) {
    this.selectedItem = item;
    this.menu.toggle(event);
  }

}
