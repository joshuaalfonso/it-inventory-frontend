import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UnitOfMeasureDialogComponent } from './components/unit-of-measure-dialog/unit-of-measure-dialog.component';
import { UnitOfMeasureTableComponent } from './components/unit-of-measure-table/unit-of-measure-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { UnitOfMeasureList } from './unit-of-measure.model';
import { UnitOfMeasureStore } from './store/unit-of-measure.store';

export const UnitOfMeasureDialogStore = DialogStore<UnitOfMeasureList>();

@Component({
  selector: 'app-unit-of-measure',
  standalone: true,
  imports: [CommonModule, UnitOfMeasureDialogComponent, UnitOfMeasureTableComponent, LoadingSpinnerComponent],
  templateUrl: './unit-of-measure.component.html',
  styleUrl: './unit-of-measure.component.css',
  providers: [UnitOfMeasureDialogStore]
})
export class UnitOfMeasureComponent implements OnInit {

  unitOfMeasureStore = inject(UnitOfMeasureStore);


  ngOnInit(): void {
    this.unitOfMeasureStore.loadUnitOfMeasure();
  }

}
