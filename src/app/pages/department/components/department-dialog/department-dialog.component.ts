import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DepartmentDialogStore } from '../../department.component';
import { DepartmentStore } from '../../store/department.store';
import { MessageService } from 'primeng/api';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule, DropdownModule],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.css'
})
export class DepartmentDialogComponent {

  dialogStore = inject(DepartmentDialogStore);
  departmentStore = inject(DepartmentStore);
  messageService = inject(MessageService);
  
  departmentForm = this.fb.group({
    department_id: [0, [Validators.required]],
    department_name: ['', [Validators.required, Validators.minLength(2)]],
  });

  submitted: boolean = false;
  isWorking: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.departmentForm.setValue({
          department_id: selectedItem.department_id,
          department_name: selectedItem.department_name,
        })
      } else {
        this.departmentForm.reset({
          department_id: 0
        })
      }
    }, {allowSignalWrites: true})
  }

  onSubmit() {
    this.submitted = true;
    if (!this.departmentForm.valid) return

    const formValue = this.departmentForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.department_id === selectedItem.department_id &&
      formValue.department_name === selectedItem.department_name 
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }
  
    const data = {
      department_id: formValue.department_id || 0,
      department_name: formValue.department_name || '',
    }

    this.isWorking = true;

    let obs = formValue.department_id != 0 ? this.departmentStore.updateDepartment(data) : this.departmentStore.createDepartment(data);
    
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
    this.departmentForm.reset({
      department_id: 0
    })
  }

}
