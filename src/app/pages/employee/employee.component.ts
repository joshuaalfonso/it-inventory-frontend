import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { EmployeeDialogComponent } from './components/employee-dialog/employee-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmployeeStore } from './store/employee.store';
import { DialogStore } from '../../shared/store/dialog/dialog.store';
import { EmployeeList } from './employee.model';
import { DepartmentStore } from '../department/store/department.store';

export const EmployeeDialogStore = DialogStore<EmployeeList>();

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, EmployeeTableComponent, EmployeeDialogComponent, LoadingSpinnerComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  providers: [EmployeeDialogStore]
})
export class EmployeeComponent implements OnInit {


  employeeStore = inject(EmployeeStore);
  departmentStore = inject(DepartmentStore);

  ngOnInit(): void {
    this.employeeStore.loadEmployee();
    this.departmentStore.loadDepartment();
  }

}
