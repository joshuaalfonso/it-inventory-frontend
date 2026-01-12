import { Component, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { IncomingList } from '../../incoming.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-incoming-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule ,TableModule, ButtonModule, MenuModule, InputTextModule, IconFieldModule, InputIconModule, ConfirmDialogModule],
  templateUrl: './incoming-table.component.html',
  styleUrl: './incoming-table.component.css'
})
export class IncomingTableComponent {

  // @Output() incoming!: Signal<IncomingList[]>;
  @Input() incoming: IncomingList[] = [];

  menus: MenuItem[] | undefined;

  @ViewChild('menu') menu!: Menu;
  selectedItem!: IncomingList;

  router = inject(Router);

  openMenu(event: MouseEvent, item: IncomingList) {
    this.selectedItem = item;
    this.menu.toggle(event);
      
    this.menus = [
      {
        label: 'Options',
        items: [
          {
            label: 'View Details',
            icon: 'pi pi-eye',
            command: () => this.router.navigate(['/incoming/', this.selectedItem.incoming_id]),
          },
        ]
      }
    ];
        
    }

}
