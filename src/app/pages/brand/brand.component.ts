import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandDialogComponent } from './components/brand-dialog/brand-dialog.component';
import { BrandTableComponent } from './components/brand-table/brand-table.component';
import { BrandStore } from './store/brand.store';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { BrandList } from './brand.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';


export const BrandDialogStore = DialogStore<BrandList>();

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [CommonModule, BrandDialogComponent, BrandTableComponent, LoadingSpinnerComponent],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
  providers: [BrandDialogStore]
})

export class BrandComponent implements OnInit {

  brandStore = inject(BrandStore);

  constructor(
    
  ) {}

  ngOnInit(): void { 
    this.brandStore.loadBrand();
  }

}
