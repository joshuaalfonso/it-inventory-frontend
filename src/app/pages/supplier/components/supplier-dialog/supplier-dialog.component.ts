import { Component, effect, inject } from '@angular/core';
import { SupplierDialogStore } from '../../supplier.component';
import { SupplierStore } from '../../store/supplier.store';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';


@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule],
  templateUrl: './supplier-dialog.component.html',
  styleUrl: './supplier-dialog.component.css'
})
export class SupplierDialogComponent {

  dialogStore = inject(SupplierDialogStore);
  supplierStore = inject(SupplierStore);
  messageService = inject(MessageService)
  
  supplierForm = this.fb.group({
    supplier_id: [0, [Validators.required]],
    supplier_name: ['', [Validators.required, Validators.minLength(2)]],
    supplier_address: ['', [Validators.required]],
    contact_person: ['', [Validators.required]],
    contact_number: ['', [Validators.required]],
  });

  submitted: boolean = false;
  isWorking: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    effect(() => {
      const selectedItem = this.dialogStore.selectedItem();
      if (selectedItem) {
        this.supplierForm.setValue({
          supplier_id: selectedItem.supplier_id,
          supplier_name: selectedItem.supplier_name,
          supplier_address: selectedItem.supplier_address,
          contact_person: selectedItem.contact_person,
          contact_number: selectedItem.contact_number
        })
      } else {
        this.supplierForm.reset({
          supplier_id: 0
        })
      }
    })
  }
  
  onSubmit() {
    this.submitted = true;
    if (!this.supplierForm.valid) return

    const formValue = this.supplierForm.value;
    const selectedItem = this.dialogStore.selectedItem();

    if (selectedItem && (
      formValue.supplier_id === selectedItem.supplier_id &&
      formValue.supplier_name === selectedItem.supplier_name && 
      formValue.supplier_address === selectedItem.supplier_address && 
      formValue.contact_person === selectedItem.contact_person && 
      formValue.contact_number === selectedItem.contact_number  
    )) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'No changes made.' 
      })
      return
    }

    const data = {
      supplier_id: formValue.supplier_id || 0,
      supplier_name: formValue.supplier_name || '',
      supplier_address: formValue.supplier_address || '',
      contact_person: formValue.contact_person || '',
      contact_number: formValue.contact_number || ''
    }

    this.isWorking = true;

    let obs = data.supplier_id != 0 ? this.supplierStore.updateSupplier(data) : this.supplierStore.createSupplier(data);
    
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
    this.supplierForm.reset({
      supplier_id: 0
    })
  }

}
