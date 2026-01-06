import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SupplierTableComponent } from './components/supplier-table/supplier-table.component';
import { SupplierDialogComponent } from './components/supplier-dialog/supplier-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SupplierStore } from './store/supplier.store';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { SupplierList } from './supplier.model';

export const SupplierDialogStore = DialogStore<SupplierList>();

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, SupplierTableComponent, SupplierDialogComponent, LoadingSpinnerComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
  providers: [SupplierDialogStore]
})
export class SupplierComponent implements OnInit {


  supplierStore = inject(SupplierStore);

  ngOnInit(): void {
    this.supplierStore.loadSupplier();
  }

}
