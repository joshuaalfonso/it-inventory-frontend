import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeDialogStore } from '../../employee.component';
import { EmployeeStore } from '../../store/employee.store';
import { MessageService } from 'primeng/api';
import { finalize, take } from 'rxjs';
import { DepartmentStore } from '../../../department/store/department.store';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule, DropdownModule],
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.css'
})
export class EmployeeDialogComponent {

  dialogStore = inject(EmployeeDialogStore);
  employeeStore = inject(EmployeeStore);
  departmentStore = inject(DepartmentStore);
  messageService = inject(MessageService);
  
  employeeForm = this.fb.group({
    employee_id: [0, [Validators.required]],
    employee_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department_id: [0, [Validators.required, Validators.min(1)]],
  });
  
  submitted: boolean = false;
  isWorking: boolean = false;
  
  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.employeeForm.setValue({
          employee_id: selectedItem.employee_id,
          employee_name: selectedItem.employee_name,
          email: selectedItem.email,
          department_id: selectedItem.department_id,
        })
      } else {
        this.employeeForm.reset({
          employee_id: 0
        })
      }
    }, {allowSignalWrites: true})
  }
  
  onSubmit() {
    this.submitted = true;
    if (!this.employeeForm.valid) return

    const formValue = this.employeeForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.employee_id === selectedItem.employee_id &&
      formValue.employee_name === selectedItem.employee_name &&
      formValue.email === selectedItem.email &&
      formValue.department_id === selectedItem.department_id 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }
  
    const data = {
      employee_id: formValue.employee_id || 0,
      employee_name: formValue.employee_name || '',
      email: formValue.email || '',
      department_id: formValue.department_id || 0,
    }

    this.isWorking = true;

    let obs = formValue.employee_id ? this.employeeStore.updateEmployee(data) : this.employeeStore.createEmployee(data);
    
    obs
    .pipe(
      take(1),
      finalize(() => this.isWorking = false)
    ).subscribe({

      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: response.message || 'No message response' 
        });
        this.onClose();
      },

      error: (error) => {
        console.error(error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.error?.message || 'Something went wrong.',
          life: 5000
        });
      }
      
    })


  }
  
  onClose() {
    this.dialogStore.closeDialog()
    this.submitted = false;
    this.employeeForm.reset({
      employee_id: 0
    })
  }

}
