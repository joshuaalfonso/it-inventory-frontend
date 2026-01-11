import { Component, Input, Output, Signal } from '@angular/core';
import { IncomingList } from '../../incoming.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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

}
