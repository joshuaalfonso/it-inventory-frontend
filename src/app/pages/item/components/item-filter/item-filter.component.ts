import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BrandStore } from '../../../brand/store/brand.store';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ItemStore } from '../../store/item.store';

@Component({
  selector: 'app-item-filter',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule, CheckboxModule, DividerModule],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.css'
})
export class ItemFilterComponent implements OnInit {


  sidebarVisible: boolean = false;

  brandStore = inject(BrandStore);
  itemStore = inject(ItemStore);

  selectedBrandIds: number[] = [];
  visibleBrandCount = 6;   // how many brands to show initially
  showAllBrands = false;

  ngOnInit(): void {
   
  }
  

selectBrand(brand_id: number) {
    this.itemStore.setBrandIds(brand_id)
  }

  isBrandSelected(brand_id: number):boolean {

    if (this.itemStore.filters()?.brand_id.includes(brand_id)) {
      return true
    } 

    return false

  }

  resetFilters() {
    this.sidebarVisible = false;
    this.itemStore.resetFilters();
  }

  applyFilter() {
    this.sidebarVisible = false;
    // this.itemStore.setBrandIds(this.selectedBrandIds)
  }

  get visibleBrands() {
    const brands = this.brandStore.brand();
    return this.showAllBrands
      ? brands
      : brands.slice(0, this.visibleBrandCount);
  }

  toggleShowMore() {
    this.showAllBrands = !this.showAllBrands;
  }
  



}
