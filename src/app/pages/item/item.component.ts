import { Component, inject, OnInit } from '@angular/core';
import { ItemDialogComponent } from './components/item-dialog/item-dialog.component';
import { ItemTableComponent } from './components/item-table/item-table.component';
import { ItemStore } from './store/item.store';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { IMAGE_BASE_URL } from '../../shared/constant/image';
import { ButtonModule } from 'primeng/button';
import { ItemCardsComponent } from './components/item-cards/item-cards.component';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { ItemFilterComponent } from './components/item-filter/item-filter.component';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { ItemList } from './item.model';
import { BrandStore } from '../brand/store/brand.store';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { UnitOfMeasureStore } from '../unit-of-measure/store/unit-of-measure.store';
import { ItemTypeStore } from '../item-type/store/item-type.store';
import { CategoryStore } from '../category/store/category.store';

export const ItemDialogStore = DialogStore<ItemList>();

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemDialogComponent, ItemTableComponent, ItemCardsComponent, ItemFilterComponent, SelectButtonModule, ButtonModule, InputTextModule, SidebarModule, DividerModule, ChipModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  providers: [ItemDialogStore]
})

export class ItemComponent implements OnInit {

  itemStore = inject(ItemStore);
  brandStore = inject(BrandStore);
  categoryStore = inject(CategoryStore);
  itemTypeStore = inject(ItemTypeStore);
  unitOfMeasureStore = inject(UnitOfMeasureStore);
  dialogStore = inject(ItemDialogStore);

  currentView: string = 'list';

  viewOptions: any[] = [
    { icon: 'pi pi-list', value: 'list' },
    { icon: 'pi pi-th-large', value: 'grid' }
  ];

  imageBaseUrl = IMAGE_BASE_URL;

  ngOnInit(): void {
    this.itemStore.loadItem();
    this.brandStore.loadBrand();
    this.categoryStore.loadCategory();
    this.itemTypeStore.loadItemType();
    this.unitOfMeasureStore.loadUnitOfMeasure();
  }

  setSearch(event: any) {
    let searchValue = event.target.value;
    this.itemStore.setSearchFilter(searchValue);
  }

  getBrandValue(brand_id: number) {

    if (!brand_id) return null

    const item = this.brandStore.brand().find(b => b.brand_id === brand_id);

    return item ? item.brand_name : null;

  }

  onRemoveBrand(brand_id: number) {
    this.itemStore.setBrandIds(brand_id);
  }


}
