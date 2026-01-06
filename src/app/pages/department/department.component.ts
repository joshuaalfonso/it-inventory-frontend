import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DepartmentTableComponent } from './components/department-table/department-table.component';
import { DepartmentDialogComponent } from './components/department-dialog/department-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DepartmentStore } from './store/department.store';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { DepartmentList } from './department.model';

export const DepartmentDialogStore = DialogStore<DepartmentList>();

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, DepartmentTableComponent, DepartmentDialogComponent, LoadingSpinnerComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
  providers: [DepartmentDialogStore]
})
export class DepartmentComponent implements OnInit {

  departmentStore = inject(DepartmentStore);

  ngOnInit(): void {
    this.departmentStore.loadDepartment();
  }

}
