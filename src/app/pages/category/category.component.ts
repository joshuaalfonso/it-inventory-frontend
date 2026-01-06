import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { CategoryStore } from './store/category.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { CategoryList } from './category.model';

export const CategoryDialogStore = DialogStore<CategoryList>();

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CategoryTableComponent, CategoryDialogComponent, LoadingSpinnerComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  providers: [CategoryDialogStore]
})
export class CategoryComponent implements OnInit {

  categoryStore = inject(CategoryStore);


  ngOnInit(): void {
    this.categoryStore.loadCategory();
  }

}
